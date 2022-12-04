import { ChangeDetectionStrategy, Component } from "@angular/core";

import { Intersection } from "three";

import { InteractiveObjects } from "ng3-flat-ui";


@Component({
  templateUrl: './nodes.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NodesExample {
  selectable = new InteractiveObjects();

  private _dragging = false;
  get dragging(): boolean { return this._dragging }
  set dragging(newvalue: boolean) {
    this._dragging = newvalue;
  }

  hit(event: Intersection) {
  //  if (this.dragging)
  //    console.warn(event.point);
  }
}
