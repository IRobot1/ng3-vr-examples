import { ChangeDetectionStrategy, Component, EventEmitter, OnInit } from "@angular/core";

import { MeshBasicMaterial, Object3D } from "three";
import { NgtTriple } from "@angular-three/core";

import { InteractiveObjects } from "ng3-flat-ui";

import { NodePin } from "./node-pin/node-pin.component";
import { NodeType } from "./node-type/node-type.component";
import { FlatUINodeCard, NodeCard, NodePinEvent, PIN_MOVED_EVENT } from "./node-card/node-card.component";


@Component({
  templateUrl: './nodes.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NodesExample  {
  selectable = new InteractiveObjects();
}
