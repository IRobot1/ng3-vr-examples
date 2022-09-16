import { Component, Input } from "@angular/core";
import { Mesh, Object3D, Texture, TextureLoader } from "three";

@Component({
  templateUrl: './joystick.component.html',
})
export class JoystickExample {
  enabled = true;

  surfaceMap!: Texture;
  metalnessMap!: Texture;
  normalMap!: Texture;
  moonMap!: Texture;

  sunMap!: Texture;
  mercuryMap!: Texture;
  venusMap!: Texture;
  marsMap!: Texture;
  jupiterMap!: Texture;
  saturnMap!: Texture;
  uranusMap!: Texture;
  neptuneMap!: Texture;

  constructor() {
    // uncomment to test enable/disable at runtime
    //setInterval(() => { this.enabled = !this.enabled }, 5000);

    // textures taken from https://github.com/mrdoob/three.js/tree/master/examples/textures/planets
    const textureLoader = new TextureLoader();
    this.surfaceMap = textureLoader.load('assets/planets/earth_atmos_2048.jpg');
    this.metalnessMap = textureLoader.load('assets/planets/earth_specular_2048.jpg');
    this.normalMap = textureLoader.load('assets/planets/earth_normal_2048.jpg');
    this.moonMap = textureLoader.load('assets/planets/moon_1024.jpg');

    this.sunMap = textureLoader.load('assets/planets/sun_2048.jpg');
    this.mercuryMap = textureLoader.load('assets/planets/mercury_1024.jpg');
    this.venusMap = textureLoader.load('assets/planets/venus_1024.jpg');
    this.marsMap = textureLoader.load('assets/planets/mars_1024.jpg');
    this.jupiterMap = textureLoader.load('assets/planets/jupiter_1024.jpg');
    this.saturnMap = textureLoader.load('assets/planets/saturn_1024.jpg');
    this.uranusMap = textureLoader.load('assets/planets/uranus_1024.jpg');
    this.neptuneMap = textureLoader.load('assets/planets/neptune_1024.jpg');
  }

  @Input() slowfactor = 500;
  rotateearth(planet: Object3D) {
    planet.rotation.y += 1 / this.slowfactor;
  }

  rotatemoon(planet: Object3D) {
    planet.rotation.y += 1 / 28 / this.slowfactor;
  }
}
