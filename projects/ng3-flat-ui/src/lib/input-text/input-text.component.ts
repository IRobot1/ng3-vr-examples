import { AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from "@angular/core";

import { BufferGeometry, Material, Mesh, MeshBasicMaterial, Object3D, Shape, ShapeGeometry } from "three";
import { NgtObjectProps } from "@angular-three/core";

import { HEIGHT_CHANGED_EVENT, LAYOUT_EVENT, roundedRect, UIInput, WIDTH_CHANGED_EVENT } from "../flat-ui-utils";
import { GlobalFlatUITheme, THEME_CHANGE_EVENT } from "../flat-ui-theme";

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
    this._enabled = true;
    this.updatedisplaytext();
  }

  private _placeholder?: string;
  @Input()
  get placeholder(): string | undefined { return this._placeholder }
  set placeholder(newvalue: string | undefined) {
    this._placeholder = newvalue;
    this.updatedisplaytext();
  }


  @Input() selectable?: InteractiveObjects;

  private _buttoncolor?: string;
  @Input()
  get buttoncolor(): string {
    if (this._buttoncolor) return this._buttoncolor;
    return GlobalFlatUITheme.ButtonColor;
  }
  set buttoncolor(newvalue: string) {
    this._buttoncolor = newvalue;
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

  private _hovercolor?: string;
  @Input()
  get hovercolor(): string {
    if (this._hovercolor) return this._hovercolor;
    return GlobalFlatUITheme.HoverColor;
  }
  set hovercolor(newvalue: string) {
    this._hovercolor = newvalue;
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

  geometry!: BufferGeometry;
  material!: MeshBasicMaterial;

  protected displaytext!: string;

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

    const flat = new Shape();
    roundedRect(flat, 0, 0, this.width, this.height, 0.02);

    this.geometry = new ShapeGeometry(flat);
    this.geometry.center();

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

  meshready(mesh: Mesh) {
    this.selectable?.add(mesh);

    mesh.addEventListener('click', () => { this.enableinput(mesh) })
    mesh.addEventListener('pointermove', () => { this.over() });
    mesh.addEventListener('pointerout', () => { this.out() });

    this.mesh = mesh;
  }

  enableinput(mesh: Mesh) {
    if (!this.enabled || !this.visible) return;

    this.inputopen = true;
    this.openinput.next(mesh);
  }


  isover = false;
  over() {
    if (this.isover || !this.enabled) return;
    this.material.color.setStyle(this.hovercolor);
    this.isover = true;
  }
  out() {
    if (!this.enabled) return;
    this.material.color.setStyle(this.buttoncolor);
    this.isover = false;
  }
}
