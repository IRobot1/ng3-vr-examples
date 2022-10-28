import { AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from "@angular/core";

import { BufferGeometry, Line, Material, Mesh, Object3D, Shape, ShapeGeometry } from "three";
import { NgtObjectProps } from "@angular-three/core";

import { HEIGHT_CHANGED_EVENT, LAYOUT_EVENT, roundedRect, UIInput, WIDTH_CHANGED_EVENT } from "../flat-ui-utils";
import { GlobalFlatUITheme } from "../flat-ui-theme";

import { InteractiveObjects } from "../interactive-objects";

@Component({
  selector: 'flat-ui-input-text',
  exportAs: 'flatUIInputText',
  templateUrl: './input-text.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FlatUIInputText extends NgtObjectProps<Mesh> implements AfterViewInit, UIInput {
  private _text = '';
  @Input()
  get text(): string { return this._text }
  set text(newvalue: string) {
    this._text = newvalue;
    this.change.next(newvalue);
    this.updatedisplaytext();
  }

  @Input() overflow = 6;

  @Input()
  private _password = false;
  get password(): boolean { return this._password }
  set password(newvalue: boolean) {
    this._password = newvalue;
    this.updatedisplaytext();
  }


  private _enabled = true;
  @Input()
  get enabled(): boolean { return this._enabled }
  set enabled(newvalue: boolean) {
    this._enabled = newvalue;
    this.updatedisplaytext();
    if (this.mesh)
      this.setBackgroundColor();
  }

  private _placeholder?: string;
  @Input()
  get placeholder(): string | undefined { return this._placeholder }
  set placeholder(newvalue: string | undefined) {
    this._placeholder = newvalue;
    this.updatedisplaytext();
  }


  @Input() selectable?: InteractiveObjects;

  private _backgroundmaterial!: Material
  @Input()
  get backgroundmaterial(): Material {
    if (this._backgroundmaterial) return this._backgroundmaterial;
    return GlobalFlatUITheme.ButtonMaterial;
  }
  set backgroundmaterial(newvalue: Material) {
    this._backgroundmaterial = newvalue;
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

  private _disabledmaterial!: Material
  @Input()
  get disabledmaterial(): Material {
    if (this._disabledmaterial) return this._disabledmaterial;
    return GlobalFlatUITheme.DisabledMaterial;
  }
  set disabledmaterial(newvalue: Material) {
    this._disabledmaterial = newvalue;
  }

  private _textmaterial!: Material
  @Input()
  get textmaterial(): Material {
    if (this._textmaterial) return this._textmaterial;
    return GlobalFlatUITheme.StringMaterial;
  }
  set textmaterial(newvalue: Material) {
    this._textmaterial = newvalue;
  }

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

  private _inputopen = false;
  get inputopen(): boolean { return this._inputopen }
  set inputopen(newvalue: boolean) {
    this._inputopen = true;
    this.updatedisplaytext();
  }

  @Output() openinput = new EventEmitter<Object3D>();

  @Output() change = new EventEmitter<string>();

  @Input() geometry!: BufferGeometry;

  protected displaytext!: string;
  protected outline!: BufferGeometry; // outline material

  private updatedisplaytext() {
    let text
    if (this.text == '' && this.placeholder != undefined) {
      if (this.inputopen && this.enabled)
        text = '_'
      else
        text = this.placeholder;
    }
    else {
      if (this.password)
        text = '*'.repeat(this.text.length);
      else
        text = this.text.substring(this.text.length - this.overflow);

      if (this.inputopen && this.enabled) text += '_'
    }
    this.displaytext = text;
  }

  override preInit() {
    super.preInit();

    if (!this.geometry) this.createTextGeometry();
  }

  createTextGeometry() {
    const flat = new Shape();
    roundedRect(flat, 0, 0, this.width, this.height, 0.02);

    this.geometry = new ShapeGeometry(flat);
    this.geometry.center();

    this.outline = new BufferGeometry().setFromPoints(flat.getPoints());
    this.outline.center();
  }

  setBackgroundColor() {
    if (this.enabled) {
      this.mesh.material = this.backgroundmaterial;
    }
    else {
      this.mesh.material = this.disabledmaterial;
    }
  }

  override ngOnDestroy() {
    super.ngOnDestroy();

    this.selectable?.remove(this.mesh);

    this.geometry.dispose();
  }

  ngAfterViewInit(): void {
    this.mesh.addEventListener(LAYOUT_EVENT, (e: any) => {
      e.width = this.width;
      e.height = this.height;
      e.updated = true;
    });
  }

  private line!: Line;
  lineready(line: Line) {
    line.visible = false;
    this.line = line;
  }


  private mesh!: Mesh;

  meshready(mesh: Mesh) {
    this.selectable?.add(mesh);

    mesh.addEventListener('click', () => { this.enableinput(mesh) })
    mesh.addEventListener('pointermove', () => { this.over() });
    mesh.addEventListener('pointerout', () => { this.out() });

    this.mesh = mesh;
    this.setBackgroundColor();
  }

  enableinput(mesh: Mesh) {
    if (!this.enabled || !this.visible) return;

    this.inputopen = true;
    this.openinput.next(mesh);
  }


  isover = false;
  over() {
    if (this.isover || !this.enabled) return;
    this.line.visible = true;
    this.isover = true;
  }
  out() {
    if (!this.enabled) return;
    this.line.visible = false;
    this.isover = false;
  }
}
