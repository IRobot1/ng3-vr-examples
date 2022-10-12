import { Component, EventEmitter, Input, Output } from "@angular/core";

import { BufferGeometry, Group, Material, MathUtils, Mesh, Object3D, Vector3 } from "three";
import { make, NgtObjectProps, NgtVector3 } from "@angular-three/core";

class SpokeData {
  constructor(public geometry: BufferGeometry, public material: Material, public offset: number, public angle: number) { }
}
@Component({
  selector: 'spokes',
  templateUrl: './spokes.component.html',
})
export class SpokesLoadingComponent extends NgtObjectProps<Group> {
  @Input() count = 8;
  @Input() offset = 0.1;
  @Input() angle = 0;
  @Input() material!: Material;
  @Input() geometry!: BufferGeometry

  @Input() animate!: NgtVector3;

  @Output() tick = new EventEmitter<Array<Mesh>>();

  spokes: Array<SpokeData> = [];
  meshes: Array<Mesh> = [];

  override ngOnInit() {
    super.ngOnInit();

    const angle = MathUtils.degToRad(360 / this.count);

    for (let i = 0; i < this.count; i++) {
      this.spokes.push(new SpokeData(this.geometry, this.material, this.offset, angle * i));
    }
  }

  beforeRender(object: Object3D) {
    const r = make(Vector3, this.animate);
    if (r) {
      object.rotation.x += r.x;
      object.rotation.y += r.y;
      object.rotation.z += r.z;
    }
    this.tick.next(this.meshes);
  }
}
