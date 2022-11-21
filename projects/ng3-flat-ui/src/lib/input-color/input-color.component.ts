import { AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from "@angular/core";

import { BufferGeometry, Color, Line, Material, Mesh, MeshBasicMaterial, Object3D, Shape, ShapeGeometry } from "three";
import { make, NgtObjectProps } from "@angular-three/core";

import { HEIGHT_CHANGED_EVENT, LAYOUT_EVENT, roundedRect, UIInput, WIDTH_CHANGED_EVENT } from "../flat-ui-utils";

import { InteractiveObjects } from "../interactive-objects";
import { GlobalFlatUITheme } from "../flat-ui-theme";
import { NgtGroup } from "@angular-three/core/group";
import { NgtMesh } from "@angular-three/core/meshes";
import { NgtLine } from "@angular-three/core/lines";

@Component({
  selector: 'flat-ui-input-color',
  exportAs: 'flatUIInputColor',
  templateUrl: './input-color.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgtGroup,
    NgtMesh,
    NgtLine,
  ]
})
export class FlatUIInputColor extends NgtObjectProps<Mesh> implements AfterViewInit, UIInput {
  private _text = GlobalFlatUITheme.ButtonColor;
  @Input()
  get text(): string { return this._text }
  set text(newvalue: string) {
    this._text = '#' + make(Color, newvalue).getHexString();
    this.updatecolor();
    this.change.next(newvalue);

  }

  @Input() enabled = true;

  private _width = 0.4;
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


  private _outlinematerial!: Material
  @Input()
  get outlinematerial(): Material {
    if (this._outlinematerial) return this._outlinematerial;
    return GlobalFlatUITheme.OutlineMaterial;
  }
  set outlinematerial(newvalue: Material) {
    this._outlinematerial = newvalue;
  }


  @Input() selectable?: InteractiveObjects;

  @Input() geometry!: BufferGeometry;

  inputopen = false;
  @Output() openinput = new EventEmitter<Object3D>();

  @Output() change = new EventEmitter<string>();

  protected outline!: BufferGeometry; // outline material
  protected material!: Material;

  private updatecolor() {
    if (!this.mesh) return;

    (this.mesh.material as MeshBasicMaterial).color.setStyle(this.text);
  }

  override preInit() {
    super.preInit();

    if (!this.geometry) this.createButtonGeometry()
    this.createButtonMaterial()
  }

  createButtonGeometry() {
    let flat = new Shape();
    roundedRect(flat, 0, 0, this.width, this.height, 0.02);

    this.outline = new BufferGeometry().setFromPoints(flat.getPoints());
    this.outline.center();

    flat = new Shape();
    roundedRect(flat, 0, 0, this.width - 0.01, this.height - 0.01, 0.02);

    this.geometry = new ShapeGeometry(flat);
    this.geometry.center();

  }

  createButtonMaterial() {
    this.material = new MeshBasicMaterial();
    this.updatecolor();
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
  }

  private line!: Line;
  lineready(line: Line) {
    line.visible = false;
    this.line = line;
  }


  private mesh!: Mesh;

  protected meshready(mesh: Mesh) {
    this.selectable?.add(mesh)

    mesh.addEventListener('click', () => { this.enableinput(mesh) });
    mesh.addEventListener('pointermove', () => { this.over() });
    mesh.addEventListener('pointerout', () => { this.out() });

    this.mesh = mesh;
    this.updatecolor();
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
