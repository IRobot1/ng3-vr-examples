import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { Subscription } from "rxjs";

import { Group } from "three";

import { VRControllerComponent } from "ng3-webxr";


@Component({
  selector: 'vr-scale',
  template: '',
})
export class VRScaleComponent implements OnInit, OnDestroy {
  @Input() left!: VRControllerComponent;
  @Input() right!: VRControllerComponent;

  @Output() start = new EventEmitter<number>();
  @Output() changed = new EventEmitter<number>();
  @Output() end = new EventEmitter<boolean>();

  private leftctrl!: Group;
  private rightctrl!: Group;

  private cleanup = () => { }
  private subs = new Subscription();

  ngOnDestroy(): void {
    this.subs.unsubscribe();
    this.cleanup();
  }

  private triggercount = 0;

  ngOnInit(): void {
    if (!this.left || !this.right) {
      console.error('vr-scale - left or right controller not defined');
      return;
    }

    this.subs.add(this.left.connected.subscribe(next => {
      if (!next) return;
      this.leftctrl = next.controller;
    }));

    this.subs.add(this.right.connected.subscribe(next => {
      if (!next) return;
      this.rightctrl = next.controller;
    }));

    this.subs.add(this.left.triggerstart.subscribe(next => {
      this.triggercount++;
      this.startScaling();
    }));

    this.subs.add(this.left.triggerend.subscribe(next => {
      this.triggercount--;
      this.startlength = 0;
      if (this.triggercount == 0) this.end.next(true);
    }));

    this.subs.add(this.right.triggerstart.subscribe(next => {
      this.triggercount++;
      this.startScaling();
    }));

    this.subs.add(this.right.triggerend.subscribe(next => {
      this.triggercount--;
      this.startlength = 0;
      if (this.triggercount == 0) this.end.next(true);
    }));

    this.subs.add(this.left.beforeRender.subscribe(next => {
      this.tick();
    }));

  }

  private startlength = 0;

  private startScaling() {
    if (this.triggercount == 2) {
      this.startlength = this.distance;
      this.start.next(this.startlength)
    }
  }

  private get distance(): number {
    return this.leftctrl.position.sub(this.rightctrl.position).length();
  }

  tick() {
    if (this.startlength) {
      const currlength = this.distance;
      this.changed.next(currlength / this.startlength);
    }
  }

}
