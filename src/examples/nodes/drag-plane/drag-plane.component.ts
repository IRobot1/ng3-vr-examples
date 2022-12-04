import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from "@angular/core";

import { CanvasTexture, Intersection, Mesh, MeshBasicMaterial, RepeatWrapping, sRGBEncoding, Vector2 } from "three";
import { NgtObjectProps } from "@angular-three/core";

import { InteractiveObjects } from "ng3-flat-ui";

@Component({
  selector: 'flat-ui-drag-plane',
  exportAs: 'flatUIDragPlane',
  templateUrl: './drag-plane.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FlatUIDragPlane extends NgtObjectProps<Mesh> {
  @Input() selectable!: InteractiveObjects;
  @Input() size = 10;

  @Output() dragstart = new EventEmitter<Intersection>();
  @Output() dragend = new EventEmitter<Intersection>();
  @Output() change = new EventEmitter<Intersection>();

  meshready(mesh: Mesh) {
    if (!this.selectable) {
      console.warn('selectable @Input() not set for drag plane');
      return;
    }
    this.selectable.add(mesh);

    mesh.addEventListener('pointerdown', (e: any) => { this.startdrag(e.data); })
    mesh.addEventListener('pointerup', (e: any) => { this.enddrag(e.data); })
    mesh.addEventListener('pointermove', (e: any) => { this.planehit(e.data); })

    this.createMaterial(mesh);
  }

  protected startdrag(event: Intersection) {
    this.dragstart.next(event);
  }

  protected enddrag(event: Intersection) {
    this.dragend.next(event);
  }

  planehit(event: Intersection) {
    this.change.next(event);
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

    mesh.material = new MeshBasicMaterial({ map: texture, transparent: true });

  }
}
