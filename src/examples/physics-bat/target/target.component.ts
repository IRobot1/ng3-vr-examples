import { AfterContentInit, AfterViewInit, Component, EventEmitter, Input, OnDestroy, Output } from "@angular/core";

import { NgtTriple } from "@angular-three/core";

import { BodyProps, NgtPhysicBody, ShapeType } from "@angular-three/cannon";
import { Vector3 } from "three";


class Border {
  constructor(public position: NgtTriple, public scale: NgtTriple) { }
}

@Component({
  selector: 'target',
  templateUrl: './target.component.html',
  providers: [NgtPhysicBody],
})
export class Target implements AfterContentInit, OnDestroy {
  @Input() position = [0, 0, 0] as NgtTriple;
  @Input() rotation = [0, 0, 0] as NgtTriple;
  @Input() scale = [0, 0, 0] as NgtTriple;
  @Input() color = 'white';
  @Input() points = 1;

  @Output() hit = new EventEmitter<number>();

  cubes: Array<Border> = [];

  private shapes: Array<BodyProps & { type: ShapeType; }> = []

  frame = this.physicBody.useCompoundBody(() => ({
    mass: 0,
    shapes: this.shapes,
    position: this.position,
    rotation: this.rotation,
  }));

  triggerargs = [0.9, 0.1, 0.9] as NgtTriple;
  triggerposition!: NgtTriple;
  trigger = this.physicBody.useBox(() => ({
    isTrigger: true,
    position: this.triggerposition,
    rotation: this.rotation,
    args: this.triggerargs,
    onCollideBegin: () => { this.hit.emit(this.points) }
  }));

  constructor(
    private physicBody: NgtPhysicBody,
  ) {
  }

  private scaledborder(position: NgtTriple, scale: Vector3): NgtTriple {
    return new Vector3(position[0], position[1], position[2]).multiply(scale).toArray()
  }

  ngAfterContentInit(): void {
    this.triggerposition = new Vector3(this.position[0], this.position[1], this.position[2]).add(new Vector3(0, 0, -0.1)).toArray()

    const vscale = new Vector3(this.scale[0], this.scale[1], this.scale[2]);

    this.cubes.push(new Border(this.scaledborder([-0.5, 0, 0], vscale), this.scaledborder([0.1, 0.1, 1],vscale)));
    this.cubes.push(new Border(this.scaledborder([0.5, 0, 0], vscale), this.scaledborder([0.1, 0.1, 1],vscale)));
    this.cubes.push(new Border(this.scaledborder([0, 0, 0.5], vscale), this.scaledborder([1.1, 0.1, 0.1],vscale)));
    this.cubes.push(new Border(this.scaledborder([0, 0, -0.5], vscale), this.scaledborder([1.1, 0.1, 0.1],vscale)));

    // initialize before AfterViewInit
    this.shapes = this.cubes.map(item => {
      return {
        type: 'Box',
        position: item.position,
        args: item.scale
      } as BodyProps & { type: ShapeType; };
    })
  }

  ngOnDestroy(): void {
  }


}
