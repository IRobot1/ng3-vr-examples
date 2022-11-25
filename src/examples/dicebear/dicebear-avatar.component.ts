import { EventEmitter, Component, Input, Output, ChangeDetectionStrategy } from "@angular/core";

import { BufferGeometry, Color, ExtrudeGeometry, Group, Mesh, MeshStandardMaterial, ShapeGeometry } from "three";
import { NgtObjectProps } from "@angular-three/core";

import { SVGLoader, SVGResult } from "three-stdlib";



@Component({
  selector: 'dicebear-avatar',
  exportAs: 'diceBearAvatar',
  template: '<ngt-group #inst (ready)="group=inst.instance.value" [position]="position" [scale]="scale" [rotation]="rotation"></ngt-group>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DiceBearAvatarComponent extends NgtObjectProps<Group> {
  @Input() size = 1;
  @Input() zdisplacement = 0.1;

  @Input() set svg(text: string) {
    this.loaded = false;
    if (text) {
      setTimeout(() => {
        const cleantext = text
          .replace(`mask="url(#avatarsRadiusMask)"`, '')
          .replace(`<mask id="avatarsRadiusMask">`, '')
          .replace(`<rect width="${this.size}" height="${this.size}" rx="0" ry="0" x="0" y="0" fill="#fff"/>`, '')
          .replace(`</mask>`, '')
        this.process(this.loader.parse(cleantext));
        this.loaded = true;
      }, 0);
    }
  }

  @Output() changed = new EventEmitter<Group>();

  group!: Group;
  loaded = false;

  private loader = new SVGLoader();


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

    const colors = new Map<Color, MeshStandardMaterial>([]);
    geometries.forEach((item, index) => {
      let material = colors.get(item.color);
      if (!material) {
        material = new MeshStandardMaterial({ color: item.color });
        colors.set(item.color, material);
      }

      const mesh = new Mesh(item.geometry, material);
      mesh.position.z += this.zdisplacement * index;
      mesh.rotation.x = 3.14;
      this.group.add(mesh);
    });
    this.group.scale.setScalar(1 / this.size);

    this.changed.next(this.group);
  }
}
