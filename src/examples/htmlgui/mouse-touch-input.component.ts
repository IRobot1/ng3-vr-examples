import { Component, Input, OnDestroy, OnInit } from "@angular/core";

import { Object3D, Raycaster, Vector2 } from "three";
import { BooleanInput, coerceBooleanProperty, NgtStore } from "@angular-three/core";

@Component({
  selector: 'mouse-touch-input[intersectObjects]',
  template: '',
})
export class MouseTouchInput implements OnInit, OnDestroy {

  @Input() intersectObjects: Array<Object3D> = [];
  @Input() recursive: BooleanInput = false;

  private cleanup = () => { }

  constructor(private store: NgtStore) { }

  ngOnDestroy() {
    this.cleanup();
  }

  ngOnInit(): void {
    const _pointer = new Vector2();
    const _event = { type: '', data: _pointer };

    const raycaster = new Raycaster();

    const renderer = this.store.get(s => s.gl);
    const camera = this.store.get(s => s.camera);

    const element = renderer.domElement;

    let lastobject: any;

    const onPointerEvent = (event: any) => {

      event.stopPropagation();

      _pointer.x = (event.clientX / element.clientWidth) * 2 - 1;
      _pointer.y = - (event.clientY / element.clientHeight) * 2 + 1;

      raycaster.setFromCamera(_pointer, camera);

      const intersects = raycaster.intersectObjects(this.intersectObjects, coerceBooleanProperty(this.recursive));

      if (intersects.length > 0) {

        const intersection = intersects[0];

        const object = intersection.object;
        const uv = intersection.uv;

        _event.type = event.type;
        if (uv)
          _event.data.set(uv.x, 1 - uv.y);

        object.dispatchEvent(_event);
        lastobject = object;
      }
      else if (lastobject) {
        lastobject.dispatchEvent({ type: 'mouseout' });
        lastobject = undefined;
      }

    }

    element.addEventListener('pointerdown', onPointerEvent);
    element.addEventListener('pointerup', onPointerEvent);
    element.addEventListener('pointermove', onPointerEvent);
    element.addEventListener('mousedown', onPointerEvent);
    element.addEventListener('mouseup', onPointerEvent);
    element.addEventListener('mousemove', onPointerEvent);
    element.addEventListener('click', onPointerEvent);

    this.cleanup = () => {
      element.removeEventListener('pointerdown', onPointerEvent);
      element.removeEventListener('pointerup', onPointerEvent);
      element.removeEventListener('pointermove', onPointerEvent);
      element.removeEventListener('mousedown', onPointerEvent);
      element.removeEventListener('mouseup', onPointerEvent);
      element.removeEventListener('mousemove', onPointerEvent);
      element.removeEventListener('click', onPointerEvent);
    }

  }
}
