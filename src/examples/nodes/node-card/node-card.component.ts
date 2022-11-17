import { AfterViewInit, ChangeDetectionStrategy, Component, Input, ViewChild } from "@angular/core";

import { Group, Object3D, Vector3 } from "three";
import { NgtObjectProps } from "@angular-three/core";

import { DRAG_END_EVENT, FlatUICard, FlatUIDragPanel, HEIGHT_CHANGED_EVENT, InteractiveObjects, WIDTH_CHANGED_EVENT } from "ng3-flat-ui";

import { NodePin } from "../node-pin/node-pin.component";


export interface NodeCard {
  title: string;
  inputs: Array<NodePin>;
  outputs: Array<NodePin>;
  width: number;
  height: number;
}

export const PIN_MOVED_EVENT = 'node-pin-moved';
export interface NodePinEvent {
  type: string;
  position: Vector3;
  link: string;
  isinput: boolean;
}

interface NodePinData extends NodePin {
  object?: Object3D;
}

@Component({
  selector: 'flat-ui-node-card',
  exportAs: 'flatUINodeCard',
  templateUrl: './node-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FlatUINodeCard extends NgtObjectProps<Group> implements NodeCard, AfterViewInit {
  @Input() title = 'node';
  @Input() width = 1;
  @Input() height = 1;

  @Input() preview = false;
  @Input() inputexec = false;
  @Input() outputexec = false;

  previewwidth = 0.4;
  previewheight = 0.4;


  private _inputs: Array<NodePinData> = [];
  @Input()
  get inputs(): Array<NodePin> { return this._inputs }
  set inputs(newvalue: Array<NodePin>) {
    this._inputs = newvalue.sort((a, b) => a.seqnum - b.seqnum);
  }
  get internalinputs(): Array<NodePinData> { return this._inputs };

  private _outputs: Array<NodePinData> = [];
  @Input()
  get outputs(): Array<NodePin> { return this._outputs }
  set outputs(newvalue: Array<NodePin>) {
    this._outputs = newvalue.sort((a, b) => a.seqnum - b.seqnum);
  }
  get internaloutputs(): Array<NodePinData> { return this._outputs }

  @Input() selectable?: InteractiveObjects;

  @ViewChild(FlatUIDragPanel) panel!: FlatUIDragPanel;

  card!: Group;

  panelready(card: Group) {
    card.addEventListener(DRAG_END_EVENT, () => {
      this.notify(this.internalinputs, true, this.panel.panel.position);
      this.notify(this.internaloutputs, false, this.panel.panel.position);
    });

    card.addEventListener(WIDTH_CHANGED_EVENT, () => {
      this.notify(this.internalinputs, true, this.panel.panel.position);
      this.notify(this.internaloutputs, false, this.panel.panel.position);
    })
    this.card = card;
    this.ready.next(card);
  }
  private notify(newvalue: Array<NodePinData>, isinput: boolean, cardposition: Vector3) {
    newvalue.forEach(item => {
      if (!item.object?.position) return;
      const position = item.object.position.clone().add(cardposition);

      const event: NodePinEvent = { type: PIN_MOVED_EVENT, position: position, link: item.link, isinput: isinput }
      this.card.dispatchEvent(event);
    });
  }

  ngAfterViewInit(): void {

    this.notify(this.internalinputs, true, this.card.position);
    this.notify(this.internaloutputs, false, this.card.position);
  }

  addinput(input: NodePin): number {
    const seqnum = this.inputs.push(input);
    if (input.seqnum <= 0) input.seqnum = seqnum;
    return seqnum;
  }

  removeinput(input: NodePin) {
    this.inputs = this.inputs.filter(item => item != input);
  }

  addoutput(output: NodePin): number {
    const seqnum = this.outputs.push(output);
    if (output.seqnum <= 0) output.seqnum = seqnum;
    return seqnum;
  }

  removeoutput(output: NodePin) {
    this.outputs = this.outputs.filter(item => item != output);
  }
}
