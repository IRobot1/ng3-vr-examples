import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { BehaviorSubject, Subject, Subscription } from "rxjs";

import { Group, Object3D, Vector2, WebXRManager } from "three";

import { NgtRenderState, NgtStore } from "@angular-three/core";

import { WebVRService } from "./webvr.service";


export class ConnectedEvent {
  constructor(public controller: Group, public xrinput: XRInputSource) { }
}

@Component({
  selector: 'vr-controller',
  template: '<ngt-group (beforeRender)="tick($event)"></ngt-group>',
})
export class VRControllerComponent implements OnInit, OnDestroy {
  @Input() index = 0;
  @Input() name = '';

  @Output() sessionstart = new BehaviorSubject<WebXRManager | undefined>(undefined)

  @Output() triggerstart = new EventEmitter<XRInputSource>()
  @Output() trigger = new EventEmitter<XRInputSource>()
  @Output() triggerend = new EventEmitter<XRInputSource>()

  @Output() gripstart = new EventEmitter<XRInputSource>()
  @Output() grip = new EventEmitter<XRInputSource>()
  @Output() gripend = new EventEmitter<XRInputSource>()

  @Output() touchpad = new EventEmitter<boolean>()
  @Output() touchpadaxis = new EventEmitter<Vector2>()

  @Output() joystick = new EventEmitter<boolean>()
  @Output() joystickaxis = new EventEmitter<Vector2>()

  @Output() connected = new BehaviorSubject<ConnectedEvent | undefined>(undefined)
  @Output() disconnected = new EventEmitter<boolean>()

  @Output() beforeRender = new EventEmitter<NgtRenderState>()

  private controller!: Group;
  private gamepad?: Gamepad;

  private subs = new Subscription();
  private cleanup = () => { }

  constructor(
    private webvr: WebVRService,
    private store: NgtStore,
  ) {
  }

  ngOnDestroy(): void {
    this.cleanup();
    this.subs.unsubscribe();
  }

  ngOnInit(): void {
    if (!this.webvr.manager) {
      console.error('webvr directive missing from ngt-canvas');
      return;
    }
    const gl = this.store.get((s) => s.gl);

    this.subs.add(this.webvr.xrsession.subscribe(isPresenting => {
      if (isPresenting) {
        this.sessionstart.next(gl.xr);
      }
    }));

    let connected: BehaviorSubject<any>;
    let disconnected: Subject<boolean>;

    switch (this.index) {
      case 0:
        this.controller = this.webvr.left.controller;
        connected = this.webvr.left.connected;
        disconnected = this.webvr.left.disconnected;
        break;
      case 1:
        this.controller = this.webvr.right.controller;
        connected = this.webvr.right.connected;
        disconnected = this.webvr.right.disconnected;
        break;
      default:
        console.error('xr-controler unhandled index', this.index);
        return;
    }

    this.subs.add(connected.subscribe((event: XRInputSource) => {
      if (!event) return;
      this.controller.name = event.handedness;
      this.gamepad = event.gamepad;
      this.connected.next(new ConnectedEvent(this.controller, event));
    }));

    this.subs.add(disconnected.subscribe((event: boolean) => {
      if (!event) return;
      this.disconnected.next(true);
    }));

    const selectstart = (event: any) => {
      const data: XRInputSource = event['data'];
      this.triggerstart.next(data);
    }
    this.controller.addEventListener('selectstart', selectstart);

    const selectend = (event: any) => {
      this.trigger.next(event['data']);
      this.triggerend.next(event['data']);
    }
    this.controller.addEventListener('selectend', selectend);

    const squeezestart = (event: any) => {
      this.gripstart.next(event['data']);
    }
    this.controller.addEventListener('squeezestart', squeezestart);

    const squeezeend = (event: any) => {
      this.grip.next(event['data']);
      this.gripend.next(event['data']);
    }
    this.controller.addEventListener('squeezeend', squeezeend);

    this.cleanup = () => {
      this.controller.removeEventListener('squeezeend', squeezeend);
      this.controller.removeEventListener('squeezestart', squeezestart);
      this.controller.removeEventListener('selectend', selectend);
      this.controller.removeEventListener('selectstart', selectstart);
    }
  }

  touchpad_pressed = false;
  joystick_pressed = false;
  touchpad_axis = new Vector2();
  joystick_axis = new Vector2();

  tick(event: { state: NgtRenderState, object: Object3D }) {
    if (this.gamepad) {
      if (this.gamepad.buttons.length > 2) {
        // 6 Y B
        // 5 X A
        // 3 joystick press
        if (this.gamepad.buttons[2].pressed && !this.touchpad_pressed) {
          this.touchpad.next(true);
          this.touchpad_pressed = true;
        }
        else if (this.touchpad_pressed && !this.gamepad.buttons[2].pressed) {
          this.touchpad.next(false);
          this.touchpad_pressed = false;
        }
      }

      if (this.gamepad.buttons.length > 3) {
        if (this.gamepad.buttons[3].pressed && !this.joystick_pressed) {
          this.joystick.next(true);
          this.joystick_pressed = true;
        }
        else if (this.joystick_pressed && !this.gamepad.buttons[3].pressed) {
          this.joystick.next(false);
          this.joystick_pressed = false;
        }
      }

      if (this.touchpadaxis.observed) {
        this.touchpad_axis.x = this.gamepad.axes[0];
        this.touchpad_axis.y = this.gamepad.axes[1];
        this.touchpadaxis.next(this.touchpad_axis);
      }
      if (this.joystickaxis.observed) {
        this.joystick_axis.x = this.gamepad.axes[2];
        this.joystick_axis.y = this.gamepad.axes[3];
        this.joystickaxis.next(this.joystick_axis);
      }
    }
    if (this.beforeRender.observed) {
      this.beforeRender.next(event.state);
    }

  }
}
