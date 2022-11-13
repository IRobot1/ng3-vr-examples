import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";

import { InteractiveObjects } from "ng3-flat-ui";

@Component({
  templateUrl: './actions.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActionsExample implements OnInit {
  selectable = new InteractiveObjects();
  isover = false;
  delay = 0;
  timer: any;

  ngOnInit(): void {
    this.timer = setInterval(() => {
      if (this.delay > 0) {
        this.delay--;
        if (!this.delay)
          this.isover = false;
      }
    }, 1000);
  }

  show() {
    this.isover = true;
    this.delay = 0;
  }
  delayhide() {
    this.delay = 2;
  }
  hide() {
    this.isover = false;
    this.delay = 0;
  }
}
