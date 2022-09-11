import { Component, OnDestroy, OnInit } from "@angular/core";

import { Color, InstancedMesh, MathUtils, Matrix4, Mesh, Vector3 } from "three";

import GUI from "lil-gui";

//
// code adapted from https://www.youtube.com/watch?v=0Kx4Y9TVMGg&t=621s
//

type ParticleType = 'red' | 'green' | 'blue' | 'yellow';

class Cell {
  public color: Color;
  public velocity = new Vector3();

  constructor(public position: Vector3, public type: ParticleType) {
    this.color = new Color().setStyle(type)
  }
}

@Component({
  templateUrl: './artificial-life.component.html',
})
export class ArtificialLifeExample implements OnInit, OnDestroy {
  public maingui!: GUI;
  public redgui!: GUI;
  public greengui!: GUI;
  public bluegui!: GUI;
  public yellowgui!: GUI;

  public meshes: Array<Mesh> = [];

  public data: Array<Cell> = [];

  public volume = 3;
  public size = 0.01


  parameters = {
    redred: 0.1,
    redgreen: -0.1,
    redblue: 0,
    redyellow: 0,

    greengreen: -0.7,
    greenred: -0.2,
    greenblue: 0,
    greenyellow: 0,

    blueblue: -0.1,
    bluered: -0.2,
    bluegreen: 0,
    blueyellow: 0,

    yellowyellow: 0,
    yellowred: 0.15,
    yellowgreen: 0,
    yellowblue: 0,
  }

  count = 400;
  red = this.create(this.count, 'red');
  green = this.create(this.count, 'green');
  blue = this.create(this.count, 'blue');
  yellow = this.create(this.count, 'yellow');

  //get randomInVolume() { return Math.random() * this.volume; }
  get randomInVolume() { return -this.volume + Math.random() * this.volume * 2; }

  create(count: number, type: ParticleType): Array<Cell> {
    const particles = new Array(count).fill(0).map(() => {
      return new Cell(
        new Vector3(this.randomInVolume, this.randomInVolume, this.randomInVolume),
        type
      );
    });
    this.data.push(...particles);
    return particles;
  }

  rule(particles1: Array<Cell>, particles2: Array<Cell>, gravity: number) {
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
          let F = gravity * this.size * 2 / dist;
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

      // clamp position to edges
      p1.position.x = MathUtils.clamp(p1.position.x, -this.volume, this.volume);
      p1.position.y = MathUtils.clamp(p1.position.y, -this.volume, this.volume);
      p1.position.z = MathUtils.clamp(p1.position.z, -this.volume, this.volume);
    });
  }

  inst!: InstancedMesh;

  timer!: any;
  update = true;

  // called from instanced mesh ready()
  compute() {
    // run the compute slower than the frame rate
    this.timer = setInterval(() => {
      this.rule(this.red, this.red, this.parameters.redred);
      this.rule(this.red, this.green, this.parameters.redgreen);
      this.rule(this.red, this.blue, this.parameters.redblue);
      this.rule(this.red, this.yellow, this.parameters.redyellow);

      this.rule(this.green, this.green, this.parameters.greengreen);
      this.rule(this.green, this.red, this.parameters.greenred);
      this.rule(this.green, this.blue, this.parameters.greenblue);
      this.rule(this.green, this.yellow, this.parameters.greenyellow);

      this.rule(this.blue, this.blue, this.parameters.blueblue);
      this.rule(this.blue, this.red, this.parameters.bluered);
      this.rule(this.blue, this.green, this.parameters.bluegreen);
      this.rule(this.blue, this.yellow, this.parameters.blueyellow);

      this.rule(this.yellow, this.yellow, this.parameters.yellowyellow);
      this.rule(this.yellow, this.red, this.parameters.yellowred);
      this.rule(this.yellow, this.green, this.parameters.yellowgreen);
      this.rule(this.yellow, this.blue, this.parameters.yellowblue);

      this.update = true;
    }, 1000 / 24)
  }

  tick(inst: InstancedMesh) {
    if (this.update) {
      this.data.forEach((item, index) => {
        const matrix = new Matrix4();
        matrix.setPosition(item.position);
        inst.setMatrixAt(index, matrix);
        inst.setColorAt(index, item.color);
      });
      inst.instanceMatrix.needsUpdate = true;
      this.update = false;
    }
  }

  reset() {
    this.redgui.reset();
    this.greengui.reset();
    this.bluegui.reset();
    this.yellowgui.reset();
  }

  interesting1() {
    this.parameters.redred = -0.1;
    this.parameters.redgreen = -0.97;
    this.parameters.redblue = 0;
    this.parameters.redyellow = 0;

    this.parameters.greengreen = -0.7;
    this.parameters.greenred = 0.78;
    this.parameters.greenblue = 0;
    this.parameters.greenyellow = -0.4;

    this.parameters.blueblue = 0;
    this.parameters.bluered = 0;
    this.parameters.bluegreen = 0;
    this.parameters.blueyellow = 0;

    this.parameters.yellowyellow = 0.02;
    this.parameters.yellowred = 0.15;
    this.parameters.yellowgreen = -0.29;
    this.parameters.yellowblue = 0;

    this.redgui.controllers.forEach(c => c.updateDisplay());
    this.greengui.controllers.forEach(c => c.updateDisplay());
    this.bluegui.controllers.forEach(c => c.updateDisplay());
    this.yellowgui.controllers.forEach(c => c.updateDisplay());
  }

  ngOnInit(): void {
    const min = -2;
    const max = 2;
    const delta = 0.01;

    let gui = new GUI({ width: 300 });
    gui.title('Settings')
    gui.add(this, 'size', 0.001, 0.03, 0.001).name('Particle Size');
    gui.add(this, 'interesting1').name('Interesting');
    gui.add(this, 'reset').name('Reset to Original');
    this.maingui = gui;

    gui = new GUI({ width: 300 });
    gui.title('Red Particles')
    gui.add(this.parameters, 'redred', min, max, delta).name('Red / Red Gravity');
    gui.add(this.parameters, 'redgreen', min, max, delta).name('Red / Green Gravity');
    gui.add(this.parameters, 'redblue', min, max, delta).name('Red / Blue Gravity');
    gui.add(this.parameters, 'redyellow', min, max, delta).name('Red / Yellow Gravity');
    this.redgui = gui;

    gui = new GUI({ width: 300 });
    gui.title('Green Particles')
    gui.add(this.parameters, 'greengreen', min, max, delta).name('Green / Green Gravity');
    gui.add(this.parameters, 'greenred', min, max, delta).name('Green / Red Gravity');
    gui.add(this.parameters, 'greenblue', min, max, delta).name('Green / Blue Gravity');
    gui.add(this.parameters, 'greenyellow', min, max, delta).name('Green / Yellow Gravity');
    this.greengui = gui;

    gui = new GUI({ width: 300 });
    gui.title('Blue Particles')
    gui.add(this.parameters, 'blueblue', min, max, delta).name('Blue / Blue Gravity');
    gui.add(this.parameters, 'bluered', min, max, delta).name('Blue / Red Gravity');
    gui.add(this.parameters, 'bluegreen', min, max, delta).name('Blue / Green Gravity');
    gui.add(this.parameters, 'blueyellow', min, max, delta).name('Blue / Yellow Gravity');
    this.bluegui = gui;

    gui = new GUI({ width: 300 });
    gui.title('Yellow Particles')
    gui.add(this.parameters, 'yellowyellow', min, max, delta).name('Yellow / Yellow Gravity');
    gui.add(this.parameters, 'yellowred', min, max, delta).name('Yellow / Red Gravity');
    gui.add(this.parameters, 'yellowgreen', min, max, delta).name('Yellow / Green Gravity');
    gui.add(this.parameters, 'yellowblue', min, max, delta).name('Yellow / Blue Gravity');
    this.yellowgui = gui;

  }

  ngOnDestroy(): void {
    clearInterval(this.timer);
  }
}
