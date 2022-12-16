import { ChangeDetectionStrategy, Component, ContentChild, EventEmitter, Input, Output, TemplateRef } from "@angular/core";

import { CanvasTexture, Intersection, Material, Mesh, MeshBasicMaterial, RepeatWrapping, sRGBEncoding, Vector2, Vector3 } from "three";
import { NgtEvent, NgtObjectProps } from "@angular-three/core";

import { GlobalFlatUITheme, InteractiveObjects } from "ng3-flat-ui";

interface AxisText {
  text: string,
  position: Vector3,
}

@Component({
  selector: 'flat-ui-drag-plane',
  exportAs: 'flatUIDragPlane',
  templateUrl: './drag-plane.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FlatUIDragPlane extends NgtObjectProps<Mesh> {
  @Input() selectable!: InteractiveObjects;

  private _fontsize = 0.07;
  @Input()
  get fontsize(): number { return this._fontsize }
  set fontsize(newvalue: number) {
    this._fontsize = newvalue;
    this.updateaxistext();
  }

  private _size = 10;
  @Input()
  get size(): number { return this._size }
  set size(newvalue: number) {
    this._size = newvalue;
    this.updateaxistext();
  }

  private _showgrid = true;
  @Input()
  get showgrid(): boolean { return this._showgrid }
  set showgrid(newvalue: boolean) {
    this._showgrid = newvalue;
    if (!this.mesh) return;
    this.updatematerial();
  }

  axisdata: Array<AxisText> = [];
  updateaxistext() {
    this.axisdata.length = 0;

    const half = this.size / 2
    for (let x = -half + 1; x < half; x++) {
      this.axisdata.push({ text: x.toString(), position: new Vector3(x, this.fontsize / 2, 0.001) });
    }
    for (let y = -half + 1; y < half; y++) {
      if (y)
        this.axisdata.push({ text: y.toString(), position: new Vector3(0, y + this.fontsize / 2, 0.001) });
    }
    this.axis = this.axisdata;
  }

  axis: Array<AxisText> = [];

  private _labelmaterial!: Material
  @Input()
  get labelmaterial(): Material {
    if (this._labelmaterial) return this._labelmaterial;
    return GlobalFlatUITheme.LabelMaterial;
  }
  set labelmaterial(newvalue: Material) {
    this._labelmaterial = newvalue;
  }



  @Output() dragstart = new EventEmitter<Intersection>();
  @Output() dragend = new EventEmitter<Intersection>();
  @Output() change = new EventEmitter<Intersection>();

  @ContentChild(TemplateRef) templateRef?: TemplateRef<unknown>;

  override ngOnInit() {
    super.ngOnInit();
    this.updateaxistext();
  }

  private mesh!: Mesh;
  meshready(mesh: Mesh) {
    if (!this.selectable) {
      console.warn('selectable @Input() not set for drag plane');
      return;
    }
    this.selectable.add(mesh);

    mesh.addEventListener('pointerdown', (e: any) => { this.startdrag(e.data); })
    mesh.addEventListener('pointerup', (e: any) => { this.enddrag(e.data); })
    mesh.addEventListener('pointermove', (e: any) => { this.move(e.data, mesh); })

    this.mesh = mesh;
    this.createMaterial(mesh);
  }

  protected startdrag(event: Intersection) {
    this.dragstart.next(event);
  }

  protected enddrag(event: Intersection) {
    this.dragend.next(event);
  }

  protected move(event: NgtEvent<PointerEvent>, mesh: Mesh) {
    if (event.object == mesh)
      this.change.next(event);
  }

  private gridmaterial!: MeshBasicMaterial;
  private planematerial!: MeshBasicMaterial;

  private updatematerial() {

    this.mesh.material = this.showgrid ? this.gridmaterial : this.planematerial;

  }

  private createMaterial(mesh: Mesh) {
    const size = 400;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;

    const context = canvas.getContext('2d');
    if (!context) return;

    context.strokeStyle = 'black'
    for (let x = 0; x < 10; x++) {
      context.beginPath();
      context.moveTo(x * size / 10, 0);
      context.lineTo(x * size / 10, size);
      context.stroke();
      context.strokeStyle = 'white'
    }

    context.strokeStyle = 'black'
    for (let y = 0; y < 10; y++) {
      context.beginPath();
      context.moveTo(0, y * size / 10);
      context.lineTo(size, y * size / 10);
      context.stroke();
      context.strokeStyle = 'white'
    }

    const texture = new CanvasTexture(canvas)
    texture.encoding = sRGBEncoding;
    texture.wrapS = RepeatWrapping;
    texture.wrapT = RepeatWrapping;
    texture.repeat = new Vector2(this.size, this.size)

    this.gridmaterial = new MeshBasicMaterial({ map: texture, transparent: true });
    this.planematerial = new MeshBasicMaterial({ transparent: true, opacity: 0 });

    this.updatematerial();
  }

  doclick(event: NgtEvent<MouseEvent>, mesh: Mesh) {
    if (event.object == mesh)
      this.click.next(event);
  }
}
