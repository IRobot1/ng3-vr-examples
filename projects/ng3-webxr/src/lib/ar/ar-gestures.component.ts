import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from "@angular/core";

import { Group, Matrix4, Object3D, Vector3 } from "three";
import { NgtRenderState, NgtStore } from "@angular-three/core";

import { WebARService } from "./webar.service";

//
// Code below is adapted from https://github.com/NikLever/XRGestures/blob/main/libs/XRGestures.js
//

export type SwipeDirection = 'up' | 'down';

declare type EventType = 'unknown' | 'tap' | 'swipe' | 'pinch' | 'rotate' | 'pan';

class FingerState {
  startPosition?: Vector3;
  startTime!: number;
  endTime!: number;
  pressed = false;
  taps = 0;
}

@Component({
  selector: 'ar-gestures',
  template: '<ngt-group (beforeRender)="tick($event)"></ngt-group>',
})
export class ARGesturesComponent implements OnInit, OnDestroy {
  @Input() doubleClickLimit = 0.2;
  @Input() pressMinimum = 0.4;

  @Output() press = new EventEmitter<{ position: Vector3, matrixWorld: Matrix4 }>();

  @Output() tap = new EventEmitter<{ position: Vector3, matrixWorld: Matrix4 }>();
  @Output() doubletap = new EventEmitter<{ position: Vector3, matrixWorld: Matrix4 }>();
  @Output() tripletap = new EventEmitter<{ position: Vector3, matrixWorld: Matrix4 }>();
  @Output() quadtap = new EventEmitter<{ position: Vector3, matrixWorld: Matrix4 }>();

  @Output() swipe = new EventEmitter<SwipeDirection>();
  @Output() pinch = new EventEmitter<{ delta: number, scale: number, initialise?: boolean }>();
  @Output() rotate = new EventEmitter<{ theta: number, initialise?: boolean }>();
  @Output() pan = new EventEmitter<{ delta: Vector3, initialise?: boolean }>();


  private controller1!: Group;
  private controller2!: Group;

  private finger1State = new FingerState();
  private finger2State = new FingerState();

  private cleanup = () => { }

  private type: EventType = 'unknown';

  constructor(
    private webar: WebARService,
    private store: NgtStore,
  ) {
  }

  ngOnDestroy(): void {
    this.cleanup();
  }

  ngOnInit(): void {
    if (!this.webar.manager) {
      console.error('webar directive missing from ngt-canvas');
      return;
    }
    const clock = this.store.get(s => s.clock);

    this.controller1 = this.webar.finger1Controller;
    this.controller2 = this.webar.finger2Controller;

    const tapstart = (data: FingerState) => {
      data.startPosition = undefined;
      data.startTime = clock.getElapsedTime();

      if (this.type == 'tap') data.taps = 0;

      this.type = 'unknown';
      data.pressed = true;
    }

    const selectstart1 = () => {
      tapstart(this.finger1State);
    }
    this.controller1.addEventListener('selectstart', selectstart1);

    const selectstart2 = () => {
      tapstart(this.finger2State);
    }
    this.controller2.addEventListener('selectstart', selectstart2);

    const tapend = (data: FingerState) => {
      data.endTime = clock.getElapsedTime();
      const startToEnd = data.endTime - data.startTime;

      if (this.type === 'swipe') {
        if (data.startPosition) {
          const direction: SwipeDirection = (this.controller1.position.y < data.startPosition.y) ? "down" : "up";
          this.swipe.next(direction);
        }
        this.type = 'unknown';
      } else if (this.type !== 'pinch' && this.type !== 'rotate' && this.type !== 'pan') {
        if (startToEnd < this.doubleClickLimit) {
          this.type = 'tap';
          data.taps++;
        } else if (startToEnd > this.pressMinimum) {
          this.press.next({ position: this.controller1.position, matrixWorld: this.controller1.matrixWorld });
          this.type = 'unknown';
        }
      } else {
        this.type = 'unknown';
      }

      data.pressed = false;
      data.startPosition = undefined;
    }

    const selectend1 = () => {
      tapend(this.finger1State)
    }
    this.controller1.addEventListener('selectend', selectend1);

    const selectend2 = () => {
      tapend(this.finger2State)
    }
    this.controller2.addEventListener('selectend', selectend2);

    this.cleanup = () => {
      this.controller1.removeEventListener('selectstart', selectstart1);
      this.controller1.removeEventListener('selectend', selectend1);
      this.controller1.removeEventListener('selectstart', selectstart2);
      this.controller1.removeEventListener('selectend', selectend2);
    }
  }

  get multiTouch() {
    return this.finger1State.pressed && this.finger2State.pressed;
  }

  get touch() {
    return this.finger1State.pressed || this.finger2State.pressed;
  }

  private up = new Vector3(0, 1, 0);
  private startDistance!: number;
  private startVector!: Vector3;
  private startPosition!: Vector3;

  tick(event: { state: NgtRenderState, object: Object3D }) {
    const data1 = this.finger1State;
    const data2 = this.finger2State;

    const currentTime = event.state.clock.getElapsedTime();

    let elapsedTime;

    if (data1.pressed && data1.startPosition === undefined) {
      elapsedTime = currentTime - data1.startTime;
      if (elapsedTime > 0.05) data1.startPosition = this.controller1.position.clone();
    }

    if (data2.pressed && data2.startPosition === undefined) {
      elapsedTime = currentTime - data2.startTime;
      if (elapsedTime > 0.05) data2.startPosition = this.controller2.position.clone();
    }

    if (!data1.pressed && this.type === 'tap') {
      //Only dispatch event after double click limit is passed
      elapsedTime = currentTime - data1.endTime;
      if (elapsedTime > this.doubleClickLimit) {
        //console.log( `XRGestures.update dispatchEvent taps:${data1.taps}` );
        switch (data1.taps) {
          case 1:
            this.tap.next({ position: this.controller1.position, matrixWorld: this.controller1.matrixWorld });
            break;
          case 2:
            this.doubletap.next({ position: this.controller1.position, matrixWorld: this.controller1.matrixWorld });
            break;
          case 3:
            this.tripletap.next({ position: this.controller1.position, matrixWorld: this.controller1.matrixWorld });
            break;
          case 4:
            this.quadtap.next({ position: this.controller1.position, matrixWorld: this.controller1.matrixWorld });
            break;
        }
        this.type = "unknown";
        data1.taps = 0;
      }
    }


    if (this.type === 'unknown' && this.touch) {
      if (data1.startPosition !== undefined) {
        if (this.multiTouch) {
          if (data2.startPosition !== undefined) {
            //startPosition is undefined for 1/20 sec, test for pinch or rotate
            const startDistance = data1.startPosition.distanceTo(data2.startPosition);
            const currentDistance = this.controller1.position.distanceTo(this.controller2.position);
            const delta = currentDistance - startDistance;
            if (Math.abs(delta) > 0.01) {
              this.type = 'pinch';
              this.startDistance = this.controller1.position.distanceTo(this.controller2.position);
              this.pinch.next({ delta: 0, scale: 1, initialise: true });
            } else {
              const v1 = data2.startPosition.clone().sub(data1.startPosition).normalize();
              const v2 = this.controller2.position.clone().sub(this.controller1.position).normalize();
              const theta = v1.angleTo(v2);
              if (Math.abs(theta) > 0.2) {
                this.type = 'rotate';
                this.startVector = v2.clone();
                this.rotate.next({ theta: 0, initialise: true });
              }
            }
          }
        } else {
          //test for swipe or pan
          let dist = data1.startPosition.distanceTo(this.controller1.position);
          elapsedTime = currentTime - data1.startTime;
          const velocity = dist / elapsedTime;
          //console.log(`dist:${dist.toFixed(3)} velocity:${velocity.toFixed(3)}`);
          if (dist > 0.01 && velocity > 0.1) {
            const v = this.controller1.position.clone().sub(data1.startPosition);
            let maxY = (Math.abs(v.y) > Math.abs(v.x)) && (Math.abs(v.y) > Math.abs(v.z));
            if (maxY) this.type = "swipe";
          } else if (dist > 0.006 && velocity < 0.03) {
            this.type = "pan";
            this.startPosition = this.controller1.position.clone();
            this.pan.next({ delta: new Vector3(), initialise: true });
          }
        }
      }
    } else if (this.type === 'pinch') {
      const currentDistance = this.controller1.position.distanceTo(this.controller2.position);
      const delta = currentDistance - this.startDistance;
      const scale = currentDistance / this.startDistance;
      this.pinch.next({ delta, scale });
    } else if (this.type === 'rotate') {
      const v = this.controller2.position.clone().sub(this.controller1.position).normalize();
      let theta = this.startVector.angleTo(v);
      const cross = this.startVector.clone().cross(v);
      if (this.up.dot(cross) > 0) theta = -theta;
      this.rotate.next({ theta });
    } else if (this.type === 'pan') {
      const delta = this.controller1.position.clone().sub(this.startPosition);
      this.pan.next({ delta });
    }
  }
}
