import { make, NgtVector2 } from "@angular-three/core";
import { Object3D, Vector2, Vector3 } from "three";

import { HEIGHT_CHANGED_EVENT, LAYOUT_EVENT, WIDTH_CHANGED_EVENT } from "./flat-ui-utils";


interface ObjectSizeData {
  object: Object3D,
  width: number,
  height: number,
}

export abstract class Layout {
  protected updateFlag = true;

  margin : NgtVector2 = 0;

  constructor(private group: Object3D) { }

  protected reflow(group: Object3D) { }
  protected listen(group: Object3D) { }

  protected changed = (event: any) => {
    this.updateFlag = true;
  }

  public update() {
    if (this.updateFlag) {
      this.updateFlag = false;
      this.reflow(this.group);
    }
  }

  protected getSizes(children: Array<Object3D>): Array<ObjectSizeData> {
    const sizes: Array<ObjectSizeData> = [];

    const event = { type: LAYOUT_EVENT, width: 0, height: 0, updated: false };
    children.forEach(child => {
        if (!child.visible && !child.userData['layout']) return;

      if (child.type == 'Group') {
        const x = this.getSizes(child.children);
        let width = 0
        let height = 0;
        x.forEach(item => {
          if (item.width > width) width = item.width;
          if (item.height > height) height = item.height;
        });
        sizes.push({ object: child, width: width, height: height })
      }
      else {
        if (child.type != 'Mesh') return;

        event.width = event.height = 0;
        event.updated = false;
        child.dispatchEvent(event);

        if (event.updated || (event.width != 0 && event.height != 0))
          sizes.push({ object: child, width: event.width, height: event.height })
      }
    })
    return sizes
  }
}

export class HorizontalLayout extends Layout {

  constructor(group: Object3D) {
    super(group);
  }

  override reflow(group: Object3D) {
    const sizes = this.getSizes(group.children);

    let marginleft = this.margin as number;
    let marginright = this.margin as number;

    if (Array.isArray(this.margin)) {
      const margin = make(Vector2,this.margin);
      marginleft = margin.x;
      marginright = margin.y;
    }

    let x = 0;
    sizes.forEach(item => {
      item.object.position.x = x + item.width / 2 + marginleft;

      x += item.width + marginleft + marginright;  // move left based on width of this item
    });
  }

  override listen(group: Object3D) {
    // listen for height changes on any meshes
    group.traverse(child => {
      if (child.type != 'Mesh') return;

      if (!child.hasEventListener(WIDTH_CHANGED_EVENT, this.changed)) {
        child.addEventListener(WIDTH_CHANGED_EVENT, this.changed);
        this.updateFlag = true;
      }
    })
  }
}

export class VerticalLayout extends Layout {

  constructor(group: Object3D) {
    super(group);
  }

  override reflow(group: Object3D) {
    const sizes = this.getSizes(group.children);

    let margintop = this.margin as number;
    let marginbottom = this.margin as number;

    if (Array.isArray(this.margin)) {
      const margin = make(Vector2,this.margin);
      margintop = margin.x;
      marginbottom = margin.y;
    }

    let y = 0;
    sizes.forEach(item => {
      item.object.position.y = y - item.height / 2 - margintop;

      y -= item.height + margintop + marginbottom;  // move down based on height of this item
    });

    group.dispatchEvent({ type: HEIGHT_CHANGED_EVENT, height: Math.abs(y) });
  }

  override listen(group: Object3D) {
    // listen for height changes on any meshes
    group.traverse(child => {
      if (child.type != 'Mesh') return;

      if (!child.hasEventListener(HEIGHT_CHANGED_EVENT, this.changed)) {
        child.addEventListener(HEIGHT_CHANGED_EVENT, this.changed);
        this.updateFlag = true;
      }
    })
  }
}
