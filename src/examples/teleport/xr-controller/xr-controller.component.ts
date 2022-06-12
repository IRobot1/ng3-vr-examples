import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

import { Group, Object3D, Vector2, WebXRManager } from "three";

import { NgtRenderState, NgtStore } from "@angular-three/core";


export class ConnectedEvent {
  constructor(public controller: Group, public xrinput: XRInputSource) { }
}

@Component({
  selector: 'xr-controller',
  template: '<ngt-group (beforeRender)="tick($event)"></ngt-group>',
})
export class XRControllerComponent implements OnInit {
  @Input() index = 0;

  @Output() sessionstart = new EventEmitter<WebXRManager>()

  @Output() selectstart = new EventEmitter<XRInputSource>()
  @Output() trigger = new EventEmitter<XRInputSource>()
  @Output() selectend = new EventEmitter<XRInputSource>()

  @Output() squeezestart = new EventEmitter<XRInputSource>()
  @Output() grip = new EventEmitter<XRInputSource>()
  @Output() squeezeend = new EventEmitter<XRInputSource>()

  @Output() touchpadstart = new EventEmitter()
  @Output() touchpad = new EventEmitter<Vector2>()
  @Output() touchpadend = new EventEmitter()

  @Output() joystickstart = new EventEmitter()
  @Output() joystick = new EventEmitter<Vector2>()
  @Output() joystickend = new EventEmitter()

  @Output() connected = new EventEmitter<ConnectedEvent>()
  @Output() disconnected = new EventEmitter()

  @Output() beforeRender = new EventEmitter<NgtRenderState>()

  private controller!: Group;
  private gamepad!: Gamepad;

  constructor(private store: NgtStore) { }

  ngOnInit(): void {
    const renderer = this.store.get((s) => s.gl);

    renderer.xr.addEventListener('sessionstart', (event) => this.sessionstart.emit(event.target))

    const scene = this.store.get((s) => s.scene);

    this.controller = renderer.xr.getController(this.index);
    scene.add(this.controller);


    this.controller.addEventListener('selectstart', (event) => {
      const data: XRInputSource = event['data'];
      this.selectstart.emit(data);
    });
    this.controller.addEventListener('selectend', (event) => {
      this.trigger.emit(event['data']);
      this.selectend.emit(event['data']);
    });

    this.controller.addEventListener('squeezestart', (event) => {
      this.squeezestart.emit(event['data']);
    });
    this.controller.addEventListener('squeezeend', (event) => {
      this.grip.emit(event['data']);
      this.squeezeend.emit(event['data']);
    });

    this.controller.addEventListener('connected', (event) => {
      const data = event['data'];
      if (this.controller.name != data.handedness) { // only connect once
        this.controller.name = data.handedness;
        this.gamepad = data.gamepad;
        this.connected.emit(new ConnectedEvent(this.controller, data));

      }
    });
    this.controller.addEventListener('disconnected', () => {
      this.controller.remove(this.controller.children[0]);
      if (this.controller.name != '') {
        this.disconnected.emit();
        this.controller.name = '';
      }
    });
  }

  touchpad_pressed = false;
  joystick_pressed = false;
  touchpad_axis = new Vector2();
  joystick_axis = new Vector2();

  tick(event: { state: NgtRenderState, object: Object3D }) {
    if (this.gamepad) {

      if (this.gamepad.buttons[2].pressed && !this.touchpad_pressed) {
        this.touchpadstart.emit();
        this.touchpad_pressed = true;
      }
      else if (this.touchpad_pressed && !this.gamepad.buttons[2].pressed) {
        this.touchpad.emit();
        this.touchpadend.emit();
        this.touchpad_pressed = false;
      }

      if (this.gamepad.buttons[3].pressed && !this.joystick_pressed) {
        this.joystick.emit();
        this.joystick_pressed = true;
      }
      else if (this.joystick_pressed && !this.gamepad.buttons[3].pressed) {
        this.joystick.emit();
        this.joystickend.emit();
        this.joystick_pressed = false;
      }

      if (this.touchpad.observed) {
        this.touchpad_axis.x = this.gamepad.axes[0];
        this.touchpad_axis.y = this.gamepad.axes[1];
        this.touchpad.emit(this.touchpad_axis);
      }
      if (this.joystick.observed) {
        this.joystick_axis.x = this.gamepad.axes[2];
        this.joystick_axis.y = this.gamepad.axes[3];
        this.joystick.emit(this.joystick_axis);
      }
    }
    if (this.beforeRender.observed) {
      this.beforeRender.emit(event.state);
    }

  }
}
