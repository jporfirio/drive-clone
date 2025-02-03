import { db } from "@drive/server/db";
import { files_table, folders_table } from "@drive/server/db/schema";
import DriveContents from "../../drive-content";
import { eq } from "drizzle-orm";

async function getAllParents(folderId: number) {
  const parents = [];
  let currentId: number | null = folderId;
  while (currentId !== null) {
    const folder = await db
      .selectDistinct()
      .from(folders_table)
      .where(eq(folders_table.id, currentId));

    if (!folder[0]) throw new Error("Parent not found");

    parents.unshift(folder[0]);
    currentId = folder[0]?.parent;
  }
  return parents;
}

export default async function GoogleDriveClone(props: {
  params: Promise<{
    folderId: string;
  }>;
}) {
  const params = await props.params;

  const folderId = parseInt(params.folderId);
  if (isNaN(folderId)) {
    return <div>Invalid Folder ID</div>;
  }

  const [files, folders, parents] = await Promise.all([
    db.select().from(files_table).where(eq(files_table.parent, folderId)),
    db.select().from(folders_table).where(eq(folders_table.parent, folderId)),
    getAllParents(folderId),
  ]);

  return <DriveContents files={files} folders={folders} parents={parents} />;
}
