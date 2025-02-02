import { db } from "@drive/server/db";
import { files_table, folders_table } from "@drive/server/db/schema";
import DriveContents from "./drive-content";

export default async function GoogleDriveClone() {
  const files = await db.select().from(files_table);
  const folders = await db.select().from(folders_table);

  return <DriveContents files={files} folders={folders} />;
}
