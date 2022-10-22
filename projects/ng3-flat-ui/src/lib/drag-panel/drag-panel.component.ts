import { ChangeDetectionStrategy, Component, ContentChild, EventEmitter, Input, Output, TemplateRef } from "@angular/core";

import { BufferGeometry, Intersection, Mesh, MeshBasicMaterial, Object3D, Shape, ShapeGeometry, Vector3 } from "three";
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
  @Input() title = '';
  @Input() titlefontsize = 0.07;
  @Input() overflow = 16;

  @Input() width = 1
  @Input() height = 1;

  @Input() expanded = true;

  @Input() minscale = 0.5;

  @Input() selectable?: InteractiveObjects;

  private _panelcolor?: string;
  @Input()
  get panelcolor(): string {
    if (this._panelcolor) return this._panelcolor;
    return GlobalFlatUITheme.PanelColor;
  }
  set panelcolor(newvalue: string) {
    this._panelcolor = newvalue;
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

  private _labelcolor?: string;
  @Input()
  get labelcolor(): string {
    if (this._labelcolor) return this._labelcolor;
    return GlobalFlatUITheme.LabelColor;
  }
  set labelcolor(newvalue: string) {
    this._labelcolor = newvalue;
  }

  @Input() locked = false;
  @Input() showexpand = true;
  @Input() showclose = true;
  @Input() resizable = true;

  @Output() close = new EventEmitter<boolean>();

  get displaytitle(): string { return this.title.slice(0, this.overflow * this.width); }

  @ContentChild(TemplateRef) templateRef?: TemplateRef<unknown>;

  geometry!: BufferGeometry;
  titlematerial!: MeshBasicMaterial;

  override preInit() {
    super.preInit();

    const corner = new Shape();
    corner.lineTo(0.1, 0)
    corner.lineTo(0.1, -0.01)
    corner.lineTo(0.01, -0.01)
    corner.lineTo(0.01, -0.1)
    corner.lineTo(0, -0.1)
    corner.lineTo(0, 0)

    this.geometry = new ShapeGeometry(corner);

    this.titlematerial = new MeshBasicMaterial({ color: this.panelcolor, transparent: true, opacity: 0.3 });
  }

  override ngOnDestroy() {
    super.ngOnDestroy();

    this.selectable?.remove(this.mesh);

    this.geometry.dispose();
    this.titlematerial.dispose();
  }

  panelready(panel: Mesh) {

    GlobalFlatUITheme.addEventListener(THEME_CHANGE_EVENT, () => {
      this.titlematerial.color.setStyle(this.panelcolor);
    })

    panel.visible = false;
    // when expanding, hide long enough for layout to complete once
    const timer = setTimeout(() => {
      panel.visible = true;
      clearTimeout(timer)
    }, 150)
  }

  isover = false;
  over() {
    if (this.locked) return;
    if (this.isover) return;
    this.titlematerial.color.setStyle(this.hovercolor);
    this.isover = true;
  }
  out() {
    this.titlematerial.color.setStyle(this.panelcolor);
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

    const dragend = () => {
      if (this.locked) return;
      this.dragging = false;
      scene.attach(panel);
      this.out();
    };

    mesh.addEventListener('pointerup', dragend);
    mesh.addEventListener('pointerout', dragend);
    mesh.addEventListener('raymissed', dragend);

    mesh.addEventListener('pointermove', () => { this.over() });
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

  scaleready(mesh: Mesh, panel: Object3D, horizontal: boolean) {
    this.selectable?.add(mesh);

    mesh.addEventListener('pointermove', (e: any) => {
      this.showscaling = true;
      if (horizontal)
        this.doscalehorizontal(mesh, e.data, panel);
      else
        this.doscalevertical(mesh, e.data, panel);
      e.stop = true;
    });

    mesh.addEventListener('pointerdown', (e: any) => { this.scaling = true; e.stop = true; });
    mesh.addEventListener('pointerup', (e: any) => { this.scaling = false; });
    mesh.addEventListener('pointerout', () => { this.showscaling = false; });
    mesh.addEventListener('raymissed', () => { this.scaling = false; });

    this.scalemeshes.push(mesh);
  }


  scaling = false;
  scalehorizontal(mesh: Mesh, event: NgtEvent<PointerEvent>, panel: Object3D) {
    if (event.object != mesh) return;
    event.stopPropagation();

    this.doscalehorizontal(mesh, event, panel);
    this.postscale(panel);
  }

  private doscalehorizontal(mesh: Mesh, event: Intersection, panel: Object3D) {

    if (this.scaling) {
      panel.worldToLocal(event.point);

      let diff;
      if (mesh.position.x < 0)  // left side
        diff = mesh.position.x - event.point.x;
      else
        diff = event.point.x - mesh.position.x;

      // scale width and height by same amount
      panel.scale.x += diff;
      panel.scale.y += diff;

      this.postscale(panel);
    }
  }

  scalevertical(mesh: Mesh, event: NgtEvent<PointerEvent>, panel: Object3D) {
    if (event.object != mesh) return;
    event?.stopPropagation();

    this.doscalevertical(mesh, event, panel);
    this.postscale(panel);
  }

  private doscalevertical(mesh: Mesh, event: Intersection, panel: Object3D) {
    if (this.scaling) {
      panel.worldToLocal(event.point);

      let diff = mesh.position.y - event.point.y;
      // scale width and height by same amount
      panel.scale.x += diff;
      panel.scale.y += diff;

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
