import { Component } from "@angular/core";
import { BufferGeometry, CircleGeometry, Mesh, MeshBasicMaterial, MeshStandardMaterial, PlaneGeometry, RingGeometry } from "three";

class AnimateContext {
  constructor(public skip = 10) { }
  startindex = 0;
  delay = this.skip;
}

@Component({
  templateUrl: './loading.component.html',
})
export class LoadingExample {

  blackmaterial!: MeshStandardMaterial;
  color1material!: MeshStandardMaterial;
  color2material!: MeshStandardMaterial;
  color3material!: MeshStandardMaterial;


  spk0geometry!: BufferGeometry;
  spk1geometry!: BufferGeometry;
  spk2geometry!: BufferGeometry;
  spk3geometry!: BufferGeometry;
  spk4geometry!: BufferGeometry;
  spk5geometry!: BufferGeometry;
  spk6geometry!: BufferGeometry;

  spk7ageometry!: BufferGeometry;
  spk7bgeometry!: BufferGeometry;
  spk8geometry!: BufferGeometry;
  spk9geometry!: BufferGeometry;

  ring1geometry!: BufferGeometry;
  ring2geometry!: BufferGeometry;
  ring3geometry!: BufferGeometry;

  ring4geometry!: BufferGeometry;
  ring5geometry!: BufferGeometry;
  ring6geometry!: BufferGeometry;

  ring7geometry!: BufferGeometry;

  ring10geometry!: BufferGeometry;

  constructor() {
    this.blackmaterial = new MeshStandardMaterial({ color: 'black' });
    this.color1material = new MeshStandardMaterial({ color: this.colors[2] });
    this.color2material = new MeshStandardMaterial({ color: this.colors[4] });
    this.color3material = new MeshStandardMaterial({ color: this.colors[0] });

    this.spk0geometry = new CircleGeometry(0.05, 3);
    this.spk1geometry = new PlaneGeometry(0.06, 0.03);
    this.spk2geometry = new PlaneGeometry(0.04, 0.005);
    this.spk3geometry = new RingGeometry(0.1, 0.15, 1, 1, 0, Math.PI / 6);
    this.spk4geometry = new CircleGeometry(0.03, 64);
    this.spk6geometry = new RingGeometry(0.0, 0.14, 1, 1, 0, Math.PI / 7);

    this.spk7ageometry = new RingGeometry(0.13, 0.15, 32, 1);
    this.spk7bgeometry = new PlaneGeometry(0.02, 0.02);

    this.spk8geometry = new CircleGeometry(0.03, 6);
    this.spk9geometry = new CircleGeometry(0.03, 66);

    this.ring1geometry = new RingGeometry(0.11, 0.12, 64);
    this.ring2geometry = new RingGeometry(0.12, 0.17, 64, 1, 0, Math.PI * 1.5);
    this.ring3geometry = new RingGeometry(0.17, 0.18, 64);

    const size = 1.5
    this.ring4geometry = new RingGeometry(0.05, 0.06, 64, 1, 0, Math.PI * size);
    this.ring5geometry = new RingGeometry(0.08, 0.09, 64, 1, 0, Math.PI * size);
    this.ring6geometry = new RingGeometry(0.11, 0.12, 64, 1, 0, Math.PI * size);

    this.ring7geometry = new RingGeometry(0.11, 0.12, 64);

    this.ring10geometry = new RingGeometry(0.14, 0.17, 10);
  }

  colors: Array<string> = ['#ff1a1a', '#ff3333', '#ff4d4d', '#ff6666', '#ff8080', '#ff9999', '#ffb3b3', '#ffcccc']
  colored = false;

  skp1context = new AnimateContext();
  skp4context = new AnimateContext();
  skp5context = new AnimateContext();
  skp8context = new AnimateContext();

  animate8colors(meshes: Array<Mesh>, context: AnimateContext) {
    if (this.colored) {
      // skip every 10 frames
      if (context.delay-- == 0) {
        let nextindex = context.startindex;
        meshes.forEach((mesh, index) => {
          if (nextindex++ > meshes.length - 1) nextindex = 0;
          // rotate through colors
          const color = this.colors[nextindex];
          (mesh.material as MeshStandardMaterial).color.setStyle(color);
        });

        if (context.startindex++ >= meshes.length - 1) context.startindex = 0;
        context.delay = context.skip;
      }
    }
    else {
      // assign different color shades to meshes
      meshes.forEach((mesh, index) => {
        const color = this.colors[index];
        mesh.material = new MeshStandardMaterial({ color });
      })
      this.colored = true;
    }
  }

  generated = false;
  generate8shapes(meshes: Array<Mesh>) {
    if (!this.generated) {
      // create 8 circles of slightly larger sizes
      meshes.forEach((mesh, index) => {
        mesh.geometry = new CircleGeometry(0.003 * (index + 4), 64);
      })
      this.generated = true;
    }
  }


  animatering(object: Mesh, delta: number) {
    object.rotation.z += delta;
  }

}
