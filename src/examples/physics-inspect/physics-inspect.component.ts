import { Component, ContentChild, Inject, Input, NgZone, OnInit, Optional, SkipSelf, TemplateRef } from "@angular/core";

import { Group, Mesh, Object3D, Vector3 } from "three";

import { AnyFunction, NgtObjectInputs, NgtStore, NGT_INSTANCE_HOST_REF, NGT_INSTANCE_REF, provideObjectHostRef, Ref } from "@angular-three/core";

import { NgtPhysicBody, NgtPhysicConstraint, NgtPhysicConstraintReturn } from "@angular-three/cannon";

import { XRControllerModelFactory } from "three-stdlib/webxr/XRControllerModelFactory";

import { Inspect } from "./inspect";


@Component({
  selector: 'app-xr-inspect',
  templateUrl: './xr-inspect.component.html',
  providers: [provideObjectHostRef(XRInspectComponent), NgtPhysicBody, NgtPhysicConstraint],
})
export class XRInspectComponent extends NgtObjectInputs<Group> implements OnInit {
  @Input() index = 0;
  @Input() showcontrollermodel = false;
  @Input() socket!: Ref<Mesh>;

  @ContentChild(TemplateRef) content?: TemplateRef<any>;

  helper = false;  // show attach point and collision volume

  private controller!: Group;

  constructor(
    zone: NgZone,
    store: NgtStore,
    @Optional()
    @SkipSelf()
    @Inject(NGT_INSTANCE_REF)
    parentRef: AnyFunction<Ref>,
    @Optional()
    @SkipSelf()
    @Inject(NGT_INSTANCE_HOST_REF)
    parentHostRef: AnyFunction<Ref>,
    private physicBody: NgtPhysicBody,
    private physicConstraint: NgtPhysicConstraint,
  ) {
    super(zone, store, parentRef, parentHostRef);
  }

  override ngOnInit(): void {
    super.ngOnInit();

    const renderer = this.store.get((s) => s.gl);

    this.controller = renderer.xr.getController(this.index);

    // The XRControllerModelFactory will automatically fetch controller models
    // that match what the user is holding as closely as possible. The models
    // should be attached to the object returned from getControllerGrip in
    // order to match the orientation of the held device.
    if (this.showcontrollermodel) {
      const controllerModelFactory = new XRControllerModelFactory();

      const controllerGrip = renderer.xr.getControllerGrip(this.index);
      controllerGrip.add(controllerModelFactory.createControllerModel(controllerGrip));

      const scene = this.store.get((s) => s.scene);
      scene.add(controllerGrip);
    }

    this.controller.addEventListener('connected', (event) => {
      const controller = <Group>event.target;
      const source = <XRInputSource>event['data'];
      controller.name = source.handedness;
    });

    this.controller.addEventListener('selectstart', () => {
      this.pickup();
    });

    this.controller.addEventListener('selectend', () => {
      this.drop();
    });

  }

  private overlapping?: Object3D;
  private inspecting?: Inspect;

  private constraint!: NgtPhysicConstraintReturn<'PointToPoint'>;

  private pickup() {
    if (this.overlapping && !this.inspecting) {
      const inspect = <Inspect>this.overlapping.userData['inspect'];
      if (inspect) {
        inspect.Pickup();
        this.constraint = this.physicConstraint.usePointToPointConstraint(
          inspect.physics.ref,
          this.marker.ref,
          {
            pivotA: [0, 0, 0], pivotB: [0, 0, 0],
          });
        this.inspecting = inspect;
      }
    }

  }

  private drop() {
    if (this.inspecting) {
      this.inspecting.Drop();
      this.inspecting.physics.api.angularFactor.set(1, 1, 1);  // allow normal rotation again

      this.constraint.api.remove();
      this.inspecting = undefined;
    }
  }

  markerRadius = 0.01;
  marker = this.physicBody.useSphere(() => ({
    mass: 0,
    args: [this.markerRadius],
    collisionResponse: false,
  }));

  collisionRadius = 0.05;
  collision = this.physicBody.useSphere(() => ({
    isTrigger: true,
    args: [this.collisionRadius],

    onCollideBegin: (e) => {
      if (e.body != this.overlapping) {
        this.overlapping = e.body;
      }
    },
    onCollideEnd: (e) => {
      if (e.body == this.overlapping) {
        this.overlapping = undefined;
      }
    },
  }));


  tick(actor: Group) {
    let position: Vector3;
    if (this.socket) {
      position = new Vector3();
      this.socket.value.localToWorld(position);
    }
    else {
      position = this.controller.position;
    }
    const rotation = this.controller.rotation;

    // move the collision sphere with controller
    this.collision.api.position.copy(position);
    this.collision.api.rotation.copy(rotation);

    // move marker for attaching grabbed things
    this.marker.api.position.copy(position);
    this.marker.api.rotation.copy(rotation);

    // move asset visual
    actor.position.copy(this.controller.position);
    actor.rotation.copy(this.controller.rotation);

    // rotate the thing being inspected to match the controller rotation
    if (this.inspecting) {
      this.inspecting.physics.api.angularFactor.set(0, 0, 0); // stop it shaking
      this.inspecting.physics.api.rotation.copy(rotation);
    }
  }
}
