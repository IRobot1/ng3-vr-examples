import { ChangeDetectionStrategy, Component, ContentChild, EventEmitter, Input, Output, TemplateRef } from "@angular/core";

import { BufferGeometry, Intersection, Line, Material, Mesh, MeshBasicMaterial, Object3D, PlaneGeometry, Shape, ShapeGeometry, Vector3 } from "three";
import { NgtEvent, NgtObjectProps } from "@angular-three/core";

import { GlobalFlatUITheme, THEME_CHANGE_EVENT } from "../flat-ui-theme";

import { InteractiveObjects } from "../interactive-objects";

@Component({
  selector: 'flat-ui-drag-panel',
  exportAs: 'flatUIIconDragPanel',
  templateUrl: './drag-panel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FlatUIDragPanel extends NgtObjectProps<Mesh>{
  private _title = '';
  @Input()
  get title(): string { return this._title }
  set title(newvalue: string) {
    this._title = newvalue;
    this.displaytitle = this.title.substring(0, this.overflow * this.width);
  }

  @Input() titlefontsize = 0.07;
  @Input() overflow = 16;

  @Input() width = 1
  @Input() height = 1;

  @Input() expanded = true;

  @Input() minscale = 0.5;

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

  private _titlematerial!: Material
  @Input()
  get titlematerial(): Material {
    if (this._titlematerial) return this._titlematerial;
    return GlobalFlatUITheme.TitleMaterial;
  }
  set titlematerial(newvalue: Material) {
    this._titlematerial = newvalue;
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

  private _outlinematerial!: Material
  @Input()
  get outlinematerial(): Material {
    if (this._outlinematerial) return this._outlinematerial;
    return GlobalFlatUITheme.OutlineMaterial;
  }
  set outlinematerial(newvalue: Material) {
    this._outlinematerial = newvalue;
  }

  private _scalematerial!: Material
  @Input()
  get scalematerial(): Material {
    if (this._scalematerial) return this._scalematerial;
    return GlobalFlatUITheme.ScaleMaterial;
  }
  set scalematerial(newvalue: Material) {
    this._scalematerial = newvalue;
  }


  @Input() locked = false;
  @Input() showexpand = true;
  @Input() showclose = true;
  @Input() scalable = true;

 
  @Output() close = new EventEmitter<boolean>();

  displaytitle!: string;

  @ContentChild(TemplateRef) templateRef?: TemplateRef<unknown>;

  protected outline!: BufferGeometry; // outline material

  protected titleheight = 0.1;

  override preInit() {
    super.preInit();

    const halfwidth = this.width / 2 - 0.1;
    const halfheight = this.titleheight / 2;

    const title = new Shape();
    title.moveTo(-halfwidth, halfheight)
    title.lineTo(halfwidth, halfheight)
    title.lineTo(halfwidth, -halfheight)
    title.lineTo(-halfwidth, -halfheight)
    title.closePath();

    this.outline = new BufferGeometry().setFromPoints(title.getPoints());
    this.outline.center();
  }

  override ngOnDestroy() {
    super.ngOnDestroy();

    this.selectable?.remove(this.mesh);
  }

  panelready(panel: Mesh) {
    panel.visible = false;
    // when expanding, hide long enough for layout to complete once
    const timer = setTimeout(() => {
      panel.visible = true;
      clearTimeout(timer)
    }, 150)
  }

  line!: Line;
  lineready(line: Line) {
    line.visible = false;
    this.line = line;
  }


  isover = false;
  over() {
    if (this.locked || this.isover) return;

    this.line.visible = true;
    this.isover = true;
  }
  out() {
    this.line.visible = false;
    this.isover = false;
  }


  private mesh!: Mesh;

  meshready(mesh: Mesh, panel: Object3D) {
    this.selectable?.add(mesh);

    const camera = this.store.get(s => s.camera);
    const scene = this.store.get(s => s.scene);

    mesh.addEventListener('pointerdown', (e: any) => {
      if (this.locked) return;
      this.dragging = true;
      panel.lookAt(camera.position);
      e.controller.attach(panel);
      this.over();
    });

    const dragend = (e: any) => {
      if (this.locked) return;
      this.dragging = false;
      scene.attach(panel);
      this.out();
      e.stop = true;
    };

    mesh.addEventListener('pointerup', dragend);
    mesh.addEventListener('pointerout', dragend);
    mesh.addEventListener('raymissed', dragend);

    mesh.addEventListener('pointermove', (e: any) => { this.over(); e.stop = true; });
  }

  showscaling = false;
  dragging = false;
  offset = 0;
  movepanel(titlebar: Mesh, event: NgtEvent<PointerEvent>, panel: Object3D) {
    if (event.object != titlebar) return;
    event.stopPropagation();

    this.domovepanel(titlebar, event, panel);
  }

  private domovepanel(titlebar: Mesh, event: Intersection, panel: Object3D) {
    if (this.locked) return;

    if (this.dragging) {
      const position = new Vector3();
      titlebar.getWorldPosition(position);

      panel.position.x = event.point.x;
      panel.position.y += event.point.y - position.y;

      // allow selecting anywhere in the title bar
      if (!this.offset && Math.abs(event.point.x - position.x) > 0.1) {
        this.offset = Math.abs(event.point.x - position.x);
      }
      if (event.point.x < position.x)
        panel.position.x += this.offset;
      else
        panel.position.x -= this.offset;
    }
    else {
      this.offset = 0;
    }
  }

  private scalemeshes: Array<Mesh> = [];

  scaleready(mesh: Mesh, panel: Object3D) {
    this.selectable?.add(mesh);

    mesh.addEventListener('pointermove', (e: any) => {
      this.showscaling = true;
      this.doscale(mesh, e.data, panel);
      e.stop = true;
    });

    mesh.addEventListener('pointerdown', (e: any) => { this.scaling = true; e.stop = true; });
    mesh.addEventListener('pointerup', (e: any) => { this.scaling = false; });
    mesh.addEventListener('pointerout', () => { this.showscaling = false; });
    mesh.addEventListener('raymissed', () => { this.scaling = false; });

    this.scalemeshes.push(mesh);
  }


  scaling = false;
  scalepanel(mesh: Mesh, event: NgtEvent<PointerEvent>, panel: Object3D) {
    if (event.object != mesh) return;
    event.stopPropagation();

    this.doscale(mesh, event, panel);
    this.postscale(panel);
  }

  private doscale(mesh: Mesh, event: Intersection, panel: Object3D) {

    if (this.scaling) {
      panel.worldToLocal(event.point);

      let diffx;
      if (mesh.position.x < 0)  // left side
        diffx = mesh.position.x - event.point.x;
      else
        diffx = event.point.x - mesh.position.x;
      const diffy = mesh.position.y - event.point.y;

      // scale width and height by same amount
      panel.scale.x += diffx;
      panel.scale.y += diffy;


      this.postscale(panel);
    }
  }

  private postscale(panel: Object3D) {
    panel.scale.x = Math.max(this.minscale, panel.scale.x);
    panel.scale.y = Math.max(this.minscale, panel.scale.y);

    this.scalemeshes.forEach(mesh => {
      if (panel.scale.x < 1) {
        mesh.scale.x = 1 / panel.scale.x;
        mesh.scale.y = 1 / panel.scale.y;
      }
    });

  }
}
