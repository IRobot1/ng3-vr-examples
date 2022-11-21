import { AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from "@angular/core";

import { BufferGeometry, Line, Material, MathUtils, Mesh, Object3D, Shape, ShapeGeometry } from "three";
import { NgtObjectProps } from "@angular-three/core";

import { HEIGHT_CHANGED_EVENT, LAYOUT_EVENT, roundedRect, UIInput, WIDTH_CHANGED_EVENT } from "../flat-ui-utils";
import { GlobalFlatUITheme } from "../flat-ui-theme";

import { InteractiveObjects } from "../interactive-objects";
import { NgtGroup } from "@angular-three/core/group";
import { NgtMesh } from "@angular-three/core/meshes";
import { NgtSobaText } from "@angular-three/soba/abstractions";
import { NgtLine } from "@angular-three/core/lines";

@Component({
  selector: 'flat-ui-input-number',
  exportAs: 'flatUIInputNumber',
  templateUrl: './input-number.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgtGroup,
    NgtMesh,
    NgtLine,
    NgtSobaText,
  ]
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
    if (this.mesh)
      this.setBackgroundColor();
  }

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

  private _inputopen = false;
  get inputopen(): boolean { return this._inputopen }
  set inputopen(newvalue: boolean) {
    this._inputopen = newvalue;
    this.updatedisplaytext();
  }
  @Output() openinput = new EventEmitter<Object3D>();
  @Output() change = new EventEmitter<number>();

  protected displaytext!: string;

  protected outline!: BufferGeometry; // outline material

  private updatedisplaytext() {
    let text = this.text.substring(this.text.length - this.overflow);
    if (this.inputopen && this.enabled) text += '_'
    this.displaytext = text;
  }

  override preInit() {
    super.preInit();

    if (!this.geometry) this.createButtonGeometry();
  }

  createButtonGeometry() {
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

  protected meshready(mesh: Mesh) {
    this.selectable?.add(mesh);

    mesh.addEventListener('click', (e: any) => { this.enableinput(mesh); e.stop = true; })
    mesh.addEventListener('pointermove', (e: any) => { this.over(); e.stop = true; });
    mesh.addEventListener('pointerout', (e: any) => { this.out(); e.stop = true; });

    this.mesh = mesh;
    this.setBackgroundColor();
  }


  protected enableinput(mesh: Mesh) {
    if (!this.enabled || !this.visible) return;

    this.inputopen = true;
    this.openinput.next(mesh);
  }

  private isover = false;
  protected over() {
    if (this.isover || !this.enabled) return;
    this.line.visible = true;
    this.isover = true;
  }
  protected out() {
    if (!this.enabled) return;
    this.line.visible = false;
    this.isover = false;
  }

}
