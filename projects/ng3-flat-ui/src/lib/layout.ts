import { Object3D, Vector3 } from "three";

import { HEIGHT_CHANGED_EVENT, LAYOUT_EVENT, WIDTH_CHANGED_EVENT } from "./flat-ui-utils";


interface ObjectSizeData {
  object: Object3D,
  width: number,
  height: number,
}

export abstract class Layout {
  protected updateFlag = true;

  margin = new Vector3();

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

    let x = 0;
    let margin = this.margin.x;
    sizes.forEach(item => {
      item.object.position.x = x + item.width / 2 + margin;

      x += item.width + margin * 2;  // move left based on width of this item
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

    let y = 0;
    let margin = this.margin.y;
    sizes.forEach(item => {
      item.object.position.y = y - item.height / 2 - margin;

      y -= item.height + margin * 2;  // move down based on height of this item
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
