import { AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from "@angular/core";

import { BufferGeometry, Material, MathUtils, Mesh, MeshBasicMaterial, Object3D, Shape, ShapeGeometry } from "three";
import { NgtObjectProps } from "@angular-three/core";

import { HEIGHT_CHANGED_EVENT, LAYOUT_EVENT, roundedRect, UIInput, WIDTH_CHANGED_EVENT } from "../flat-ui-utils";
import { THEME_CHANGE_EVENT, GlobalFlatUITheme } from "../flat-ui-theme";

import { InteractiveObjects } from "../interactive-objects";

@Component({
  selector: 'flat-ui-input-number',
  exportAs: 'flatUIInputNumber',
  templateUrl: './input-number.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FlatUIInputNumber extends NgtObjectProps<Mesh> implements AfterViewInit, UIInput {
  private _text = '';
  @Input()
  get text(): string { return this._text }
  set text(newvalue: string) {
    if (newvalue == '.' || newvalue == '-' || newvalue == '-.') {
      this._text = newvalue;
    }
    else {
      let value = +newvalue;
      if (!isNaN(value)) {
        if (this.min != undefined && this.max != undefined)
          value = MathUtils.clamp(value, this.min, this.max);
        this.change.next(value);

        this._text = newvalue;
      }
    }
    this.updatedisplaytext();
  }
  @Input() overflow = 6;

  @Input() min?: number;
  @Input() max?: number;

  private _enabled = true;
  @Input()
  get enabled(): boolean { return this._enabled }
  set enabled(newvalue: boolean) {
    this._enabled = newvalue;
    this.updatedisplaytext();
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

  private _numbermaterial!: Material
  @Input()
  get numbermaterial(): Material {
    if (this._numbermaterial) return this._numbermaterial;
    return GlobalFlatUITheme.NumberMaterial;
  }
  set numbermaterial(newvalue: Material) {
    this._numbermaterial = newvalue;
  }


  @Input() selectable?: InteractiveObjects;

  private _width = 0.5;
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

  @Input() geometry!: BufferGeometry;
  @Input() material!: MeshBasicMaterial;

  private _inputopen = false;
  get inputopen(): boolean { return this._inputopen }
  set inputopen(newvalue: boolean) {
    this._inputopen = newvalue;
    this.updatedisplaytext();
  }
  @Output() openinput = new EventEmitter<Object3D>();
  @Output() change = new EventEmitter<number>();

  protected displaytext!: string;

  private updatedisplaytext() {
    let text = this.text.substring(this.text.length - this.overflow);
    if (this.inputopen && this.enabled) text += '_'
    this.displaytext = text;
  }

  override preInit() {
    super.preInit();

    if (!this.geometry) this.createButtonGeometry();
    if (!this.material) this.createButtonMaterial();
  }

  createButtonGeometry() {
    const flat = new Shape();
    roundedRect(flat, 0, 0, this.width, this.height, 0.02);

    this.geometry = new ShapeGeometry(flat);
    this.geometry.center();
  }

  createButtonMaterial() {
    this.material = new MeshBasicMaterial({ color: this.buttoncolor });
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
      this.material.color.setStyle(this.enabled ? this.buttoncolor : this.disabledcolor);
    })

    this.material.color.setStyle(this.enabled ? this.buttoncolor : this.disabledcolor);
  }

  private mesh!: Mesh;

  protected meshready(mesh: Mesh) {
    this.selectable?.add(mesh);

    mesh.addEventListener('click', (e: any) => { this.enableinput(mesh); e.stop = true; })
    mesh.addEventListener('pointermove', (e: any) => { this.over(); e.stop = true; });
    mesh.addEventListener('pointerout', (e: any) => { this.out(); e.stop = true; });

    this.mesh = mesh;
  }


  protected enableinput(mesh: Mesh) {
    if (!this.enabled || !this.visible) return;

    this.inputopen = true;
    this.openinput.next(mesh);
  }

  private isover = false;
  protected over() {
    if (this.isover || !this.enabled) return;
    this.material.color.setStyle(this.hovercolor);
    this.isover = true;
  }
  protected out() {
    if (!this.enabled) return;
    this.material.color.setStyle(this.buttoncolor);
    this.isover = false;
  }

}
