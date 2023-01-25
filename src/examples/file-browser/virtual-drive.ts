import { ConflictBehavior, FileData, Ng3FileList } from "ngx-cloud-storage-types";
import { foodFolder, seaFolder } from "./folder-data";


export const folderMap = new Map<string, Array<FileData>>([
  ['food', foodFolder],
  ['sea', seaFolder],
]);



export class VirtualDrive implements Ng3FileList {
  private last: Array<FileData>;

  constructor(private root: Array<FileData>) {
    this.last = root;
  }

  getFolderItems(itemid: string | undefined): Promise<FileData[]> {
    return new Promise((resolve, reject) => {
      let result = this.last = this.root;
      if (itemid) {
        const item = this.root.find(item => item.id == itemid);
        if (item && item.isfolder) {
          const folder = folderMap.get(item.name);
          if (folder) this.last = result = folder;
        }
      }
      resolve(result);
    });
  }

  getDownloadUrl(itemid: string): Promise<string | undefined> {
    return new Promise((resolve, reject) => {
      resolve(this.last.find(item => item.id == itemid)?.downloadurl);
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
