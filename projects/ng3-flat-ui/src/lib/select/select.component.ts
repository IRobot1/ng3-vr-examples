import { AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from "@angular/core";

import { BufferGeometry, Line, Material, Mesh, Object3D, Shape, ShapeGeometry } from "three";
import { NgtObjectProps, NgtRadianPipe } from "@angular-three/core";

import { HEIGHT_CHANGED_EVENT, LAYOUT_EVENT, roundedRect, UIInput, WIDTH_CHANGED_EVENT } from "../flat-ui-utils";
import { GlobalFlatUITheme } from "../flat-ui-theme";

import { InteractiveObjects } from "../interactive-objects";
import { NgtGroup } from "@angular-three/core/group";
import { NgtMesh } from "@angular-three/core/meshes";
import { NgtLine } from "@angular-three/core/lines";
import { NgtSobaText } from "@angular-three/soba/abstractions";
import { NgtCircleGeometry } from "@angular-three/core/geometries";

@Component({
  selector: 'flat-ui-select',
  exportAs: 'flatUISelect',
  templateUrl: './select.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgtRadianPipe,
    NgtGroup,
    NgtMesh,
    NgtLine,
    NgtCircleGeometry,
    NgtSobaText,
  ]
})
export class FlatUISelect extends NgtObjectProps<Mesh> implements AfterViewInit, UIInput {
  private _text = '';
  @Input()
  get text(): string { return this._text }
  set text(newvalue: string) {
    this._text = newvalue;
    this.change.next(newvalue);
    this.updatedisplaytext();
  }

  private _placeholder?: string;
  @Input()
  get placeholder(): string | undefined { return this._placeholder }
  set placeholder(newvalue: string | undefined) {
    this._placeholder = newvalue;
    this.updatedisplaytext();
  }

  private updatedisplaytext() {
    if (this.text == '' && this.placeholder) {
      this.displaytext = this.placeholder;
    }
    else {
      this.displaytext = this.text.substring(0, this.overflow * this.width);
    }
  }

  @Input() overflow = 24;

  private _enabled = true;
  @Input()
  get enabled(): boolean { return this._enabled }
  set enabled(newvalue: boolean) {
    this._enabled = newvalue;
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


  private _disabledmaterial!: Material
  @Input()
  get disabledmaterial(): Material {
    if (this._disabledmaterial) return this._disabledmaterial;
    return GlobalFlatUITheme.DisabledMaterial;
  }
  set disabledmaterial(newvalue: Material) {
    this._disabledmaterial = newvalue;
  }

  private _labelmaterial!: Material
  @Input()
  get labelmaterial(): Material {
    if (this._labelmaterial) return this._labelmaterial;
    return GlobalFlatUITheme.LabelMaterial;
  }
  set labelmaterial(newvalue: Material) {
    this._labelmaterial = newvalue;
  }

  private _selectmaterial!: Material
  @Input()
  get selectmaterial(): Material {
    if (this._selectmaterial) return this._selectmaterial;
    return GlobalFlatUITheme.SelectMaterial;
  }
  set selectmaterial(newvalue: Material) {
    this._selectmaterial = newvalue;
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

  @Output() change = new EventEmitter<string>();

  @Input() geometry!: BufferGeometry;

  protected displaytext!: string;
  protected outline!: BufferGeometry; // outline material

  override preInit() {
    super.preInit();

    if (!this.geometry) this.createSelectGeoemetry();
  }

  createSelectGeoemetry() {
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

    mesh.addEventListener('click', (e: any) => { this.enableinput(mesh); e.stop = true; });
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
