import { AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from "@angular/core";

import { BufferGeometry, Material, Mesh, MeshBasicMaterial, PlaneGeometry, Shape, ShapeGeometry } from "three";
import { NgtEvent, NgtObjectProps } from "@angular-three/core";

import { HEIGHT_CHANGED_EVENT, LAYOUT_EVENT, roundedRect, WIDTH_CHANGED_EVENT } from "../flat-ui-utils";
import { THEME_CHANGE_EVENT, GlobalFlatUITheme } from "../flat-ui-theme";

import { InteractiveObjects } from "../interactive-objects";

@Component({
  selector: 'flat-ui-input-checkbox',
  exportAs: 'flatUIInputCheckbox',
  templateUrl: './input-checkbox.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
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

  private _disabledcolor?: string;
  @Input()
  get disabledcolor(): string {
    if (this._disabledcolor) return this._disabledcolor;
    return GlobalFlatUITheme.DisabledColor;
  }
  set disabledcolor(newvalue: string) {
    this._disabledcolor = newvalue;
  }

  private _enabled = true;
  @Input()
  get enabled(): boolean { return this._enabled }
  set enabled(newvalue: boolean) {
    this._enabled = newvalue;
    if (newvalue) {
      this.setButtonColor(this.buttoncolor);
    }
    else {
      this.setButtonColor(this.disabledcolor);
    }
  }

  @Input() geometry!: BufferGeometry;
  @Input() material!: Material;

  @Input() selectable?: InteractiveObjects;

  @Input() checkgeometry!: BufferGeometry;
  @Input() checkmaterial!: Material;

  @Output() change = new EventEmitter<boolean>();


  private checkmesh!: Mesh;

  override preInit() {
    super.preInit();

    if (!this.geometry) this.createButtonGeometry();
    if (!this.material) this.createButtonMaterial();

    if (!this.checkgeometry) this.createCheckGeometry();
    if (!this.checkmaterial) this.createCheckMaterial();
  }

  createButtonGeometry() {
    const flat = new Shape();
    roundedRect(flat, 0, 0, this.width, this.width, 0.02);

    this.geometry = new ShapeGeometry(flat);
    this.geometry.center();
  }

  createButtonMaterial() {
    this.material = new MeshBasicMaterial({ color: this.buttoncolor });
  }

  createCheckGeometry() {
    this.checkgeometry = new PlaneGeometry(this.width * 0.7, this.width * 0.7)
  }

  createCheckMaterial() {
    this.checkmaterial = GlobalFlatUITheme.CheckMaterial;
  }

  setButtonColor(color: string) {
    if (this.material)
      (this.material as MeshBasicMaterial).color.setStyle(color);
  }

  override ngOnDestroy() {
    super.ngOnDestroy();

    this.selectable?.remove(this.mesh);
    this.selectable?.remove(this.checkmesh);

    this.geometry.dispose();
    this.material.dispose();

    this.checkgeometry.dispose();
    this.checkmaterial.dispose();
  }

  ngAfterViewInit(): void {
    this.mesh.addEventListener(LAYOUT_EVENT, (e: any) => {
      e.width = this.width;
      e.height = this.width;
      e.updated = true;
    });

    GlobalFlatUITheme.addEventListener(THEME_CHANGE_EVENT, () => {
      this.setButtonColor(this.buttoncolor);
    })
  }

  private mesh!: Mesh;

  protected meshready(mesh: Mesh) {
    this.selectable?.add(mesh);

    mesh.addEventListener('pointermove', () => { this.over() });
    mesh.addEventListener('pointerout', () => { this.out() });

    this.mesh = mesh;
  }

  protected checkready(mesh: Mesh) {
    this.selectable?.add(mesh)

    mesh.visible = this.checked;

    mesh.addEventListener('click', () => { this.doclick() })
    mesh.addEventListener('pointermove', () => { this.over() });
    mesh.addEventListener('pointerout', () => { this.out() });

    this.checkmesh = mesh;
  }

  protected clicked(event: NgtEvent<MouseEvent>) {
    if (event.object != this.checkmesh) return;
    event.stopPropagation();

    this.doclick();
  }

  private doclick() {
    if (!this.enabled || !this.visible) return;
    this.checked = !this.checked;
    this.change.next(this.checked);
  }

  private isover = false;
  protected over() {
    if (this.isover || !this.enabled) return;
    this.setButtonColor(this.hovercolor);
    this.isover = true;
  }
  protected out() {
    if (!this.enabled) return;
    this.setButtonColor(this.buttoncolor);
    this.isover = false;
  }

}
