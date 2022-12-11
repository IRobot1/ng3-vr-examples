import { Component, EventEmitter, Input } from "@angular/core";

import { Group } from "three";
import { NgtObjectProps } from "@angular-three/core";

import { InteractiveObjects } from "ng3-flat-ui";

import { BaseCommand, HorizontalCommand, LineToCommand, MoveToCommand, VerticalCommand } from "../path-util";

@Component({
  selector: 'path-command-item',
  exportAs: 'pathCommandItem',
  templateUrl: './command-item.component.html',
})
export class PathCommandItem extends NgtObjectProps<Group> {
  @Input() command!: BaseCommand;
  @Input() selectable?: InteractiveObjects;

  @Input() selected = new EventEmitter<void>();

  get moveto(): MoveToCommand { return this.command as MoveToCommand }
  get lineto(): LineToCommand { return this.command as LineToCommand }
  get vertical(): VerticalCommand { return this.command as VerticalCommand }
  get horizontal(): HorizontalCommand { return this.command as HorizontalCommand }

}
