
export interface FileData {
  isfolder: boolean,
  id: string;
  name: string;
  extension: string;
  lastmodified: string;
  size: string;
  downloadurl?: string;
}

export interface FilterData {
  name: string,
  filter: string,
}

export type ConflictBehavior = 'fail' | 'replace' | 'rename';

export interface Ng3FileList {
  getFolderItems(itemid: string | undefined): Promise<FileData[]>;
  getDownloadUrl(itemid: string): Promise<string | undefined>;

  createFolder(foldername: string, folderid: string | undefined): Promise<FileData | undefined>;
  createFile(folderid: string | undefined, filename: string, content: string, conflictBehavior: ConflictBehavior): Promise<FileData | undefined>;

  updateFile(itemid: string, content: string): Promise<FileData | undefined>;
  renameItem(itemid: string, newname: string): Promise<FileData | undefined>;

  deleteItem(fileid: string): Promise<number | undefined>;

  duplicateFile(itemid: string, dupname: string): Promise<undefined>;
}
