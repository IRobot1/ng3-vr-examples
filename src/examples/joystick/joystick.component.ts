import { Component, Input } from "@angular/core";

import { DoubleSide, Material, Mesh, Object3D, RingBufferGeometry, ShaderMaterial, Side, Texture, TextureLoader, Vector3 } from "three";

@Component({
  templateUrl: './joystick.component.html',
})
export class JoystickExample {
  enabled = true;
  side: Side = DoubleSide

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
  saturnRingsMap!: Texture;
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
    this.saturnRingsMap = textureLoader.load('assets/planets/saturn_ring_alpha_2048.png');
    this.saturnRingsMap.rotation = Math.PI / 2;
    this.saturnRingsMap.repeat.set(2,2)

    this.uranusMap = textureLoader.load('assets/planets/uranus_1024.jpg');
    this.neptuneMap = textureLoader.load('assets/planets/neptune_1024.jpg');
  }

  rotateearth(planet: Object3D) {
    planet.rotation.y += 1 / 500;
  }

  rotatemoon(planet: Object3D) {
    planet.rotation.y += 1 / 28 / 500;
  }
}
