import { Component, Input, OnInit } from "@angular/core";

import { NgtTriple } from "@angular-three/core";
import { AdditiveBlending, BufferAttribute, BufferGeometry, DynamicDrawUsage, LineSegments, Mesh, Points, Vector3 } from "three";

//
// adapted to NGT from https://github.com/mrdoob/three.js/blob/master/examples/webgl_buffergeometry_drawrange.html
//

@Component({
  selector: 'drawrange',
  templateUrl: './drawrange.component.html',
})
export class DrawRangeComponent implements OnInit {
  @Input() position!: NgtTriple;
  @Input() boxsize = 0.5;
  @Input() maxParticleCount = 50;

  blending = AdditiveBlending;

  linesMesh!: LineSegments;
  pointCloud!: Points;

  private positions!: Float32Array;
  private colors!: Float32Array;

  private effectController = {
    showDots: true,
    showLines: true,
    minDistance: 0.25,
    limitConnections: true,
    maxConnections: 3,
    particleCount: 50
  };

  private particlePositions!: Float32Array;

  ngOnInit(): void {
    this.effectController.minDistance = this.boxsize / 2;

    const segments = this.maxParticleCount * this.maxParticleCount;

    this.positions = new Float32Array(segments * 3);
    this.colors = new Float32Array(segments * 3);

  }

  particlesready(particles: BufferGeometry) {
    this.particlePositions = new Float32Array(this.maxParticleCount * 3);

    const r = this.boxsize / 2;

    for (let i = 0; i < this.maxParticleCount; i++) {

      const x = Math.random() * r - r / 2;
      const y = Math.random() * r - r / 2;
      const z = Math.random() * r - r / 2;

      this.particlePositions[i * 3] = x;
      this.particlePositions[i * 3 + 1] = y;
      this.particlePositions[i * 3 + 2] = z;

      // add it to the geometry
      this.particlesData.push({
        velocity: new Vector3(-r + Math.random() * 2 * r, - r + Math.random() * 2 * r, - r + Math.random() * 2 * r),
        numConnections: 0
      });

    }
    particles.setDrawRange(0, this.effectController.particleCount);
    particles.setAttribute('position', new BufferAttribute(this.particlePositions, 3).setUsage(DynamicDrawUsage));

  }

  linesready(geometry: BufferGeometry) {
    console.warn('lines ready')
    geometry.setAttribute('position', new BufferAttribute(this.positions, 3).setUsage(DynamicDrawUsage));
    geometry.setAttribute('color', new BufferAttribute(this.colors, 3).setUsage(DynamicDrawUsage));

    geometry.computeBoundingSphere();

    geometry.setDrawRange(0, 0);
  }

  private particlesData: Array<{ velocity: Vector3, numConnections: number }> = [];

  tick() {

    let vertexpos = 0;
    let colorpos = 0;
    let numConnected = 0;

    for (let i = 0; i < this.effectController.particleCount; i++) {
      this.particlesData[i].numConnections = 0;
    }

    const rHalf = this.boxsize / 2;
    const factor = 0.01;

    for (let i = 0; i < this.effectController.particleCount; i++) {

      // get the particle
      const particleData = this.particlesData[i];

      this.particlePositions[i * 3] += particleData.velocity.x * factor;
      this.particlePositions[i * 3 + 1] += particleData.velocity.y * factor;
      this.particlePositions[i * 3 + 2] += particleData.velocity.z * factor;

      if (this.particlePositions[i * 3 + 1] < - rHalf || this.particlePositions[i * 3 + 1] > rHalf)
        particleData.velocity.y = - particleData.velocity.y;

      if (this.particlePositions[i * 3] < - rHalf || this.particlePositions[i * 3] > rHalf)
        particleData.velocity.x = - particleData.velocity.x;

      if (this.particlePositions[i * 3 + 2] < - rHalf || this.particlePositions[i * 3 + 2] > rHalf)
        particleData.velocity.z = - particleData.velocity.z;

      if (this.effectController.limitConnections && particleData.numConnections >= this.effectController.maxConnections)
        continue;

      // Check collision
      for (let j = i + 1; j < this.effectController.particleCount; j++) {

        const particleDataB = this.particlesData[j];
        if (this.effectController.limitConnections && particleDataB.numConnections >= this.effectController.maxConnections)
          continue;

        const dx = this.particlePositions[i * 3] - this.particlePositions[j * 3];
        const dy = this.particlePositions[i * 3 + 1] - this.particlePositions[j * 3 + 1];
        const dz = this.particlePositions[i * 3 + 2] - this.particlePositions[j * 3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist < this.effectController.minDistance) {

          particleData.numConnections++;
          particleDataB.numConnections++;

          const alpha = 1.0 - dist / this.effectController.minDistance;

          this.positions[vertexpos++] = this.particlePositions[i * 3];
          this.positions[vertexpos++] = this.particlePositions[i * 3 + 1];
          this.positions[vertexpos++] = this.particlePositions[i * 3 + 2];

          this.positions[vertexpos++] = this.particlePositions[j * 3];
          this.positions[vertexpos++] = this.particlePositions[j * 3 + 1];
          this.positions[vertexpos++] = this.particlePositions[j * 3 + 2];

          this.colors[colorpos++] = alpha;
          this.colors[colorpos++] = alpha;
          this.colors[colorpos++] = alpha;

          this.colors[colorpos++] = alpha;
          this.colors[colorpos++] = alpha;
          this.colors[colorpos++] = alpha;

          numConnected++;

        }

      }

    }


    this.linesMesh.geometry.setDrawRange(0, numConnected * 2);
    this.linesMesh.geometry.attributes['position'].needsUpdate = true;
    this.linesMesh.geometry.attributes['color'].needsUpdate = true;

    this.pointCloud.geometry.attributes['position'].needsUpdate = true;
  }
}
