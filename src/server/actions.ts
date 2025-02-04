"use server";
// every export in here becomes an endpoint, EXERCISE CAUTION

import { and, eq } from "drizzle-orm";
import { files_table } from "./db/schema";
import { auth } from "@clerk/nextjs/server";
import { db } from "./db";
import { UTApi } from "uploadthing/server";
import { cookies } from "next/headers";

const utApi = new UTApi();

export async function deleteFile(fileId: number) {
  const session = await auth();

  if (!session.userId) return { error: "Unauthorized" };

  const [file] = await db
    .select()
    .from(files_table)
    .where(
      and(eq(files_table.id, fileId), eq(files_table.ownerId, session.userId)),
    );

  if (!file) return { error: "File not Found" };

  await utApi.deleteFiles([file.url.replace("https://utfs.io/f/", "")]);

  await db.delete(files_table).where(eq(files_table.id, file.id));

  // NextJS will revalidate your current page with fresh data
  const c = await cookies();
  c.set("force-refresh", JSON.stringify(Math.random()));

  return { success: true };
}
