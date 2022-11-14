import { ChangeDetectionStrategy, Component, EventEmitter } from "@angular/core";

import { InteractiveObjects } from "ng3-flat-ui";

@Component({
  templateUrl: './nodes.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NodesExample {
  selectable = new InteractiveObjects();
}
