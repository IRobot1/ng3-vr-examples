import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { NgIf } from '@angular/common';
import { MomentModule } from 'ngx-moment'

import { Group, MeshBasicMaterial, Object3D } from 'three';

import { NgtObjectProps } from '@angular-three/core';
import { NgtGroup } from '@angular-three/core/group';
import { NgtMeshBasicMaterial } from '@angular-three/core/materials';

import { FlatUIBaseButton, FlatUIList, FlatUIMaterialIcon, FlatUIMenuItem, FlatUIPrompt, FlatUIConfirm, FlatUIInputService, FlatUILabel, FlatUIMenuMini, FlatUISelect, InteractiveObjects, ListItem, MenuItem } from 'ng3-flat-ui';
import { ConflictBehavior, FileData, FilterData, Ng3FileList } from 'ngx-cloud-storage-types';

export interface SaveFile {
  prompttitle: string,
  promptvalue: string,
  conflictBehavior: ConflictBehavior,
  content: string,
}

export interface FileSelected {
  item: FileData;
  downloadUrl: string;
}

@Component({
  selector: 'ng3-file-list[service]',
  exportAs: 'Ng3FileList',
  templateUrl: './ng3-file-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [FlatUIInputService],
  standalone: true,
  imports: [
    NgIf,
    MomentModule,
    NgtGroup,
    NgtMeshBasicMaterial,
    FlatUISelect,
    FlatUIList,
    FlatUIBaseButton,
    FlatUIMaterialIcon,
    FlatUILabel,
    FlatUIMenuMini,
    FlatUIMenuItem,
    FlatUIPrompt,
    FlatUIConfirm,
]
})
export class Ng3FileListComponent extends NgtObjectProps<Group> {
  @Input() service!: Ng3FileList;

  @Input() width = 2;

  private _height = 1;
  @Input()
  get height(): number { return this._height }
  set height(newvalue: number) {
    this._height = newvalue;
    this.rowcount = Math.round((newvalue - 0.26) / (this.rowheight + 0.01));
  }

  private _filters: Array<FilterData> = [
    { name: 'All Files', filter: '' },
  ]

  @Input()
  get filters(): Array<FilterData> { return this._filters }
  set filters(newvalue: Array<FilterData>) {
    this._filters = newvalue;
    this.filterlist = this.filters.map(item => <ListItem>{ text: this.displayfilter(item) });
    if (this.filterlist.length > 0)
      this.changeFilter(this.filterlist[0].text);
  }

  protected filtereditems: Array<ListItem> = [];
  protected filtervalue = 'All Files';
  protected filterlist: Array<ListItem> = [{ text: 'All Files' }];

  @Input() filterlistwidth = 1;
  protected get filterlistheight(): number { return (this.filterlist.length * 0.11) + 0.06 }

  @Input()
  set addmenuitems(newvalue: Array<MenuItem>) {
    this.menuitems.push(...newvalue);
  }

  @Input() selectable?: InteractiveObjects;

  private folderid?: string;
  @Input()
  get startfolderid(): string | undefined { return this.folderid }
  set startfolderid(newvalue: string | undefined) {
    this.folderid = newvalue;
    this.resetback();
    this.refresh();
  }

  @Input() selectfolder = false;

  private _readonly = false;
  @Input()
  get readonly(): boolean { return this._readonly }
  set readonly(newvalue: boolean) {
    this._readonly = newvalue;
    this.menuitems[2].visible = !this._readonly;
    this.filteredmenuitems = this.menuitems.filter(x => x.visible);
  }

  private _savefile!: SaveFile;
  @Input()
  get savefile(): SaveFile { return this._savefile }
  set savefile(newvalue: SaveFile | undefined) {
    if (!newvalue) return;

    this._savefile = newvalue;
    this.createFilePrompt(newvalue.prompttitle, newvalue.promptvalue, newvalue.content, newvalue.conflictBehavior);
  }

  @Output() fileselected = new EventEmitter<FileSelected>();
  @Output() folderselected = new EventEmitter<FileData>();
  @Output() foldercreated = new EventEmitter<FileData>();
  @Output() deleted = new EventEmitter<FileData>();
  @Output() renamed = new EventEmitter<FileData>();
  @Output() saved = new EventEmitter<FileData>();
  @Output() close = new EventEmitter<void>();

  protected rowheight = 0.2;
  protected rowcount = 4;

  protected fileid?: string;
  protected backfolderids: Array<string | undefined> = [];

  protected menuitems: Array<MenuItem> = [
    { text: 'Back', keycode: 'Backspace', icon: 'arrow_back', enabled: false, visible: true, selected: () => { this.moveback() } },
    { text: 'Refresh', keycode: 'F5', icon: 'refresh', enabled: true, visible: true, selected: () => { this.refresh(); } },
    { text: 'Create Folder', keycode: '', icon: 'create_new_folder', enabled: true, visible: true, color: new MeshBasicMaterial({ color: 'yellow' }), selected: () => { this.createFolder(); } },
  ]
  protected menuwidth = 0;
  protected filteredmenuitems = this.menuitems;

  private driveitems: Array<FileData> = [];


  private filter: Array<string> = [''];

  protected displayfilter(item: FilterData) {
    if (item.filter) return `${item.name} (${item.filter})`
    return item.name
  }

  getSize(item: FileData) : string {
    if (item.size) return `${item.size} - `
    return '';
  }

  constructor(
    public input: FlatUIInputService,
    private cd: ChangeDetectorRef,
  ) {
    super();
  }

  protected async refresh() {
    await this.getFiles(this.folderid);
  }

  private async getFiles(id?: string) {
    await this.service.getFolderItems(id).then(data => {
      this.driveitems = data;
      this.applyFilter();
    });
  }

  protected downloadUrl?: string;

  protected async openFile(item: FileData) {
    if (!item.id || !this.visible) return;

    if (item.isfolder) {
      this.backfolderids.push(this.folderid);
      this.back.enabled = true;

      await this.getFiles(item.id);
      this.folderid = item.id;
      this.fileid = this.downloadUrl = undefined;
    }
    else {
      if (this.showprompt) {
        this.promptvalue = item.name;
      }
      else {
        await this.service.getDownloadUrl(item.id).then(data => {
          this.downloadUrl = data;
          this.fileid = item.id;
          if (data) {
            this.fileselected.next({ item, downloadUrl: data });
          }
        });
      }
    }
    this.cd.detectChanges();
  }

  private get back(): MenuItem { return this.menuitems[0] }
  private resetback() {
    this.backfolderids.length = 0;
    this.back.enabled = false;
    this.cd.detectChanges();
  }

  protected async moveback() {
    if (!this.visible) return;

    this.fileid = this.downloadUrl = undefined;
    this.folderid = this.backfolderids.pop();
    await this.getFiles(this.folderid);

    this.back.enabled = this.backfolderids.length > 0;
  }

  protected async createFolder() {
    if (!this.visible || this.readonly) return;

    await this.prompt('Enter folder name', 'newfolder').then(async foldername => {
      if (!foldername) return;

      await this.service.createFolder(foldername, this.folderid).then(data => {
        if (data) {
          this.driveitems.push(data);
          this.applyFilter();

          this.foldercreated.next(data);
        }
      });
    });
  }

  protected async deleteItem(item: FileData) {
    if (!this.visible || this.readonly) return;

    await this.confirm('Delete file?').then(async dodelete => {
      if (!dodelete) return;

      const fileid = item.id;
      await this.service.deleteItem(fileid).then(data => {
        this.driveitems = this.driveitems.filter(item => item.id != fileid);
        this.filtereditems = this.driveitems.filter(item => item.id != fileid).map(item => <ListItem>{ text: item.name, data: item });

        if (fileid == this.fileid) this.fileid = this.downloadUrl = undefined;
        if (fileid == this.folderid) this.folderid = undefined;

        this.deleted.next(item);
      });
    });
  }

  private async createFile(filename: string, content: string, conflictBehaivor: ConflictBehavior, folderid?: string) {
    await this.service.createFile(folderid, filename, content, conflictBehaivor).then(data => {
      if (!data) return;
      this.fileid = data.id;

      this.saved.next(data);
      this.close.next();

      this.refresh();
    });
  }

  private async overwrite(filename: string): Promise<boolean> {
    let result = true;
    const item = this.driveitems.find(item => item.name == filename);
    if (item) {
      await this.confirm("Overwrite?").then(overwrite => {
        result = overwrite
      });
    }
    return result;
  }

  public async createFilePrompt(title: string, defaultfile: string, content: string, conflictBehaivor: ConflictBehavior) {
    if (!this.visible || this.readonly) return;
    
    await this.prompt(title, defaultfile).then(async filename => {
      
      if (filename) {
        await this.overwrite(filename).then(async overwrite => {
          if (overwrite) {
            await this.createFile(filename, content, conflictBehaivor, this.folderid);
          }
        })
      }
      this.close.next();
    })
  }

  protected async duplicateFile(item: FileData) {
    if (!this.visible || this.readonly) return;

    await this.service.duplicateFile(item.id, 'copy of ' + item.name).then(data => {
      const timer = setTimeout(() => {
        this.refresh();
        clearTimeout(timer);
      }, 1000)
    });
  }

  protected async renameItem(item: FileData) {
    if (!this.visible || this.readonly) return;

    await this.prompt('Enter new name', item.name).then(async newname => {
      if (newname) {
        await this.service.renameItem(item.id, newname).then(data => {
          if (data && data.name) {
            item.name = data.name;
            this.cd.detectChanges();

            this.renamed.next(item);
          }
        });
      }
    })
  }

  private applyFilter() {
    const driveitems = this.driveitems.filter(item => {
      return this.filter[0] == '' || item.isfolder || this.filter.includes(item.extension)
    });
    this.filtereditems = driveitems.map(item => <ListItem>{ text: item.name, data: item });
    this.cd.detectChanges();
  }

  protected changeFilter(newfilter: string) {
    if (!this.visible) return;
    if (newfilter == this.filtervalue) return;

    this.filtervalue = newfilter;
    const item = this.filters.find(item => newfilter.startsWith(item.name));
    if (item) {
      this.filter = item.filter.split(',');
      this.applyFilter();
    }
  }

  private popup = new Object3D

  showprompt = false;
  prompttitle!: string;
  promptvalue!: string;

  private prompt(title: string, defaultvalue: string): Promise<string | undefined> {
    this.prompttitle = title;
    this.promptvalue = defaultvalue;
    this.showprompt = true;
    this.showconfirm = false;

    return new Promise((resolve, reject) => {
      this.popup.addEventListener('prompt', (e: any) => {
        if (e)
          resolve(e.result);
        else
          reject();
      })
    });
  }

  protected promptresult(result?: string) {
    this.popup.dispatchEvent({ type: 'prompt', result });
    this.showprompt = false;
  }

  showconfirm = false;
  confirmtitle!: string;

  private confirm(title: string): Promise<boolean> {
    this.confirmtitle = title;
    this.showconfirm = true;
    this.showprompt = false;

    return new Promise((resolve, reject) => {
      this.popup.addEventListener('confirm', (e: any) => {
        if (e)
          resolve(e.result);
        else
          reject(false);
      })
    });
  }

  protected confirmresult(result: boolean) {
    this.popup.dispatchEvent({ type: 'confirm', result });
    this.showconfirm = false
  }
}
