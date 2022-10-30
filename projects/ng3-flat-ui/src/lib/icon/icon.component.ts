import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from "@angular/core";

import { BufferGeometry, Group, Material, Mesh, ShapeGeometry, Vector3 } from "three";
import { NgtObjectProps } from "@angular-three/core";

import { SVGLoader, SVGResult } from "three-stdlib";

import { BufferGeometryUtils } from "..//BufferGeometryUtils";

import { GlobalFlatUITheme } from "../flat-ui-theme";
import { LAYOUT_EVENT } from "../flat-ui-utils";


@Component({
  selector: 'flat-ui-icon',
  exportAs: 'flatUIIcon',
  templateUrl: './icon.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FlatUIIcon extends NgtObjectProps<Mesh> implements AfterViewInit {
  @Input()  set url(newvalue: string | undefined) {
    if (newvalue) {
      this.load(newvalue);
    }
  }

  @Input() set svg(text: string | undefined) {
    if (text) {
      this.zone.run(() => {
        this.process(this.loader.parse(text));
      })
    }
  }


  @Input() width = 0.1;

  private _iconmaterial!: Material
  @Input()
  get iconmaterial(): Material {
    if (this._iconmaterial) return this._iconmaterial;
    return GlobalFlatUITheme.IconMaterial;
  }
  set iconmaterial(newvalue: Material) {
    this._iconmaterial = newvalue;
  }


  protected icongeometry!: BufferGeometry;

  protected svgscale!: Vector3;

  constructor(private cd: ChangeDetectorRef) { super() }

  ngAfterViewInit(): void {
    this.mesh.addEventListener(LAYOUT_EVENT, (e: any) => {
      e.width = this.width;
      e.height = this.width;
      e.updated = true;
    });
  }

  protected mesh!: Mesh;

  private group = new Group();
  private loader = new SVGLoader();


  private load(url: string): void {
    this.loader.load(url, (data: SVGResult) => {
      this.process(data);
      this.cd.detectChanges(); // force change detection to render icon
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

      this.icongeometry = geometry;
    }
  }

}
