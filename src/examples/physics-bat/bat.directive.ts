import { Directive, OnDestroy, OnInit } from "@angular/core";

import { Group, Mesh, Object3D } from "three";

import { NgtPhysicBody, NgtPhysicBodyReturn } from "@angular-three/cannon";

import { NgtGLTFLoader } from "@angular-three/soba/loaders";

import { VRControllerComponent } from "ng3-webxr";

@Directive({
  selector: '[bat]',
  providers: [NgtPhysicBody],
})
export class BatDirective implements OnInit, OnDestroy {
  private controller!: Group;

  private mesh!: Mesh;

  private bat!: NgtPhysicBodyReturn<Object3D>;

  constructor(
    private xr: VRControllerComponent,
    private physicBody: NgtPhysicBody,
    private loader: NgtGLTFLoader,
  ) { }

  ngOnDestroy(): void {
    this.controller?.remove(this.mesh);
  }

  ngOnInit(): void {
    this.xr.connected.subscribe(next => {
      if (!next) return;

      if (!this.mesh) {
        const s = this.loader.load('assets/bat.gltf').subscribe(next => {
          this.mesh = <Mesh>next.scene.children[0].children[0];
          this.controller.add(this.mesh);

          this.mesh.castShadow = true;
          this.mesh.receiveShadow = true;
          this.mesh.rotation.set(0.523599, 1.57, 0);
          this.mesh.position.set(0, 0.125, -0.2);
          this.mesh.scale.set(0.1, 0.4, 0.4);

          this.bat = this.physicBody.useCompoundBody(() => ({
            material: { restitution: 1, friction: 0 },
            shapes: [{
              type: 'Box',
              // scale and position the physics body
              args: [0.2, 0.55, 0.2],
              position: [0, 0.25, -0.3],
              rotation: [2.0944, 0, 0],
            }]
          }), false);
        },
          () => { },
          () => { s.unsubscribe(); }
        );
      }
      this.controller = next.controller
    });

    this.xr.disconnected.subscribe(next => {
      this.controller.remove(this.mesh)
    });

    this.xr.beforeRender.subscribe(next => {
      this.tick();
    })
  }

  private tick() {
    if (this.controller && this.bat) {
      const p = this.controller.position;
      this.bat.api.position.set(p.x, p.y, p.z);

      const r = this.controller.rotation;
      this.bat.api.rotation.set(r.x, r.y, r.z);
    }
  }
}
