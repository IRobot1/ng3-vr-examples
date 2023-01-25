import { ConflictBehavior, FileData, Ng3FileList } from "ngx-cloud-storage-types";

export class VirtualDrive implements Ng3FileList {
  constructor(private data: Array<FileData>) { }

  getFolderItems(itemid: string | undefined): Promise<FileData[]> {
    return new Promise((resolve, reject) => {
      resolve(this.data);
    });
  }

  getDownloadUrl(itemid: string): Promise<string | undefined> {
    return new Promise((resolve, reject) => {
      resolve(this.data.find(item => item.id == itemid)?.downloadurl);
    });
  }


  createFolder(foldername: string, folderid: string | undefined): Promise<FileData | undefined> {
    throw new Error("Method not implemented.");
  }
  createFile(folderid: string | undefined, filename: string, content: string, conflictBehavior: ConflictBehavior): Promise<FileData | undefined> {
    throw new Error("Method not implemented.");
  }
  updateFile(itemid: string, content: string): Promise<FileData | undefined> {
    throw new Error("Method not implemented.");
  }
  renameItem(itemid: string, newname: string): Promise<FileData | undefined> {
    throw new Error("Method not implemented.");
  }
  deleteItem(fileid: string): Promise<number | undefined> {
    throw new Error("Method not implemented.");
  }
  duplicateFile(itemid: string, dupname: string): Promise<undefined> {
    throw new Error("Method not implemented.");
  }

} 
