import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

import { Group, Intersection, Vector3 } from "three";
import { NgtEvent, NgtObjectProps } from "@angular-three/core";

import { NodeType } from "../node-type/node-type.component";

import { DRAG_END_EVENT, DRAG_MOVE_EVENT, DRAG_START_EVENT, InteractiveObjects } from "ng3-flat-ui";



export interface NodePin {
  seqnum: number;
  type: NodeType;
  name: string;
  value?: any;
  link: string;

  // pin mesh added at runtime
  object?: Group;
}


@Component({
  selector: 'flat-ui-node-pin',
  exportAs: 'flatUINodePin',
  templateUrl: 'node-pin.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlatUINodePin extends NgtObjectProps<Group> implements NodePin {
  @Input() input = true;
  @Input() seqnum = -1;
  @Input() type!: NodeType;
  @Input() value?: any;
  @Input() link = '';

  @Input() selectable?: InteractiveObjects;

  object!: Group;

  //@Output() change = new EventEmitter<NodePin>();

  //
  // dragging
  //
  private isover = false;
  over() {
    if (this.isover) return;

    //this.line.visible = true;
    this.isover = true;
  }
  out() {
    //this.line.visible = false;
    this.isover = false;
  }

  protected startdragging() {
    this.dragging = true;
    this.over();
    this.object.dispatchEvent({ type: DRAG_START_EVENT })
  }

  protected enddragging() {
    this.dragging = false;
    this.out();
    this.object.dispatchEvent({ type: DRAG_END_EVENT })
  }

  protected pinready(pin: Group) {
    this.selectable?.add(pin);

    pin.addEventListener('pointerdown', (e: any) => {
      this.startdragging();
    });

    const dragend = (e: any) => {
      this.enddragging();
      e.stop = true;
    };

    pin.addEventListener('pointerup', dragend);
    pin.addEventListener('pointerout', dragend);
    pin.addEventListener('raymissed', dragend);

    pin.addEventListener('pointermove', (e: any) => { this.over(); e.stop = true; });

    this.object = pin;
    this.ready.next(pin);
  }

  protected dragging = false;

  protected movepin(event: NgtEvent<PointerEvent>) {
    event.stopPropagation();

    this.domovepin(event);
  }

  private domovepin(event: Intersection) {

    if (this.dragging) {

      const position = new Vector3();
      this.object.getWorldPosition(position);

      this.object.position.x += event.point.x - position.x;
      this.object.position.y += event.point.y - position.y;

      this.object.dispatchEvent({ type: DRAG_MOVE_EVENT })
    }
  }


}
