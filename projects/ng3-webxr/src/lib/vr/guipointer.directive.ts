import { Directive, Input, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";

import { Group, Intersection, Matrix4, Object3D, Raycaster } from "three";
import { BooleanInput, coerceBooleanProperty } from "@angular-three/core";

import { VRControllerComponent } from "./vr-controller.component";

@Directive({
  selector: '[guipointer]',
  exportAs: 'guiPointer',
  standalone: true,
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

  notify(intersections: Array<Intersection>, type: string) {
    intersections.forEach(item => {
      item.object.dispatchEvent({ type });
    })
  }

  ngOnInit(): void {
    const events: any = {
      'move': 'pointermove',
      'select': 'click',
      'selectstart': 'pointerdown',
      'selectend': 'pointerup'
    };

    const _event: any = { type: '' };

    const raycaster = new Raycaster();
    const tempMatrix = new Matrix4();

    let lasttype = '';
    let lastmove: Array<Intersection> | undefined = undefined;

    const onXRControllerEvent = (event: any) => {

      const controller = event.target;

      tempMatrix.identity().extractRotation(controller.matrixWorld);

      raycaster.ray.origin.setFromMatrixPosition(controller.matrixWorld);
      raycaster.ray.direction.set(0, 0, - 1).applyMatrix4(tempMatrix);

      const objects = this.guis.filter(x => x !== undefined);

      const intersections = raycaster.intersectObjects(objects, false);

      _event.controller = controller;
      _event.stop = false;

      if (intersections.length > 0) {
        const objects: Array<Object3D> = [];

        intersections.forEach(intersection => {
          if (_event.stop) return;

          const object = intersection.object;

          _event.type = events[event.type];
          _event.data = intersection;
          _event.rotation = controller.rotation;

          object.dispatchEvent(_event);
          lasttype = _event.type;
          objects.push(object);
        });

        if (lasttype == 'pointermove') {
          if (lastmove) {
            // notify any object that pointer is no longer intersecting
            lastmove.forEach(intersection => {
              if (!objects.includes(intersection.object)) {
                _event.type = 'pointerout';
                _event.data = intersection;
                intersection.object.dispatchEvent(_event);
              }
            })
          }
          else {
            intersections.forEach(intersection => {
              _event.type = 'pointerover';
              _event.data = intersection;
              intersection.object.dispatchEvent(_event);
            });
          }
          lastmove = intersections;
        }
      }
      else {
        if (lastmove) {
          if (lastmove) this.notify(lastmove, 'pointerout');
          lastmove = undefined;
        }

        if (event.type != 'move') {
          objects.forEach(object => object.dispatchEvent({ type: 'raymissed' }));
        }


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
