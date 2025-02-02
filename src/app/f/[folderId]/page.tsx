import { db } from "@drive/server/db";
import { files_table, folders_table } from "@drive/server/db/schema";
import DriveContents from "../../drive-content";
import { eq } from "drizzle-orm";

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

  const files = await db
    .select()
    .from(files_table)
    .where(eq(files_table.parent, folderId));
  const folders = await db
    .select()
    .from(folders_table)
    .where(eq(folders_table.parent, folderId));

  return <DriveContents files={files} folders={folders} />;
}
