import { EventEmitter, Component, Input, Output } from "@angular/core";

import { BufferGeometry, ExtrudeGeometry, Group, Mesh, MeshStandardMaterial } from "three";
import { NgtObjectProps } from "@angular-three/core";

import { SVGLoader, SVGResult } from "three-stdlib";

import { mergeBufferGeometries } from "../BufferGeometryUtils";


@Component({
  selector: 'svg-icon',
  exportAs: 'svgIcon',
  template: '<ngt-group #inst (ready)="group=inst.instance.value" [position]="position" [scale]="scale" [rotation]="[3.14, 0, 0]"></ngt-group>',
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
    setTimeout(() => {
      this.process(this.loader.parse(text));
      this.loaded = true;
    }, 0);
  }

  @Input() iconcolor = 'white';

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

    const geometries: Array<BufferGeometry> = [];

    for (let i = 0; i < paths.length; i++) {

      const path = paths[i];


      const shapes = SVGLoader.createShapes(path);

      for (let j = 0; j < shapes.length; j++) {
        const shape = shapes[j];
        geometries.push(new ExtrudeGeometry(shape));

      }
    }

    const geometry = mergeBufferGeometries(geometries);
    geometry.center();

    const material = new MeshStandardMaterial({ color: this.iconcolor });

    const mesh = new Mesh(geometry, material);
    this.group.add(mesh);

    this.changed.next(this.group);
  }
}
