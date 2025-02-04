import DriveContents from "@drive/app/(home)/drive-content";
import { QUERIES } from "@drive/server/db/queries";

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
    QUERIES.getFiles(folderId),
    QUERIES.getFolders(folderId),
    QUERIES.getParents(folderId),
  ]);

  return (
    <DriveContents
      files={files}
      folders={folders}
      parents={parents}
      currentFolderId={folderId}
    />
  );
}
