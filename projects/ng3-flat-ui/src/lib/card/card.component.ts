import { ChangeDetectionStrategy, Component, ContentChild, EventEmitter, Input, Output, TemplateRef } from "@angular/core";

import { BufferGeometry, Intersection, Line, Material, Mesh, Object3D, Shape, ShapeGeometry, Vector3 } from "three";
import { NgtEvent, NgtObjectProps } from "@angular-three/core";

import { GlobalFlatUITheme } from "../flat-ui-theme";

import { InteractiveObjects } from "../interactive-objects";
import { roundedRect } from "../flat-ui-utils";
import { DRAG_END_EVENT, DRAG_START_EVENT } from "../drag-and-drop";

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
  @Input() data: any;

  @Input() cardtype = 'card';
  @Input() allowdragging = true;
  @Input() showhover = true;

  private _cardmaterial?: Material;
  @Input()
  get cardmaterial(): Material {
    if (this._cardmaterial) return this._cardmaterial;
    return GlobalFlatUITheme.PanelMaterial;
  }
  set cardmaterial(newvalue: Material) {
    this._cardmaterial = newvalue;
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

  @Output() moved = new EventEmitter<Vector3>();

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

    this.geometry.dispose();
    this.outline.dispose();

  }

  private line!: Line;
  lineready(line: Line) {
    line.visible = false;
    this.line = line;
  }


  private isover = false;
  over() {
    if (!this.showhover || this.isover) return;

    this.line.visible = true;
    this.isover = true;
  }
  out() {
    this.line.visible = false;
    this.isover = false;
  }


  protected startdragging() {
    if (!this.allowdragging) return;
    this.dragging = true;
    this.panel.position.z += 0.005;
    this.panel.dispatchEvent({ type: DRAG_START_EVENT, dragtype: this.cardtype, data: this.data })
    this.over();

  }

  protected enddragging() {
    this.out();
    if (!this.allowdragging || !this.dragging) return;
    this.dragging = false;
    this.panel.position.z -= 0.005;
    this.panel.dispatchEvent({ type: DRAG_END_EVENT, dragtype: this.cardtype, data: this.data })
  }

  private _mesh!: Mesh;
  get mesh(): Mesh { return this._mesh }

  protected meshready(mesh: Mesh) {
    this.selectable?.add(mesh);

    mesh.addEventListener('pointerdown', (e: any) => { this.startdragging() });
    mesh.addEventListener('pointerover', (e: any) => { this.pointerover.next(e.data) });

    mesh.addEventListener('pointerup', () => { this.enddragging(); });
    mesh.addEventListener('pointerout', (e: any) => { this.enddragging(); this.pointerout.next(e.data) });
    mesh.addEventListener('raymissed', () => { this.enddragging(); });

    mesh.addEventListener('pointermove', (e: any) => { this.domovemesh(e.data) });

    this._mesh = mesh;
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

    this.domovemesh(event.intersections[0]);
  }

  private domovemesh(event: Intersection) {
    if (this.dragging && this.allowdragging) {
      const position = new Vector3();
      this.panel.getWorldPosition(position);

      this.panel.position.x += event.point.x - position.x;
      this.panel.position.y += event.point.y - position.y;

      this.moved.next(this.panel.position.clone());
    }
    this.over();
  }
}
