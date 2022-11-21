import { AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from "@angular/core";

import { BufferGeometry, Line, Material, Mesh, PlaneGeometry, Shape, ShapeGeometry } from "three";
import { NgtEvent, NgtObjectProps } from "@angular-three/core";

import { HEIGHT_CHANGED_EVENT, LAYOUT_EVENT, roundedRect, WIDTH_CHANGED_EVENT } from "../flat-ui-utils";
import { GlobalFlatUITheme } from "../flat-ui-theme";

import { InteractiveObjects } from "../interactive-objects";
import { NgtGroup } from "@angular-three/core/group";
import { NgtMesh } from "@angular-three/core/meshes";
import { NgtLine } from "@angular-three/core/lines";

@Component({
  selector: 'flat-ui-input-checkbox',
  exportAs: 'flatUIInputCheckbox',
  templateUrl: './input-checkbox.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgtGroup,
    NgtMesh,
    NgtLine,
  ]
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

  private _enabled = true;
  @Input()
  get enabled(): boolean { return this._enabled }
  set enabled(newvalue: boolean) {
    this._enabled = newvalue;
    if (this.mesh)
      this.setBackgroundColor();
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

  private _checkmaterial!: Material
  @Input()
  get checkmaterial(): Material {
    if (this._checkmaterial) return this._checkmaterial;
    return GlobalFlatUITheme.CheckMaterial;
  }
  set checkmaterial(newvalue: Material) {
    this._checkmaterial = newvalue;
  }

  @Input() geometry!: BufferGeometry;
  @Input() checkgeometry!: BufferGeometry;


  @Input() selectable?: InteractiveObjects;

  @Output() change = new EventEmitter<boolean>();

  protected outline!: BufferGeometry; // outline material

  private checkmesh!: Mesh;

  override preInit() {
    super.preInit();

    if (!this.geometry) this.createButtonGeometry();
    if (!this.checkgeometry) this.createCheckGeometry();
  }

  createButtonGeometry() {
    const flat = new Shape();
    roundedRect(flat, 0, 0, this.width, this.width, 0.02);

    this.geometry = new ShapeGeometry(flat);
    this.geometry.center();

    this.outline = new BufferGeometry().setFromPoints(flat.getPoints());
    this.outline.center();
  }

  createCheckGeometry() {
    this.checkgeometry = new PlaneGeometry(this.width * 0.7, this.width * 0.7)
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
    this.selectable?.remove(this.checkmesh);

    this.geometry.dispose();
    this.checkgeometry.dispose();
  }

  ngAfterViewInit(): void {
    this.mesh.addEventListener(LAYOUT_EVENT, (e: any) => {
      e.width = this.width;
      e.height = this.width;
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

    mesh.addEventListener('pointermove', () => { this.over() });
    mesh.addEventListener('pointerout', () => { this.out() });

    this.mesh = mesh;
    this.setBackgroundColor();
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
    this.line.visible = true;
    this.isover = true;
  }
  protected out() {
    this.line.visible = false;
    this.isover = false;
  }

}
