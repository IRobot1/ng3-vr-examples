import { Component, Input } from "@angular/core";

import { Group } from "three";
import { NgtObjectProps } from "@angular-three/core";

import { InteractiveObjects, Paging } from "ng3-flat-ui";

import { BaseCommand } from "../path-util";

@Component({
  selector: 'path-command-list',
  exportAs: 'pathCommandList',
  templateUrl: './command-list.component.html',
})
export class PathCommandList extends NgtObjectProps<Group> implements Paging {
  @Input() commands: Array<BaseCommand> = [];
  @Input() rowcount = 6;

  @Input() selectable? :InteractiveObjects;

  protected group!: Group;

  private firstdrawindex = 0;

  private refresh() {

  }

  get firstindex(): number { return this.firstdrawindex }
  get length(): number { return this.commands.length }
  get pagesize(): number { return this.rowcount }

  movefirst() {
    if (this.firstdrawindex) {
      this.firstdrawindex = 0;
      this.refresh();
    }
  }

  moveprevious() {
    if (this.firstdrawindex) {
      this.firstdrawindex--;
      this.refresh();
    }
  }

  movenext() {
    if (this.commands.length > this.rowcount && this.firstdrawindex < this.commands.length - this.rowcount) {
      this.firstdrawindex++;
      this.refresh();
    }
  }

  movelast() {
    const index = Math.max(this.commands.length - this.rowcount, 0);
    if (index != this.firstdrawindex) {
      this.firstdrawindex = index;
      this.refresh();
    }
  }
}
