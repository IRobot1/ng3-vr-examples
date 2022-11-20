import { Component, NgZone, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Intersection, Object3D } from 'three';
import { NgtTriple } from '@angular-three/core';

import { CameraService } from '../../app/camera.service';
import { PanelSetting } from '../../app/home/home.component';

@Component({
  templateUrl: 'forum.component.html',
})
export class ForumExamples implements OnInit {
  examples1 = [
    { asset: 'instcubes', text: 'Instance Cubes' },
  ]

  examples2 = [
    //{ asset: 'htmlgui', text: 'GUI Window' },
  ]

  panels1: Array<PanelSetting> = [];
  panels2: Array<PanelSetting> = [];

  selectable: Array<Object3D> = [];


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private zone: NgZone,
    private camera: CameraService,
  ) {
    // restore defaults in case they changed
    this.camera.position = [0, 2, 4];
    this.camera.fov = 55;

    let angle = 360 / this.examples1.length;

    this.examples1.forEach((item, index) => {
      const position = [0, 0, 0] as NgtTriple;
      const rotation = angle * index;

      const panel = new PanelSetting(position, rotation, item.asset, item.text)
      this.panels1.push(panel);
    });

    //angle = 360 / this.examples2.length;

    //this.examples2.forEach((item, index) => {
    //  const position = [0, 0, 0] as NgtTriple;
    //  const rotation = angle * index;

    //  const panel = new PanelSetting(position, rotation, item.asset, item.text)
    //  this.panels2.push(panel);
    //});
  }

  ngOnInit(): void {
    const example = this.route.snapshot.queryParams['example'];
    if (example) {
      const timer = setTimeout(() => {
        this.router.navigate(['/' + example]);
        clearTimeout(timer);
      }, 1000);
    }
  }

  intersected(intersect: Intersection) {
    this.selected(intersect.object);
  }

  selected(object: Object3D) {
    const asset = object.userData['asset'];
    if (asset) {
      this.zone.run(() => {
        this.router.navigate([asset]);
      });
    }
  }


  highlight(intersect: Intersection) {
    intersect.object.scale.multiplyScalar(1.02)
  }

  unhighlight(intersect: Intersection) {
    intersect.object.scale.multiplyScalar(0.98)
  }
}
