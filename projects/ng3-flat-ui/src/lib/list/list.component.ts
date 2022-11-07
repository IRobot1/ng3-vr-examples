import { AfterViewInit, Component, ContentChild, EventEmitter, Input, Output, TemplateRef } from "@angular/core";

import { BufferGeometry, Group, Material, Mesh, Shape, ShapeGeometry } from "three";
import { NgtEvent, NgtObjectProps } from "@angular-three/core";

import { Paging, roundedRect } from "../flat-ui-utils";
import { GlobalFlatUITheme } from "../flat-ui-theme";

import { InteractiveObjects } from "../interactive-objects";

export interface ListItem {
  text: string,
  data?: any;
}

class ListData {
  constructor(public text: string, public enabled: boolean, public highlight: boolean) { }
}

@Component({
  selector: 'flat-ui-list',
  exportAs: 'flatUIList',
  templateUrl: './list.component.html',
})
export class FlatUIList extends NgtObjectProps<Group> implements AfterViewInit, Paging {
  @Input() list: Array<ListItem> = [];

  private _selectedtext = '';
  @Input()
  get selectedtext(): string { return this._selectedtext }
  set selectedtext(newvalue: string) {
    this._selectedtext = newvalue;

    const index = this.list.findIndex(x => x.text == newvalue);
    if (index != -1)
      this.selectedindex = index;
  }
  @Input() selectedindex = -1;

  @Input() margin = 0.03;
  @Input() rowheight = 0.1;
  @Input() rowspacing = 0.01;
  @Input() pagebuttonsize = 0.1;

  @Input() width = 1;
  @Input() height = 1;

  private _popupmaterial!: Material
  @Input()
  get popupmaterial(): Material {
    if (this._popupmaterial) return this._popupmaterial;
    return GlobalFlatUITheme.PopupMaterial;
  }
  set popupmaterial(newvalue: Material) {
    this._popupmaterial = newvalue;
  }

  private _listselectmaterial!: Material
  @Input()
  get listselectmaterial(): Material {
    if (this._listselectmaterial) return this._listselectmaterial;
    return GlobalFlatUITheme.ListSelectMaterial;
  }
  set listselectmaterial(newvalue: Material) {
    this._listselectmaterial = newvalue;
  }

  @Input() rowcount = 7;

  @Input() selectable?: InteractiveObjects;

  @Input() geometry!: BufferGeometry;

  @Output() change = new EventEmitter<ListItem>();
  @Output() close = new EventEmitter<void>();

  @ContentChild('listItem')
  protected listItem!: TemplateRef<any>;

  protected data: Array<ListData> = [];

  protected pagewidth = 1;

  override preInit() {
    super.preInit();

    if (!this.geometry) this.createListGeometry();
  }

  createListGeometry() {
    const flat = new Shape();
    roundedRect(flat, 0, 0, this.width, this.height, 0.02);

    this.geometry = new ShapeGeometry(flat);
    this.geometry.center();
  }

  override ngOnDestroy() {
    super.ngOnDestroy();

    this.selectable?.remove(this.mesh);

    this.geometry.dispose();
  }

  private mesh!: Mesh;

  protected meshready(mesh: Mesh) {
    this.selectable?.add(mesh);

    mesh.addEventListener('raymissed', (e: any) => { this.missed(); e.stop = true; });

    this.mesh = mesh;
  }

  protected missed() {
    this.close.next();
  }

  private firstdrawindex = 0;

  ngAfterViewInit(): void {
    if (this.selectedindex != -1)
      this.firstdrawindex = this.selectedindex;

    this.refresh();
  }

  private refresh() {
    let drawindex = this.firstdrawindex;

    // if the whole list is shorter than what can be displayed, start from the first item in the list
    if (this.list.length < this.rowcount) {
      this.firstdrawindex = drawindex = 0;
    }

    this.data.length = 0;

    for (let i = 0; i < this.rowcount; i++) {
      let text = '';
      let enabled = false;

      const highlight = (this.selectedindex == drawindex)

      if (drawindex < this.list.length) {
        text = this.list[drawindex++].text;
        enabled = true;
      }

      this.data.push(new ListData(text, enabled, highlight));
    }
  }

  protected selected(index: number) {
    this.data.forEach(item => item.highlight = false)
    this.data[index].highlight = true;

    this.selectedindex = this.firstdrawindex + index;

    this.change.next(this.list[this.selectedindex]);
  }

  get firstindex(): number { return this.firstdrawindex }
  get length(): number { return this.list.length }
  get pagesize(): number { return this.rowcount }

  movefirst() {
    if (this.firstdrawindex) {
      this.firstdrawindex = 0;
      this.refresh();
    }
  }

  moveprevious() {
    if (this.firstdrawindex) {
      this.firstdrawindex--;
      this.refresh();
    }
  }

  movenext() {
    if (this.list.length > this.rowcount && this.firstdrawindex < this.list.length - this.rowcount) {
      this.firstdrawindex++;
      this.refresh();
    }
  }

  movelast() {
    const index = Math.max(this.list.length - this.rowcount, 0);
    if (index != this.firstdrawindex) {
      this.firstdrawindex = index;
      this.refresh();
    }
  }

  protected ignore(mesh: Mesh, event: NgtEvent<MouseEvent>) {
    if (event.object != mesh) return;
    event.stopPropagation();
  }
}
