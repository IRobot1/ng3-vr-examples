import { ChangeDetectionStrategy, Component, ContentChild, Input, TemplateRef } from "@angular/core";

import { BufferGeometry, Intersection, Line, Material, Mesh, Object3D, Shape, ShapeGeometry, Vector3 } from "three";
import { NgtEvent, NgtObjectProps } from "@angular-three/core";

import { GlobalFlatUITheme } from "../flat-ui-theme";

import { InteractiveObjects } from "../interactive-objects";
import { roundedRect } from "../flat-ui-utils";

@Component({
  selector: 'flat-ui-card',
  exportAs: 'flatUICard',
  templateUrl: './card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FlatUICard extends NgtObjectProps<Mesh>{
  private _width = 1
  @Input()
  get width(): number { return this._width }
  set width(newvalue: number) {
    this._width = newvalue;
    this.updateCardGeometry();
  }


private _height = 1;
  @Input()
  get height(): number { return this._height }
  set height(newvalue: number) {
    this._height = newvalue;
    this.updateCardGeometry();
  }

  @Input() selectable?: InteractiveObjects;

  private _panelmaterial?: Material;
  @Input()
  get panelmaterial(): Material {
    if (this._panelmaterial) return this._panelmaterial;
    return GlobalFlatUITheme.PanelMaterial;
  }
  set panelmaterial(newvalue: Material) {
    this._panelmaterial = newvalue;
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

  @Input() geometry!: BufferGeometry;

  @ContentChild('card') card?: TemplateRef<unknown>;

  protected outline!: BufferGeometry; // outline material

  override preInit() {
    super.preInit();

    if (!this.geometry) this.updateCardGeometry();
  }

  updateCardGeometry() {
    const flat = new Shape();
    roundedRect(flat, 0, 0, this.width, this.height, 0.02);

    this.geometry = new ShapeGeometry(flat);
    this.geometry.center();

    this.outline = new BufferGeometry().setFromPoints(flat.getPoints());
    this.outline.center();
  }

  override ngOnDestroy() {
    super.ngOnDestroy();

    this.selectable?.remove(this.mesh);
  }

  private line!: Line;
  lineready(line: Line) {
    line.visible = false;
    this.line = line;
  }


  private isover = false;
  over() {
    if (this.isover) return;

    this.line.visible = true;
    this.isover = true;
  }
  out() {
    this.line.visible = false;
    this.isover = false;
  }


  private mesh!: Mesh;

  protected meshready(mesh: Mesh) {
    this.selectable?.add(mesh);

    mesh.addEventListener('pointerdown', (e: any) => {
      this.dragging = true;
      this.over();
    });

    const dragend = (e: any) => {
      this.dragging = false;
      this.out();
      e.stop = true;
    };

    mesh.addEventListener('pointerup', dragend);
    mesh.addEventListener('pointerout', dragend);
    mesh.addEventListener('raymissed', dragend);

    mesh.addEventListener('pointermove', (e: any) => { this.domovemesh(e.data); e.stop = true; });

    this.mesh = mesh;
  }

  panel!: Object3D;
  protected panelready(panel: Object3D) {
    this.panel = panel;
  }

  //
  // dragging
  //
  protected dragging = false;

  protected movemesh(event: NgtEvent<PointerEvent>) {
    if (event.object != this.mesh) return;
    event.stopPropagation();

    this.domovemesh(event.intersections[0]);
  }

  private domovemesh(event: Intersection) {
    if (this.dragging) {
      const position = new Vector3();
      this.panel.getWorldPosition(position);

      this.panel.position.x += event.point.x - position.x;
      this.panel.position.y += event.point.y - position.y;
    }
    this.over();
  }
}
