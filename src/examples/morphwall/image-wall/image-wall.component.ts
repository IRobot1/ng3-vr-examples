import { Component, Input } from "@angular/core";

import { Color, InstancedMesh, Matrix4, Object3D, Vector3 } from "three";
import { NgtObjectProps } from "@angular-three/core";

class WallPixel {
  constructor(public position: Vector3, public color: Color) { }
}

@Component({
  selector: 'image-wall[url]',
  exportAs: 'imageWall',
  templateUrl: './image-wall.component.html',
})
export class ImageWallComponent extends NgtObjectProps<InstancedMesh> {
  private _url!: string;
  @Input()
  get url(): string { return this._url }
  set url(newvalue: string) {
    this._url = newvalue;
    if (newvalue) {
      this.loaded = false;
      this.refresh();
    }
  }

  @Input() size = 0.01;
  @Input() gap = 0;

  @Input() selectable!: Array<Object3D>;

  width!: number;
  height!: number;

  data!: Array<WallPixel>;
  loaded = false;

  private refresh(): void {
    var img = new Image();
    img.src = this.url;
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) return;

    img.onload = (next: any) => {
      const width = next.path[0].width;
      const height = next.path[0].height;

      canvas.width = width;
      canvas.height = height;

      context.drawImage(img, 0, 0, width, height);
      const image = context.getImageData(0, 0, width, height);

      const length = width * height;
      if (!this.data || this.data.length != length) {
        this.data = new Array(width * height).fill(0).map((d, index) => ({
          position: new Vector3(),
          color: new Color()
        }));
      }
      console.log(width, height, image, this.data.length);

      const interval = this.size + this.gap;

      let index = 0;
      let dataindex = 0;
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const color = this.data[index].color;
          const r = image.data[dataindex];
          const g = image.data[dataindex + 1];
          const b = image.data[dataindex + 2];
          color.setStyle(`rgb(${r}, ${g}, ${b}, 255)`)

          const p = this.data[index].position;
          p.x = x * interval;
          p.y = -y * interval;

          dataindex += 4;
          index++;
        }
      }
      this.position = [-width * interval / 2, height * interval / 2, 0];
      this.width = width;
      this.height = height;
      this.loaded = true;
    }

  }

  inst!: InstancedMesh;
  protected wallready(inst: InstancedMesh) {
    this.inst = inst;
    this.selectable?.push(inst);

    this.data.forEach((item, index) => {
      const matrix = new Matrix4();
      matrix.setPosition(item.position);
      //matrix.scale(item.scale);
      inst.setMatrixAt(index, matrix);
      inst.setColorAt(index, item.color);
    })
  }
}
