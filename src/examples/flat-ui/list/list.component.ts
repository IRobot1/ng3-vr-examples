import { AfterViewInit, Component, EventEmitter, Input, Output } from "@angular/core";

import { BufferGeometry, DoubleSide, Group, Mesh, MeshBasicMaterial, Shape, ShapeGeometry } from "three";
import { NgtEvent, NgtObjectProps, NgtTriple } from "@angular-three/core";

import { roundedRect } from "../flat-ui-utils";
import { GlobalFlatUITheme, THEME_CHANGE_EVENT } from "../flat-ui-theme";

import { InteractiveObjects } from "../interactive-objects";

export interface ListItem {
  text: string,
  data?: any;
}

class NumKeySetting {
  constructor(public position: NgtTriple, public numkey: string, public size = 0.1) { }
}

class ListData {
  constructor(public text: string, public enabled: boolean, public highlight: boolean) { }
}

@Component({
  selector: 'flat-ui-list',
  exportAs: 'flatUIList',
  templateUrl: './list.component.html',
})
export class FlatUIList extends NgtObjectProps<Group> implements AfterViewInit {
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

  @Input() overflow = 20;
  @Input() enabled = true;

  @Input() width = 1;
  @Input() height = 1;

  private _popupcolor?: string;
  @Input()
  get popupcolor(): string {
    if (this._popupcolor) return this._popupcolor;
    return GlobalFlatUITheme.PopupColor;
  }
  set popupcolor(newvalue: string) {
    this._popupcolor = newvalue;
  }


  @Input() selectable?: InteractiveObjects;

  @Output() change = new EventEmitter<ListItem>();
  @Output() close = new EventEmitter<boolean>();

  geometry!: BufferGeometry;
  material!: MeshBasicMaterial;

  keys: Array<NumKeySetting> = [];

  count = 7;  // default when height is is 1
  data: Array<ListData> = [];

  firstdrawindex = 0;

  override preInit() {
    super.preInit();

    const flat = new Shape();
    roundedRect(flat, 0, 0, this.width, this.height, 0.02);

    this.geometry = new ShapeGeometry(flat);
    this.geometry.center();
    this.material = new MeshBasicMaterial({ color: this.popupcolor, side: DoubleSide });
  }

  override ngOnInit() {
    super.ngOnInit();

    this.width = Math.max(0.5, this.width);
    this.height = Math.max(0.4, this.height)
    this.count = Math.floor(7 * this.height);
  }

  override ngOnDestroy() {
    super.ngOnDestroy();

    this.selectable?.remove(this.mesh);

    this.geometry.dispose();
    this.material.dispose();
  }

  private mesh!: Mesh;

  meshready(mesh: Mesh) {
    const top = ['|<', '<', '>', '>|']

    const buttonwidth = 0.11

    let width = (top.length - 1) * buttonwidth;
    top.forEach((numkey, index) => {
      this.keys.push(new NumKeySetting([(-width / 2 + index * buttonwidth), 0, 0], numkey));
    });

    this.selectable?.add(mesh);

    mesh.addEventListener('raymissed', (e: any) => { this.missed(); e.stop = true; });

    this.mesh = mesh;
  }

  missed() {
    this.close.next(true);
  }

  ngAfterViewInit(): void {
    if (this.selectedindex != -1)
      this.firstdrawindex = this.selectedindex;

    this.renderlist();

    GlobalFlatUITheme.addEventListener(THEME_CHANGE_EVENT, () => {
      this.material.color.setStyle(this.popupcolor);
    })
  }

  renderlist() {
    let drawindex = this.firstdrawindex;

    // if the whole list is shorter than what can be displayed, start from the first item in the list
    if (this.list.length < this.count) {
      this.firstdrawindex = drawindex = 0;
    }

    this.data.length = 0;

    for (let i = 0; i < this.count; i++) {
      let text = '';
      let enabled = false;

      const highlight = (this.selectedindex == drawindex)

      if (drawindex < this.list.length) {
        text = this.list[drawindex++].text;
        enabled = true;
      }

      this.data.push(new ListData(text.substring(0, this.overflow * this.width), enabled, highlight));
    }
  }

  selected(index: number) {
    this.selectedindex = this.firstdrawindex + index;

    this.change.next(this.list[this.selectedindex]);

  }

  clicked(keycode: string) {
    if (!this.visible) return;

    if (keycode == '|<')
      this.firstdrawindex = 0;
    else if (keycode == '<') {
      if (this.firstdrawindex) this.firstdrawindex--;
    }
    else if (keycode == '>') {
      if (this.list.length > this.count && this.firstdrawindex < this.list.length - this.count) this.firstdrawindex++;
    }
    else if (keycode == '>|') {
      this.firstdrawindex = Math.max(this.list.length - this.count, 0);
    }
    this.renderlist();
  }

  ignore(mesh: Mesh, event: NgtEvent<MouseEvent>) {
    if (event.object != mesh) return;
    event.stopPropagation();
  }
}
