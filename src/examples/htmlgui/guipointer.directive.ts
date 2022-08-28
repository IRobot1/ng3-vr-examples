import { Directive, Input, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";

import { Group, Matrix4, Object3D, Raycaster, Vector2 } from "three";
import { BooleanInput, coerceBooleanProperty } from "@angular-three/core";

import { VRControllerComponent } from "ng3-webxr";


@Directive({
  selector: '[guipointer]',
})
export class GUIPointerDirective implements OnInit, OnDestroy {
  private _enabled: BooleanInput = true;
  @Input()
  get guipointer(): boolean { return coerceBooleanProperty(this._enabled) }
  set guipointer(newvalue: BooleanInput) {
    this._enabled = newvalue;
  }
  @Input() guis: Array<Object3D> = [];

  private subs = new Subscription();
  private cleanup = () => { }

  constructor(
    private xr: VRControllerComponent,
  ) {
  }

  ngOnDestroy(): void {
    this.cleanup();
    this.subs.unsubscribe();
  }

  ngOnInit(): void {
    if (this.guis.length == 0) {
      console.error('guipointer directive gui input not set')
      return;
    }

    const events: any = {
      'move': 'mousemove',
      'select': 'click',
      'selectstart': 'mousedown',
      'selectend': 'mouseup'
    };

    const _pointer = new Vector2();
    const _event = { type: '', data: _pointer };

    const raycaster = new Raycaster();
    const tempMatrix = new Matrix4();

    const onXRControllerEvent = (event: any) => {

      const controller = event.target;

      tempMatrix.identity().extractRotation(controller.matrixWorld);

      raycaster.ray.origin.setFromMatrixPosition(controller.matrixWorld);
      raycaster.ray.direction.set(0, 0, - 1).applyMatrix4(tempMatrix);

      const intersections = raycaster.intersectObjects(this.guis.filter(x => x !== undefined), false);

      if (intersections.length > 0) {

        const intersection = intersections[0];

        const object = intersection.object;
        const uv = intersection.uv;

        _event.type = events[event.type];
        if (uv)
          _event.data.set(uv.x, 1 - uv.y);

        object.dispatchEvent(_event);
      }
    }

    let controller: Group;

    this.subs.add(this.xr.connected.subscribe(next => {
      if (!next) return;

      controller = next.controller;

      if (this.guipointer) {
        controller.addEventListener('move', onXRControllerEvent);
        controller.addEventListener('select', onXRControllerEvent);
        controller.addEventListener('selectstart', onXRControllerEvent);
        controller.addEventListener('selectend', onXRControllerEvent);

        this.cleanup = () => {
          controller.removeEventListener('move', onXRControllerEvent);
          controller.removeEventListener('select', onXRControllerEvent);
          controller.removeEventListener('selectstart', onXRControllerEvent);
          controller.removeEventListener('selectend', onXRControllerEvent);
        }
      }
    }));
  }
}
