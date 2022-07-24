import { AfterContentInit, ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from "@angular/core";

import { ColorRepresentation, Object3D, Quaternion, Vector3 } from "three";

import { make, NgtTriple } from "@angular-three/core";

import { NgtPhysicBody, NgtPhysicBodyReturn } from "@angular-three/cannon";

@Component({
  selector: 'drum-key',
  templateUrl: 'key.component.html',
  providers: [NgtPhysicBody],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DrumKey implements AfterContentInit {
  @Input() position = [0, 0, 0] as NgtTriple;
  @Input() scale = 1;

  @Input() color: ColorRepresentation = 'white';
  @Input() mass = 1;
  @Input() keycode: string = '';
  @Input() size = [0.2, 0.01, 0.2] as NgtTriple;
  @Input() fontsize = 0.2;

  @Output() click = new EventEmitter<string>();


  body!: NgtPhysicBodyReturn<Object3D>; 

  constructor(
    private physicBody: NgtPhysicBody,
  ) { }

  ngAfterContentInit(): void {
    const size = make(Vector3, this.size).multiplyScalar(this.scale).toArray();
    
    // instead of the body positioning the Mesh, the mesh positions the body in tick below
    this.body = this.physicBody.useBox(() => ({
      isTrigger: true,
      args: size,
      position: this.position,
      onCollideBegin: (e) => {
        if (e.body.name == 'stick') {
          this.pressed();
        }
      }
    }), false);
  }

  pressed() {
    this.click.emit(this.keycode);
  }

  wp = new Vector3();
  wq = new Quaternion();

  tick(object: Object3D) {
    const p = object.getWorldPosition(this.wp)
    this.body.api.position.copy(p);
    const q = object.getWorldQuaternion(this.wq);
    this.body.api.quaternion.copy(q);
  }
}
