import { ConflictBehavior, FileData, Ng3FileList } from "ngx-cloud-storage-types";

export class ReadOnlyVirtualDrive implements Ng3FileList {
  private current: Array<FileData>;
  private folders = new Map<string, Array<FileData>>([]);

  constructor(private root: Array<FileData>) {
    this.current = root;
  }

  addFolder(name: string, items: Array<FileData>) {
    this.folders.set(name, items);
  }

  removeFolder(name: string) {
    this.folders.delete(name);
  }

  getFolderItems(itemid: string | undefined): Promise<FileData[]> {
    return new Promise((resolve, reject) => {
      let result = this.current = this.root;
      if (itemid) {
        const item = this.root.find(item => item.id == itemid);
        if (item && item.isfolder) {
          const folder = this.folders.get(item.name);
          if (folder) this.current = result = folder;
        }
      }
      resolve(result);
    });
  }

  getDownloadUrl(itemid: string): Promise<string | undefined> {
    return new Promise((resolve, reject) => {
      resolve(this.current.find(item => item.id == itemid)?.downloadurl);
    });
  }


  createFolder(foldername: string, folderid: string | undefined): Promise<FileData | undefined> {
    throw new Error("Drive is read-only.");
  }
  createFile(folderid: string | undefined, filename: string, content: string, conflictBehavior: ConflictBehavior): Promise<FileData | undefined> {
    throw new Error("Drive is read-only.");
  }
  updateFile(itemid: string, content: string): Promise<FileData | undefined> {
    throw new Error("Drive is read-only.");
  }
  renameItem(itemid: string, newname: string): Promise<FileData | undefined> {
    throw new Error("Drive is read-only.");
  }
  deleteItem(fileid: string): Promise<number | undefined> {
    throw new Error("Drive is read-only.");
  }
  duplicateFile(itemid: string, dupname: string): Promise<undefined> {
    throw new Error("Drive is read-only.");
  }

} 
