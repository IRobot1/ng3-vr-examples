import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChild, EventEmitter, Input, Output, TemplateRef } from "@angular/core";

import { BufferGeometry, Group, Line, Material, Mesh, Shape, ShapeGeometry, Vector3 } from "three";
import { NgtObjectProps } from "@angular-three/core";

import { LAYOUT_EVENT, Paging, roundedRect } from "../flat-ui-utils";
import { GlobalFlatUITheme } from "../flat-ui-theme";

import { InteractiveObjects } from "../interactive-objects";
import { NgtGroup } from "@angular-three/core/group";
import { NgtMesh } from "@angular-three/core/meshes";
import { NgtLine } from "@angular-three/core/lines";
import { NgtPlaneGeometry } from "@angular-three/core/geometries";
import { NgIf, NgTemplateOutlet } from "@angular/common";
import { FlatUIButton } from "../button/button.component";
import { FlatUIPaginator } from "../paginator/paginator.component";
import { NgFor } from "@angular/common";
import { FlatUILabel } from "../label/label.component";

export interface ListItem {
  text: string,
  data?: any;
}

class ListData {
  constructor(public text: string, public data: any, public enabled: boolean, public selected: boolean, public position: Vector3, public selectposition: Vector3) { }
}

@Component({
  selector: 'flat-ui-list',
  exportAs: 'flatUIList',
  templateUrl: './list.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgFor,
    NgIf,
    NgTemplateOutlet,
    NgtGroup,
    NgtMesh,
    NgtLine,
    NgtPlaneGeometry,
    FlatUILabel,
    FlatUIButton,
    FlatUIPaginator
  ]
})
export class FlatUIList extends NgtObjectProps<Group> implements AfterViewInit, Paging {
  private _list: Array<ListItem> = [];
  @Input()
  get list(): Array<ListItem> { return this._list }
  set list(newvalue: Array<ListItem>) {
    this._list = newvalue;
    this.updateFlag = true;
  }

  private _selectedtext = '';
  @Input()
  get selectedtext(): string { return this._selectedtext }
  set selectedtext(newvalue: string) {
    this._selectedtext = newvalue;

    const index = this.list.findIndex(x => x.text == newvalue);

    this.selectedindex = index;  // if selected text is not found, this will clear highlighted item too

    if (index != -1) {
      // position on page boundary
      this.firstdrawindex = Math.trunc(index / this.rowcount) * this.rowcount;
      this.updateFlag = true;
    }

  }
  @Input() selectedindex = -1;

  @Input() emptytext = 'List is empty';

  @Input() margin = 0.03;
  @Input() rowsize = 0.1;
  @Input() rowspacing = 0.01;
  @Input() pagebuttonsize = 0.1;

  @Input() showpaging = true;
  @Input() showpagecounts = true;

  @Input() enablehover = false;

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

  private _outlinematerial!: Material
  @Input()
  get outlinematerial(): Material {
    if (this._outlinematerial) return this._outlinematerial;
    return GlobalFlatUITheme.OutlineMaterial;
  }
  set outlinematerial(newvalue: Material) {
    this._outlinematerial = newvalue;
  }


  @Input() rowcount = 7;

  @Input() selectable?: InteractiveObjects;

  protected planewidth = 0.02
  protected planeheight = this.rowsize

  private _vertical = true;
  @Input()
  get vertical(): boolean { return this._vertical }
  set vertical(newvalue: boolean) {
    this._vertical = newvalue;
    if (newvalue) {
      this.planewidth = 0.02;
      this.planeheight = this.rowsize;
    }
    else {
      this.planewidth = this.rowsize;
      this.planeheight = 0.02;
    }
  }

  @Input() geometry!: BufferGeometry;

  @Output() change = new EventEmitter<ListItem>();
  @Output() close = new EventEmitter<void>();

  @ContentChild('listItem')
  protected listItem!: TemplateRef<any>;

  protected data: Array<ListData> = [];

  protected outline!: BufferGeometry; // outline material
  protected group!: Group;

  constructor(private cd: ChangeDetectorRef) { super(); }

  override preInit() {
    super.preInit();

    if (!this.geometry) this.createListGeometry();
  }

  createListGeometry() {
    const flat = new Shape();
    roundedRect(flat, 0, 0, this.width, this.height, 0.02);

    this.geometry = new ShapeGeometry(flat);
    this.geometry.center();

    this.outline = new BufferGeometry().setFromPoints(flat.getPoints());
    this.outline.center();
  }

  override ngOnDestroy() {
    super.ngOnDestroy();

    if (this.enablehover)
      this.selectable?.remove(this.mesh);

    this.geometry.dispose();
  }

  private line!: Line;
  lineready(line: Line) {
    line.visible = false;
    this.line = line;
  }

  private _mesh!: Mesh;
  get mesh(): Mesh { return this._mesh }

  protected meshready(mesh: Mesh) {
    if (this.enablehover)
      this.selectable?.add(mesh);

    mesh.addEventListener('pointermove', (e: any) => { this.over(); e.stop = true; });
    mesh.addEventListener('pointerout', (e: any) => { this.out() });
    mesh.addEventListener('raymissed', (e: any) => { this.missed(); e.stop = true; });

    this._mesh = mesh;
  }

  protected missed() {
    this.close.next();
  }

  private firstdrawindex = 0;

  ngAfterViewInit(): void {

    this.mesh.addEventListener(LAYOUT_EVENT, (e: any) => {
      e.width = this.width;
      e.height = this.height;
      e.updated = true;
    });

    this.ready.next(this.group)
  }

  private updateFlag = true;
  tick() {
    if (this.updateFlag) {
      this.updateFlag = false;
      this.refresh();
      this.cd.detectChanges();
    }
  }

  protected emptyposition!: Vector3;

  refresh() {
    let drawindex = this.firstdrawindex;

    // if the whole list is shorter than what can be displayed, start from the first item in the list
    if (this.list.length <= this.rowcount) {
      this.firstdrawindex = drawindex = 0;
    }

    this.data.length = 0;

    for (let i = 0; i < this.rowcount; i++) {
      let text = '';
      let data = undefined;
      let enabled = false;

      const selected = (this.selectedindex == drawindex)

      if (drawindex < this.list.length) {
        const item = this.list[drawindex++];
        text = item.text;
        data = item.data;
        enabled = true;
      }

      const position = new Vector3(0, 0, 0.001)
      const selectposition = new Vector3(0, 0, 0.002)
      if (this.vertical) {
        position.y = this.height / 2 - this.rowsize / 2 - this.margin - i * (this.rowsize + this.rowspacing);
        selectposition.x = -this.width / 2 + this.margin / 2
      }
      else {
        position.x = -this.width / 2 + this.rowsize / 2 + this.margin + i * (this.rowsize + this.rowspacing);
        selectposition.y = this.height / 2 - this.margin / 2
      }

      this.data.push(new ListData(text, data, enabled, selected, position, selectposition));

      if (i == 0) this.emptyposition = position;
    }
  }

  protected selected(index: number) {
    if (!this.data[index].enabled) return;

    this.data.forEach(item => item.selected = false)
    this.data[index].selected = true;

    this.change.next(this.list[this.firstdrawindex + index]);
  }

  get firstindex(): number { return this.firstdrawindex }
  get length(): number { return this.list.length }
  get pagesize(): number { return this.rowcount }

  movefirst() {
    if (this.firstdrawindex) {
      this.firstdrawindex = 0;
      this.updateFlag = true;
    }
  }

  moveprevious() {
    if (this.firstdrawindex) {
      if (this.firstdrawindex - this.rowcount < 0)
        this.firstdrawindex = 0;
      else
        this.firstdrawindex -= this.rowcount;
      this.updateFlag = true;
    }

  }

  movenext() {
    if (this.firstdrawindex + this.rowcount < this.list.length) {
      this.firstdrawindex += this.rowcount;
      this.updateFlag = true;
    }
  }

  movelast() {
    const index = Math.max(this.list.length - this.rowcount, 0);
    if (index != this.firstdrawindex) {
      this.firstdrawindex = index;
      this.updateFlag = true;
    }
  }


  isover = false;
  over() {
    if (this.isover || !this.enablehover) return;
    this.line.visible = true;
    this.isover = true;
  }
  out() {
    this.line.visible = false;
    this.isover = false;
  }
}
