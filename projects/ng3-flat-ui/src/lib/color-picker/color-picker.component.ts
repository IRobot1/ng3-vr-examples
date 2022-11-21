import { Component, EventEmitter, Input, Output } from "@angular/core";

import { BufferGeometry, CanvasTexture, Intersection, Material, MathUtils, Mesh, MeshBasicMaterial, Shape, ShapeGeometry, sRGBEncoding } from "three";
import { NgtEvent, NgtObjectProps } from "@angular-three/core";

import { GlobalFlatUITheme } from "../flat-ui-theme";

import { InteractiveObjects } from "../interactive-objects";
import { roundedRect } from "../flat-ui-utils";
import { NgtMesh } from "@angular-three/core/meshes";
import { NgtPlaneGeometry, NgtRingGeometry } from "@angular-three/core/geometries";
import { NgtMeshBasicMaterial } from "@angular-three/core/materials";


//
// adapted from https://github.com/NikLever/CanvasUI/blob/dev/examples/jsm/CanvasColorPicker.js
//

@Component({
  selector: 'flat-ui-color-picker',
  exportAs: 'flatUIColorPicker',
  templateUrl: './color-picker.component.html',
  standalone: true,
  imports: [
    NgtMesh,
    NgtPlaneGeometry,
    NgtRingGeometry,
    NgtMeshBasicMaterial,
  ]
})
export class FlatUIColorPicker extends NgtObjectProps<Mesh> {
  @Input() colorvalue = '#ff0000';

  private _popupmaterial!: Material
  @Input()
  get popupmaterial(): Material {
    if (this._popupmaterial) return this._popupmaterial;
    return GlobalFlatUITheme.PopupMaterial;
  }
  set popupmaterial(newvalue: Material) {
    this._popupmaterial = newvalue;
  }

  @Input() selectable?: InteractiveObjects;

  @Input() geometry!: BufferGeometry;

  @Output() colorpicked = new EventEmitter<string>();
  @Output() close = new EventEmitter<void>();

  protected picker!: MeshBasicMaterial;
  protected rainbow!: MeshBasicMaterial;

  protected shadesize = 0.7;

  override ngOnInit(): void {
    super.ngOnInit();

    this.initpicker(this.colorvalue);
    this.initrainbow();

    if (!this.geometry) this.createColorPickerGeometry();
  }

  createColorPickerGeometry() {
    const colorpickerwidth = 1;
    const colorpickerheight = 0.8;

    const flat = new Shape();
    roundedRect(flat, 0, 0, colorpickerwidth, colorpickerheight, 0.02);

    this.geometry = new ShapeGeometry(flat);
    this.geometry.center();
  }

  private pickercontext!: CanvasRenderingContext2D;

  private initpicker(color: string): void {
    const canvas = document.createElement('canvas');
    canvas.width = 100;
    canvas.height = 100;

    const options: CanvasRenderingContext2DSettings = { willReadFrequently: true }
    const context = canvas.getContext('2d', options);
    if (!context) return;

    const white = context.createLinearGradient(0, 0, 100, 0);
    white.addColorStop(0, 'rgba(255,255,255,1)');
    white.addColorStop(1, 'rgba(255,255,255,0)');

    const black = context.createLinearGradient(0, 0, 0, 100);
    black.addColorStop(0, 'rgba(0,0,0,0)');
    black.addColorStop(1, 'rgba(0,0,0,1)');

    context.fillStyle = color;
    context.fillRect(0, 0, 100, 100);

    context.fillStyle = white;
    context.fillRect(0, 0, 100, 100);

    context.fillStyle = black;
    context.fillRect(0, 0, 100, 100);

    const texture = new CanvasTexture(canvas)
    texture.encoding = sRGBEncoding;

    this.picker = new MeshBasicMaterial({ map: texture });
    this.pickercontext = context;
  }

  private rainbowcontext!: CanvasRenderingContext2D;

  private initrainbow(): void {
    const canvas = document.createElement('canvas');
    canvas.width = 10;
    canvas.height = 100;

    const options: CanvasRenderingContext2DSettings = { willReadFrequently: true }
    const context = canvas.getContext('2d', options);
    if (!context) return;


    const gradient = context.createLinearGradient(0, 0, 0, 100);
    gradient.addColorStop(0.05, 'rgba(255, 0, 0, 1)');
    gradient.addColorStop(0.17, 'rgba(255, 255, 0, 1)');
    gradient.addColorStop(0.34, 'rgba(0, 255, 0, 1)');
    gradient.addColorStop(0.51, 'rgba(0, 255, 255, 1)');
    gradient.addColorStop(0.68, 'rgba(0, 0, 255, 1)');
    gradient.addColorStop(0.85, 'rgba(255, 0, 255, 1)');
    gradient.addColorStop(0.95, 'rgba(255, 0, 0, 1)');


    context.fillStyle = gradient;
    context.fillRect(0, 0, 10, 100);

    const texture = new CanvasTexture(canvas)
    texture.encoding = sRGBEncoding;

    this.rainbow = new MeshBasicMaterial({ map: texture });

    this.rainbowcontext = context;
  }

  override ngOnDestroy() {
    super.ngOnDestroy();

    this.selectable?.remove(this.shademesh);
    this.selectable?.remove(this.colormesh);

    this.rainbow.dispose();
    this.picker.dispose();
  }

  meshready(mesh: Mesh) {
    mesh.addEventListener('click', (e: any) => { e.stop = true; });
    mesh.addEventListener('raymissed', (e: any) => { this.missed(); e.stop = true; });
  }

  protected missed() {
    this.close.next()
  }

  protected ignore(mesh: Mesh, event: NgtEvent<MouseEvent>) {
    if (event.object != mesh) return;
    event.stopPropagation();
  }

  private shademesh!: Mesh;

  protected shadesready(mesh: Mesh) {
    this.selectable?.add(mesh);

    // e: {type: 'click', data: Intersection, target: Mesh}
    mesh.addEventListener('click', (e: any) => { this.dopickshade(e.data); e.stop = true; });
    mesh.addEventListener('raymissed', (e: any) => { this.missed(); e.stop = true; });

    this.shademesh = mesh;
  }

  protected ringx = 0;
  protected ringy = 0;

  pickshade(mesh: Mesh, event: NgtEvent<MouseEvent>) {
    if (event.object != mesh) return;

    event.stopPropagation();

    if (event.uv) this.dopickshade(event)

  }

  private dopickshade(event: Intersection) {
    if (!event.uv) return;

    const x = event.uv.x * 100;
    const y = (1 - event.uv.y) * 100;

    const imageData = this.pickercontext.getImageData(x, y, 1, 1).data;

    this.colorvalue = this.getStyleColor(imageData[0], imageData[1], imageData[2]);
    this.colorpicked.next(this.colorvalue);


    this.ringx = MathUtils.mapLinear(event.uv.x, 0, 1, -this.shadesize / 2, this.shadesize / 2);
    this.ringy = MathUtils.mapLinear(1 - event.uv.y, 0, 1, this.shadesize / 2, -this.shadesize / 2);
  }

  private colormesh!: Mesh;

  protected colorready(mesh: Mesh) {
    this.selectable?.add(mesh);

    // e: {type: 'click', data: Vector2, target: Mesh}
    mesh.addEventListener('click', (e: any) => { this.dopickcolor(e.data) })
    mesh.addEventListener('raymissed', () => { this.missed() });

    this.colormesh = mesh;
  }

  pickcolor(mesh: Mesh, event: NgtEvent<MouseEvent>) {
    if (event.object != mesh) return;

    event.stopPropagation();

    if (event.uv) this.dopickcolor(event);
  }

  private dopickcolor(event: Intersection) {
    if (!event.uv) return;

    const x = event.uv.x * 10;
    const y = (1 - event.uv.y) * 100;

    const imageData = this.rainbowcontext.getImageData(x, y, 1, 1).data;

    this.initpicker(this.getStyleColor(imageData[0], imageData[1], imageData[2]));
  }

  private getStyleColor(r: number, g: number, b: number) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }
}
