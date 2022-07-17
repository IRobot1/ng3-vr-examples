import { Directive, Input, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";

import { CylinderGeometry, Group, IcosahedronGeometry, Mesh, MeshStandardMaterial, SphereGeometry, Vector3 } from "three";
import { BooleanInput, coerceBooleanProperty, NgtStore } from "@angular-three/core";

import { VRControllerComponent } from "ng3-webxr";
import { TubePainter } from "./tubepainter";
import { clamp } from "three/src/math/MathUtils";


@Directive({
  selector: '[paintbrush]',
})
export class PaintBrushDirective implements OnInit, OnDestroy {
  private _enabled: BooleanInput = true;
  @Input()
  get paintbrush(): boolean { return coerceBooleanProperty(this._enabled) }
  set paintbrush(newvalue: BooleanInput) {
    this._enabled = newvalue;
    if (this.brush) {
      if (newvalue)
        this.show();
      else
        this.hide();
    }
  }

  private brush!: Mesh;
  tip!: Mesh;

  private isSelecting = false;

  private painter = new TubePainter();

  private controller!: Group;
  private subs = new Subscription();

  constructor(
    private xr: VRControllerComponent,
    private store: NgtStore,
  ) {
  }

  ngOnDestroy(): void {
    this.hide();
    this.subs.unsubscribe();
  }

  ngOnInit(): void {
    this.subs.add(this.xr.connected.subscribe(next => {
      if (!next) return;
      this.controller = next.controller;

      this.brush = this.buildTrackPointer();

      if (this.paintbrush) {
        this.show();
      }
    }));

    //this.subs.add(this.xr.disconnected.subscribe(next => {
    //  if (this.paintbrush) this.hide();
    //}));

    this.subs.add(this.xr.triggerstart.subscribe(next => {
      if (this.paintbrush) this.isSelecting = true;
    }));

    this.subs.add(this.xr.triggerend.subscribe(next => {
      if (this.paintbrush) this.isSelecting = false;
    }));

    this.subs.add(this.xr.joystickaxis.subscribe(next => {
      if (this.paintbrush) {
        const scale = clamp(this.tip.scale.x - next.y / 50, 0.1, 5)
        this.tip.scale.setScalar(scale);
        this.painter.setSize(scale);
      }
    }));

    this.subs.add(this.xr.beforeRender.subscribe(next => {
      if (this.paintbrush) this.tick();
    }));
  }

  private buildTrackPointer() {
    const geometry = new CylinderGeometry(0.01, 0.02, 0.08, 5);
    geometry.rotateX(- Math.PI / 2);
    const material = new MeshStandardMaterial({ flatShading: true });
    const mesh = new Mesh(geometry, material);

    const pivot = new Mesh(new SphereGeometry(0.01));
    pivot.position.z = -0.05;
    //pivot.scale.setScalar(1);
    mesh.add(pivot);
    this.tip = pivot;

    return mesh;
  }

  private show() {
    this.controller.add(this.brush);

    const scene = this.store.get(s => s.scene);
    scene.add(this.painter.mesh);
  }

  private hide() {
    if (this.controller)
      this.controller.remove(this.brush);

    const scene = this.store.get(s => s.scene);
    scene.remove(this.painter.mesh);
  }

  tick() {
    if (this.controller && this.tip) {

      const cursor = new Vector3();
      cursor.setFromMatrixPosition(this.tip.matrixWorld);

      if (this.isSelecting === true) {
        this.painter.lineTo(cursor);
        this.painter.update();
      }
      else {
        this.painter.moveTo(cursor);
      }
    }
  }
}
