import { Component, EventEmitter, Input, Output } from "@angular/core";

import { BufferGeometry, DoubleSide, Group, Material, Mesh, MeshBasicMaterial, Object3D, Shape, ShapeGeometry, Side, Vector3 } from "three";
import { NgtEvent, NgtObjectProps } from "@angular-three/core";

import { SVGLoader, SVGResult } from "three-stdlib";

import { BufferGeometryUtils } from "../../svg/BufferGeometryUtils";

import { ButtonColor, ClickColor, HoverColor, IconColor, roundedRect } from "../flat-ui-utils";
import { InteractiveObjects } from "../interactive-objects";


@Component({
  selector: 'flat-ui-icon-button',
  exportAs: 'flatUIIconButton',
  templateUrl: './icon-button.component.html',
})
export class FlatUIIconButton extends NgtObjectProps<Mesh>{
  @Input() enabled = true;

  @Input() width = 0.1;

  @Input() buttoncolor = ButtonColor;
  @Input() hovercolor = HoverColor;
  @Input() clickcolor = ClickColor;
  @Input() iconcolor = IconColor;


  @Input() svggeometry!: BufferGeometry;

  @Input() selectable?: InteractiveObjects;

  @Output() pressed = new EventEmitter<boolean>();

  geometry!: BufferGeometry;
  material!: MeshBasicMaterial;

  side: Side = DoubleSide;
  svgscale!: Vector3;

  override preInit() {
    super.preInit();

    if (!this.geometry) {
      const flat = new Shape();
      roundedRect(flat, 0, 0, this.width, 0.1, 0.02);

      this.geometry = new ShapeGeometry(flat);
      this.geometry.center();
    }
    if (!this.material) {
      this.material = new MeshBasicMaterial({ color: this.buttoncolor, side: DoubleSide, opacity: 0.5, transparent: true });
    }
  }

  override ngOnDestroy() {
    super.ngOnDestroy();

    this.selectable?.remove(this.mesh);

    this.geometry.dispose();
    this.material.dispose();
  }


  private mesh!: Mesh;

  meshready(mesh: Mesh) {
    this.selectable?.add(mesh);

    mesh.addEventListener('click', () => { this.doclick() })
    mesh.addEventListener('pointermove', () => { this.over() });
    mesh.addEventListener('pointerout', () => { this.out() });

    this.mesh = mesh;
  }


  clicked(mesh: Mesh, event: NgtEvent<MouseEvent>) {
    if (event.object != mesh) return;
    event.stopPropagation();

    this.doclick();
  }

  clicking = false;
  private doclick() {
    if (!this.enabled || !this.visible) return;

    this.material.color.setStyle(this.clickcolor);
    this.clicking = true;

    const timer = setTimeout(() => {
      if (this.isover)
        this.material.color.setStyle(this.hovercolor);
      else
        this.material.color.setStyle(this.buttoncolor);

      this.pressed.emit(true);

      clearTimeout(timer);
      this.clicking = false;
    }, 100);
  }

  isover = false;
  over() {
    if (this.clicking || this.isover || !this.enabled) return;
    this.material.color.setStyle(this.hovercolor);
    this.isover = true;
  }
  out() {
    this.material.color.setStyle(this.buttoncolor);
    this.isover = false;
  }

  private _url!: string;
  @Input()
  get url(): string { return this._url }
  set url(newvalue: string) {
    this._url = newvalue;
    if (newvalue) {
      this.loaded = false;
      this.load();
    }
  }
  @Input() set svg(text: string) {
    this.loaded = false;
    if (text) {
      setTimeout(() => {
        this.process(this.loader.parse(text));
        this.loaded = true;
      }, 0);
    }
  }

  loaded = false;

  private group = new Group();
  private loader = new SVGLoader();


  private load(): void {
    this.loader.load(this._url, (data: SVGResult) => {
      this.process(data);
      this.loaded = true;
    });
  }

  private process(data: SVGResult) {
    const paths = data.paths;

    // cleanup last loaded group of mesh geometries
    this.group.children.forEach(child => {
      (child as Mesh).geometry.dispose();
      this.group.remove(child);
    });
    this.group.children.length = 0;

    const geometries: Array<BufferGeometry> = [];

    for (let i = 0; i < paths.length; i++) {

      const path = paths[i];


      const shapes = SVGLoader.createShapes(path);

      for (let j = 0; j < shapes.length; j++) {
        const shape = shapes[j];
        geometries.push(new ShapeGeometry(shape));

      }
    }

    const geometry = BufferGeometryUtils.mergeBufferGeometries(geometries);
    if (geometry) {
      geometry.center();

      const size = new Vector3();
      geometry.boundingBox?.getSize(size);
      size.z = 1;
      this.svgscale = new Vector3(this.width * 0.8, -this.width * 0.8, 1).divide(size);

      this.svggeometry = geometry;
    }
  }

}
