import { Component, OnInit } from "@angular/core";

import { Color, InstancedMesh, MathUtils, Matrix4, Vector3 } from "three";
import { NgtTriple } from "@angular-three/core";

import GUI from "lil-gui";

//
// code adapted from https://www.youtube.com/watch?v=0Kx4Y9TVMGg&t=621s
//

class Cell {
  constructor(public position: Vector3, public color: Color, public velocity = new Vector3()) { }
}

@Component({
  templateUrl: './artificial-life.component.html',
})
export class ArtificialLifeExample implements OnInit {
  public gui!: GUI;

  data: Array<Cell> = [];

  volume = 3;
  position = [0, this.volume, 0] as NgtTriple;
  size = 0.01


  count = 500
  red = this.create(this.count, new Color().setStyle('red'));
  yellow = this.create(this.count, new Color().setStyle('yellow'));
  green = this.create(this.count, new Color().setStyle('green'));

  //get randomInVolume() { return Math.random() * this.volume; }
  get randomInVolume() { return -this.volume + Math.random() * this.volume * 2; }

  create(count: number, color: Color): Array<Cell> {
    const particles = new Array(count).fill(0).map((d, index) => {
      return new Cell(
        new Vector3(this.randomInVolume, this.randomInVolume, this.randomInVolume),
        color
      );
    });
    this.data.push(...particles);
    return particles;
  }

  rule(particles1: Array<Cell>, particles2: Array<Cell>, g: number) {
    particles1.forEach(p1 => {
      let fx = 0;
      let fy = 0;
      let fz = 0;
      particles2.forEach(p2 => {
        const dx = p1.position.x - p2.position.x;
        const dy = p1.position.y - p2.position.y;
        const dz = p1.position.z - p2.position.z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist > 0 && dist < 0.3 * this.volume) {
          let F = g * this.size / dist;
          fx += (F * dx);
          fy += (F * dy);
          fz += (F * dz);
        }
      });
      p1.velocity.x = (p1.velocity.x + fx) * 0.5;
      p1.velocity.y = (p1.velocity.y + fy) * 0.5;
      p1.velocity.z = (p1.velocity.z + fz) * 0.5;

      p1.position.x += p1.velocity.x;
      p1.position.y += p1.velocity.y;
      p1.position.z += p1.velocity.z;

      // reverse velocity at edges
      if (p1.position.x <= -this.volume || p1.position.x >= this.volume) p1.velocity.x = -p1.velocity.x;
      if (p1.position.y <= -this.volume || p1.position.y >= this.volume) p1.velocity.y = -p1.velocity.y;
      if (p1.position.z <= -this.volume || p1.position.z >= this.volume) p1.velocity.z = -p1.velocity.z;

      p1.position.x = MathUtils.clamp(p1.position.x, -this.volume, this.volume);
      p1.position.y = MathUtils.clamp(p1.position.y, -this.volume, this.volume);
      p1.position.z = MathUtils.clamp(p1.position.z, -this.volume, this.volume);
    });
  }

  inst!: InstancedMesh;

  redred = 0.1;
  yellowred = 0.15;
  greengreen = -0.7;
  greenred = -0.2;
  redgreen = -0.1;

  tick(inst: InstancedMesh) {
    this.rule(this.red, this.red, this.redred);
    this.rule(this.yellow, this.red, this.yellowred);
    this.rule(this.green, this.green, this.greengreen);
    this.rule(this.green, this.red, this.greenred);
    this.rule(this.red, this.green, this.redgreen);

    this.data.forEach((item, index) => {
      const matrix = new Matrix4();
      matrix.setPosition(item.position);
      inst.setMatrixAt(index, matrix);
      inst.setColorAt(index, item.color);
    });
    inst.instanceMatrix.needsUpdate = true;
  }

  reset() {
    console.warn('reset')
    this.redred = 0.1;
    this.yellowred = 0.15;
    this.greengreen = -0.7;
    this.greenred = -0.2;
    this.redgreen = -0.1;
    this.gui.reset();
  }

  ngOnInit(): void {
    const gui = new GUI({ width: 300 });
    gui.add(this, 'size', 0.001, 0.03, 0.001).name('Particle Size');
    gui.add(this, 'redred', -0.2, 0.2, 0.01).name('Red / Red Interaction');
    gui.add(this, 'yellowred', -0.5, 0.5, 0.01).name('Yellow / Red Interaction');
    gui.add(this, 'greengreen', -2, 2, 0.01).name('Green / Green Interaction');
    gui.add(this, 'greenred', -2, 2, 0.01).name('Green / Red Interaction');
    gui.add(this, 'redgreen', -2, 2, 0.01).name('Red / Green Interaction');
    gui.add(this, 'reset').name('Reset to Original');

    this.gui = gui;
  }
}
