import { AfterViewInit, Component, EventEmitter, Input, Output } from "@angular/core";

import { BufferGeometry, DoubleSide, Material, Mesh, MeshBasicMaterial, Object3D, Shape, ShapeGeometry, Side } from "three";
import { NgtEvent, NgtObjectProps } from "@angular-three/core";

import { HEIGHT_CHANGED_EVENT, LAYOUT_EVENT, roundedRect, WIDTH_CHANGED_EVENT } from "../flat-ui-utils";
import { THEME_CHANGE_EVENT, GlobalFlatUITheme } from "../flat-ui-theme";

import { InteractiveObjects } from "../interactive-objects";

@Component({
  selector: 'flat-ui-input-checkbox',
  exportAs: 'flatUIInputCheckbox',
  templateUrl: './input-checkbox.component.html',
})
export class FlatUIInputCheckbox extends NgtObjectProps<Mesh> implements AfterViewInit {
  private _checked = false;
  @Input()
  get checked(): boolean { return this._checked }
  set checked(newvalue: boolean) {
    this._checked = newvalue;

    if (this.checkmesh)
      this.checkmesh.visible = this.checked;
  }

  private _width = 0.1;
  @Input()
  get width() { return this._width }
  set width(newvalue: number) {
    this._width = newvalue;
    if (this.mesh) {
      this.mesh.dispatchEvent({ type: WIDTH_CHANGED_EVENT });
      this.mesh.dispatchEvent({ type: HEIGHT_CHANGED_EVENT });
    }
  }

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

  private _truecolor?: string;
  @Input()
  get truecolor(): string {
    if (this._truecolor) return this._truecolor;
    return GlobalFlatUITheme.CheckColor;
  }
  set truecolor(newvalue: string) {
    this._truecolor = newvalue;
  }

  @Input() enabled = true;

  @Input() selectable?: InteractiveObjects;

  @Output() change = new EventEmitter<boolean>();

  geometry!: BufferGeometry;
  material!: MeshBasicMaterial;

  side: Side = DoubleSide;

  private checkmesh!: Mesh;

  override preInit() {
    super.preInit();

    const flat = new Shape();
    roundedRect(flat, 0, 0, this.width, this.width, 0.02);

    this.geometry = new ShapeGeometry(flat);
    this.geometry.center();
    this.material = new MeshBasicMaterial({ color: this.buttoncolor, side: this.side, opacity: 0.5, transparent: true });
  }

  override ngOnDestroy() {
    super.ngOnDestroy();

    this.selectable?.remove(this.mesh);
    this.selectable?.remove(this.checkmesh);

    this.geometry.dispose();
    this.material.dispose();
  }

  ngAfterViewInit(): void {
    this.mesh.addEventListener(LAYOUT_EVENT, (e: any) => {
      e.width = this.width;
      e.height = this.width;
      e.updated = true;
    });

    GlobalFlatUITheme.addEventListener(THEME_CHANGE_EVENT, () => {
      this.material.color.setStyle(this.buttoncolor);
    })
  }

  private mesh!: Mesh;

  meshready(mesh: Mesh) {
    this.selectable?.add(mesh);

    mesh.addEventListener('pointermove', () => { this.over() });
    mesh.addEventListener('pointerout', () => { this.out() });

    this.mesh = mesh;
  }

  checkready(mesh: Mesh) {
    this.selectable?.add(mesh)

    mesh.visible = this.checked;

    mesh.addEventListener('click', () => { this.doclick() })
    mesh.addEventListener('pointermove', () => { this.over() });
    mesh.addEventListener('pointerout', () => { this.out() });

    this.checkmesh = mesh;
  }

  clicked(event: NgtEvent<MouseEvent>) {
    if (event.object != this.checkmesh) return;
    event.stopPropagation();

    this.doclick();
  }

  private doclick() {
    if (!this.enabled || !this.visible) return;
    this.checked = !this.checked;
    this.change.next(this.checked);
  }

  isover = false;
  over() {
    if (this.isover || !this.enabled) return;
    this.material.color.setStyle(this.hovercolor);
    this.isover = true;
  }
  out() {
    this.material.color.setStyle(this.buttoncolor);
    this.isover = false;
  }

}
