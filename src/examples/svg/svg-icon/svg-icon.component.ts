import { EventEmitter, Component, Input, Output } from "@angular/core";

import { BufferGeometry, Color, ExtrudeGeometry, Group, Mesh, MeshStandardMaterial, ShapeGeometry } from "three";
import { NgtObjectProps } from "@angular-three/core";

import { SVGLoader, SVGResult } from "three-stdlib";

import { BufferGeometryUtils } from "../BufferGeometryUtils";


@Component({
  selector: 'svg-icon',
  exportAs: 'svgIcon',
  template: '<ngt-group #inst (ready)="group=inst.instance.value" [position]="position" [scale]="scale" [rotation]="rotation"></ngt-group>',
})
export class SVGIconComponent extends NgtObjectProps<Group> {
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

  @Input() iconcolor!: string;

  @Output() changed = new EventEmitter<Group>();

  group!: Group;
  loaded = false;

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

    const geometries: Array<{ geometry: BufferGeometry, color: Color }> = [];

    for (let i = 0; i < paths.length; i++) {
      const path = paths[i];
      const shapes = SVGLoader.createShapes(path);

      for (let j = 0; j < shapes.length; j++) {
        const shape = shapes[j];
        geometries.push({ geometry: new ExtrudeGeometry(shape), color: path.color });

      }
    }

    if (this.iconcolor) {
      const geometry = BufferGeometryUtils.mergeBufferGeometries(geometries.map(x => x.geometry));
      if (geometry) {
        geometry.center();

        const material = new MeshStandardMaterial({ color: this.iconcolor });

        const mesh = new Mesh(geometry, material);
        mesh.rotation.x = 3.14;
        this.group.add(mesh);

        this.changed.next(this.group);
      }
    }
    else {
      const colors = new Map<Color, MeshStandardMaterial>([]);
      geometries.forEach((item, index) => {
        let material = colors.get(item.color);
        if (!material) {
          material = new MeshStandardMaterial({ color: item.color });
          colors.set(item.color, material);
        }

        const mesh = new Mesh(item.geometry, material);
        //mesh.position.x += 0.02 * index;
        //mesh.position.y += 0.02 * index;
        mesh.position.z += 0.02 * index;
        //mesh.rotation.x = 3.14;
        this.group.add(mesh);
        console.warn(mesh)
      });

      this.changed.next(this.group);
    }
  }
}
