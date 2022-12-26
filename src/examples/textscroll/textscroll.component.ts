import { NgtRenderState } from "@angular-three/core";
import { Component } from "@angular/core";
import { ConnectedEvent } from "ng3-webxr";
import { Group, MathUtils, Mesh } from "three";
import { ScrollEvent } from "ng3-flat-ui";

@Component({
  templateUrl: './textscroll.component.html',
})
export class TextScrollExample {
  text = `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`

  value = 0;
    max = 0;

  scroll(event: ScrollEvent) {
    //console.warn(event)
    this.value = event.topY;
    this.max = event.maxY;
  }


  mesh!: Mesh;
  controller!: Group;

  indicator!: Mesh;

  connected(event: ConnectedEvent | undefined) {
    if (!event) return;
    console.warn(this.interval)
    this.controller = event.controller;
  }

  interval = MathUtils.degToRad(5);

  tick(state: NgtRenderState) {
    if (!this.controller) return;

    // We'll get the rotation of the VR controller
    const rotation = this.controller.rotation;

    // We'll use the rotation to calculate the amount to scroll the pages
    const scrollAmount = Math.round(rotation.z / this.interval) * this.interval;
    this.text = scrollAmount.toFixed(2);

    this.mesh.position.y += scrollAmount * 0.002;

    this.indicator.rotation.z = rotation.z;
  }
}
