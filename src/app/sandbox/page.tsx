import { auth } from "@clerk/nextjs/server";
import { mockFolders } from "@drive/lib/mock-data";
import { db } from "@drive/server/db";
import { files_table, folders_table } from "@drive/server/db/schema";
import { eq } from "drizzle-orm";

export default async function SandboxPage() {
  const user = await auth();
  if (!user.userId) throw new Error("User not found");

  const folders = await db
    .select()
    .from(folders_table)
    .where(eq(folders_table.ownerId, user.userId));

  return (
    <>
      {JSON.stringify(folders)}

      <form
        action={async () => {
          "use server";

          const user = await auth();
          if (!user.userId) throw new Error("User not found");

          /* eslint-disable drizzle/enforce-delete-with-where */
          await db.delete(folders_table);
          await db.delete(files_table);
          /* eslint-enable drizzle/enforce-delete-with-where */

          const rootFolder = await db
            .insert(folders_table)
            .values({
              name: "root",
              parent: null,
              ownerId: user.userId,
            })
            .$returningId();

          const folders = mockFolders.map((folder) => ({
            name: folder.name,
            ownerId: user.userId,
            parent: rootFolder[0]!.id,
            createdAt: undefined,
          }));
          await db.insert(folders_table).values(folders);
        }}
      >
        <button type="submit">Seed</button>
      </form>
    </>
  );
}
