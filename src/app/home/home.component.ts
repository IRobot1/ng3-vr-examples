import { Component, NgZone, OnInit } from '@angular/core';

import { NgtTriple } from '@angular-three/core';
import { CameraService } from '../camera.service';
import { Intersection, Object3D } from 'three';
import { ActivatedRoute, Router } from '@angular/router';

class PanelSetting {
  constructor(public position: NgtTriple, public rotation: number, public asset: string, public text: string) { }
}

@Component({
  templateUrl: 'home.component.html',
})
export class HomeComponent implements OnInit {
  examples1 = [
    { asset: 'ballshooter', text: 'Ball Shooter' },
    { asset: 'dragging', text: 'Dragging' },
    { asset: 'handinput', text: 'Hand input' },
    { asset: 'teleport', text: 'Teleport' },
    { asset: 'bat', text: 'Physics Bat' },
    { asset: 'inspect', text: 'Grab / Inspect' },
    { asset: 'drumstick', text: 'Keyboard / Drumstick' },
    { asset: 'touchpad', text: 'Touchpad Movement' },
    { asset: 'joystick', text: 'Joystick Movement' },
    { asset: 'behaviors', text: 'Toggle Controller Behaviors' },
    { asset: 'studio', text: 'Lights, Camera, Action' },
    { asset: 'paint', text: 'Paint' },
    { asset: 'scale', text: 'World Scale' },
    { asset: 'morphwall', text: 'Morphing Wall' },
  ]

  examples2 = [
    { asset: 'htmlgui', text: 'GUI Window' },
    { asset: 'buttons', text: 'Buttons' },
    { asset: 'forcelayout', text: 'Force Layout' },
    { asset: 'spirograph', text: 'Spirograph' },
    { asset: 'artlife', text: 'Particle Life' },
    { asset: 'svg', text: 'SVG Icons' },
    { asset: 'graph', text: 'Directed Graph Layout' },
    { asset: 'collisions', text: 'Collisions' },
    { asset: 'loading', text: 'Loading' },
    { asset: 'stats', text: 'Stats' },
    { asset: 'jdenticon', text: 'Jdenticon' },
    { asset: 'dicebear', text: 'DiceBear Avatars' },
    { asset: 'pexelsphoto', text: 'Pexels Photo' },
  ]

  examples3 = [
    { asset: 'datagrid', text: 'Data Grids' },
    { asset: 'three-gui', text: 'Ng3 GUI' },
    { asset: 'lists', text: 'Lists' },
    { asset: 'flat-ui', text: 'Flat UI' },
    { asset: 'kanban', text: 'Kanban Board' },
    { asset: 'actions', text: 'Actions' },
    { asset: 'patheditor', text: 'Path Editor' },
    { asset: 'pexelsvideo', text: 'Pexels Video' },
    { asset: 'shapeware-shapes', text: 'Shapeware Shapes' },
    { asset: 'file-browser', text: 'File/Folder Browser' },
    { asset: 'charts', text: 'Charts' },
  ]

  panels1: Array<PanelSetting> = [];
  panels2: Array<PanelSetting> = [];
  panels3: Array<PanelSetting> = [];

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

    angle = 360 / this.examples2.length;

    this.examples2.forEach((item, index) => {
      const position = [0, 0, 0] as NgtTriple;
      const rotation = angle * index;

      const panel = new PanelSetting(position, rotation, item.asset, item.text)
      this.panels2.push(panel);
    });

    angle = 360 / this.examples3.length;

    this.examples3.forEach((item, index) => {
      const position = [0, 0, 0] as NgtTriple;
      const rotation = angle * index;

      const panel = new PanelSetting(position, rotation, item.asset, item.text)
      this.panels3.push(panel);
    });
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
