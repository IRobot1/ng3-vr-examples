import { NgtRenderState } from "@angular-three/core";
import { Component } from "@angular/core";
import { ConnectedEvent } from "ng3-webxr";
import { Group, MathUtils, Mesh } from "three";
import { InteractiveObjects, ScrollEvent } from "ng3-flat-ui";

@Component({
  templateUrl: './textscroll.component.html',
})
export class TextScrollExample {
  selectable = new InteractiveObjects();

  text = `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`

  value = 0;
    max = 0;

  scroll(event: ScrollEvent) {
    //console.warn(event)
    this.value = event.topY;
    this.max = event.maxY;
  }
}
