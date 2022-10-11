import { AfterViewInit, Component, EventEmitter, Input, Output } from "@angular/core";

import { BufferGeometry, DoubleSide, Mesh, MeshBasicMaterial, Object3D, Shape, ShapeGeometry, Side } from "three";
import { NgtObjectProps } from "@angular-three/core";

import { HEIGHT_CHANGED_EVENT, LAYOUT_EVENT, roundedRect, UIInput, WIDTH_CHANGED_EVENT } from "../flat-ui-utils";
import { GlobalFlatUITheme, THEME_CHANGE_EVENT } from "../flat-ui-theme";

import { InteractiveObjects } from "../interactive-objects";

@Component({
  selector: 'flat-ui-select',
  exportAs: 'flatUISelect',
  templateUrl: './select.component.html',
})
export class FlatUISelect extends NgtObjectProps<Mesh> implements AfterViewInit, UIInput {
  @Input() text = '';
  @Input() overflow = 24;

  @Input() enabled = true;

  private _buttoncolor?: string;
  @Input()
  get buttoncolor(): string {
    if (this._buttoncolor) return this._buttoncolor;
    return GlobalFlatUITheme.ButtonColor;
  }
  set buttoncolor(newvalue: string) {
    this._buttoncolor = newvalue;
  }

  private _hovercolor?: string;
  @Input()
  get hovercolor(): string {
    if (this._hovercolor) return this._hovercolor;
    return GlobalFlatUITheme.HoverColor;
  }
  set hovercolor(newvalue: string) {
    this._hovercolor = newvalue;
  }

  private _textcolor?: string;
  @Input()
  get textcolor(): string {
    if (this._textcolor) return this._textcolor;
    return GlobalFlatUITheme.StringColor;
  }
  set textcolor(newvalue: string) {
    this._textcolor = newvalue;
  }
  private _selectcolor?: string;
  @Input()
  get selectcolor(): string {
    if (this._selectcolor) return this._selectcolor;
    return GlobalFlatUITheme.SelectColor;
  }
  set selectcolor(newvalue: string) {
    this._selectcolor = newvalue;
  }

  private _width = 1;
  @Input()
  get width() { return this._width }
  set width(newvalue: number) {
    this._width = newvalue;
    if (this.mesh) {
      this.mesh.dispatchEvent({ type: WIDTH_CHANGED_EVENT });
    }
  }

  private _height = 0.1;
  @Input()
  get height() { return this._height }
  set height(newvalue: number) {
    this._height = newvalue;
    if (this.mesh) {
      this.mesh.dispatchEvent({ type: HEIGHT_CHANGED_EVENT });
    }
  }


  @Input() selectable?: InteractiveObjects;

  inputopen = false;
  @Output() openinput = new EventEmitter<Object3D>();

  geometry!: BufferGeometry;
  material!: MeshBasicMaterial;

  side: Side = DoubleSide;

  get displaytext() {
    return this.text.substring(0, this.overflow * this.width);
  }

  override preInit() {
    super.preInit();

    const flat = new Shape();
    roundedRect(flat, 0, 0, this.width + 0.1, this.height, 0.02);

    this.geometry = new ShapeGeometry(flat);
    this.geometry.center();

    this.material = new MeshBasicMaterial({ color: this.buttoncolor, side: this.side, opacity: 0.5, transparent: true });
  }

  override ngOnDestroy() {
    super.ngOnDestroy();

    this.selectable?.remove(this.mesh);

    this.geometry.dispose();
    this.material.dispose();
  }

  ngAfterViewInit(): void {
    this.mesh.addEventListener(LAYOUT_EVENT, (e: any) => {
      e.width = this.width;
      e.height = this.height;
      e.updated = true;
    });

    GlobalFlatUITheme.addEventListener(THEME_CHANGE_EVENT, () => {
      this.material.color.setStyle(this.buttoncolor);
    })
  }


  private mesh!: Mesh;

  meshready(mesh: Mesh) {
    this.selectable?.add(mesh);

    mesh.addEventListener('click', (e: any) => { this.enableinput(mesh); e.stop = true; });
    mesh.addEventListener('pointermove', (e: any) => { this.over(); e.stop = true; });
    mesh.addEventListener('pointerout', (e: any) => { this.out(); e.stop = true; });

    this.mesh = mesh;
  }

  enableinput(mesh: Mesh) {
    if (!this.enabled || !this.visible) return;

    this.inputopen = true;
    this.openinput.next(mesh);
  }

  isover = false;
  over() {
    if (this.isover) return;
    this.material.color.setStyle(this.hovercolor);
    this.isover = true;
  }
  out() {
    this.material.color.setStyle(this.buttoncolor);
    this.isover = false;
  }
}