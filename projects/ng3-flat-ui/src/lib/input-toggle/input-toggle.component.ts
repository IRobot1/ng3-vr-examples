import { AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from "@angular/core";

import { BufferGeometry, Line, Material, Mesh, Shape, ShapeGeometry } from "three";
import { NgtEvent, NgtObjectProps } from "@angular-three/core";

import { HEIGHT_CHANGED_EVENT, LAYOUT_EVENT, roundedRect, WIDTH_CHANGED_EVENT } from "../flat-ui-utils";
import { GlobalFlatUITheme } from "../flat-ui-theme";

import { InteractiveObjects } from "../interactive-objects";

@Component({
  selector: 'flat-ui-input-toggle',
  exportAs: 'flatUIInputToggle',
  templateUrl: './input-toggle.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FlatUIInputToggle extends NgtObjectProps<Mesh> implements AfterViewInit {
  private _checked = false;
  @Input()
  get checked(): boolean { return this._checked }
  set checked(newvalue: boolean) {
    this._checked = newvalue;
    this.togglematerial = newvalue ? this.truematerial : this.falsematerial;

    if (this.togglemesh) {
      this.updatetoggle();
    }
  }

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


  private _falsematerial!: Material
  @Input()
  get falsematerial(): Material {
    if (this._falsematerial) return this._falsematerial;
    return GlobalFlatUITheme.ToggleFalseMaterial;
  }
  set falsematerial(newvalue: Material) {
    this._falsematerial = newvalue;
  }

  private _truematerial!: Material
  @Input()
  get truematerial(): Material {
    if (this._truematerial) return this._truematerial;
    return GlobalFlatUITheme.ToggleTrueMaterial;
  }
  set truematerial(newvalue: Material) {
    this._truematerial = newvalue;
  }

  protected width = 0.2;
  protected height = 0.1;

  @Input() selectable?: InteractiveObjects;

  @Output() change = new EventEmitter<boolean>();

  @Input() geometry!: BufferGeometry;

  protected togglematerial = this.falsematerial;

  protected outline!: BufferGeometry; // outline material

  override preInit() {
    super.preInit();

    if (!this.geometry) this.createToggleGeometry();
  }

  createToggleGeometry() {
    const flat = new Shape();
    roundedRect(flat, 0, 0, this.width, this.height, this.height / 2);

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
    this.selectable?.remove(this.togglemesh);

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

    mesh.addEventListener('click', (e: any) => { this.doclicked(); e.stop = true; });
    mesh.addEventListener('pointermove', (e: any) => { this.over(); e.stop = true; });
    mesh.addEventListener('pointerout', (e: any) => { this.out(); e.stop = true; });

    this.mesh = mesh;
    this.setBackgroundColor();
}


  private togglemesh!: Mesh;

  protected toggleready(mesh: Mesh) {
    this.selectable?.add(mesh);

    mesh.addEventListener('click', (e: any) => { this.doclicked(); e.stop = true; });

    this.togglemesh = mesh;

    this.updatetoggle();

  }

  private updatetoggle() {
    const offset = this.width / 4;
    this.togglemesh.position.x = this.checked ? offset : -offset;
  }

  protected clicked(mesh: Mesh, event: NgtEvent<MouseEvent>) {
    if (event.object != mesh) return;
    event.stopPropagation();

    this.doclicked();
  }

  private doclicked() {
    if (!this.enabled || !this.visible) return;

    this.checked = !this.checked;
    this.change.next(this.checked);
  }

  protected over() {
    if (!this.enabled) return;
    this.line.visible = true;
  }
  protected out() {
    this.line.visible = false;
  }


}
