import { Component } from "@angular/core";

import { Group, MeshBasicMaterial } from "three";
import { NgtStore } from "@angular-three/core";

import { HTMLColor, HTMLGUI } from "../../htmlgui";
import { HTMLController } from "../../htmlgui/lib/htmlcontroller";
import { GUIFactory } from "../../guibase";
import { ThreeGUI } from "../../threegui/lib/threegui";
import { ThreeController } from "../../threegui/lib/threecontroller";
import { Font, FontLoader } from "three-stdlib";

class HTMLTest extends HTMLController {
  private _test!: string;
  thing(test: string) {
    this._test = test;
  }
}

class ThreeTest extends ThreeController {
  private _test!: string;
  thing(test: string) {
    this._test = test;
  }
}

@Component({
  templateUrl: './gui-room.component.html',
})
export class GUIRoomExample {
  public parameters = {
    bool: true,
    radius: 0.6,
    tube: 0.2,
    tubularSegments: 150,
    radialSegments: 20,
    p: 2,
    q: 3,
    xcolor: 1,
    test: 'test',
    stop: (e: any) => { console.warn(e) }
  };

  group = new Group();

  constructor(
    private store: NgtStore
  ) {
    //GUIFactory.register('test', () => { return new HTMLTest() });
    GUIFactory.register('test', () => { return new ThreeTest() });

    //const titlematerial = new MeshBasicMaterial({ color: 0x00ff00 });

    const loader = new FontLoader();

    loader.load('assets/helvetiker_regular.typeface.json', (font: Font) => {

      const gui = new ThreeGUI({ font: font });
      const folder = gui.addFolder('Folder');

      const folderParams = {
        number: 0.5,
        boolean: false,
        color: '#0cf',
        function() { console.log('hi') }
      };

      folder.add(folderParams, 'number', 0, 1);
      folder.add(folderParams, 'boolean');
      folder.addColor(folderParams, 'color');
      folder.add(folderParams, 'function');

      const params = {
        options: 10,
        boolean: true,
        string: 'three-gui',
        number: 0,
        color: '#aa00ff',
        function() { console.log('hi') }
      };

      gui.add(params, 'options', { Small: 1, Medium: 10, Large: 100 });
      gui.add(params, 'boolean');
      gui.add(params, 'string');
      gui.add(params, 'number');
      gui.addColor(params, 'color');
      gui.add(params, 'function').name('Custom Name');

      gui.group.position.y = 2;
      scene.add(gui.group)
    });

    //gui.add(this.parameters, 'bool');
    //gui.add(this.parameters, 'test');
    //gui.add(this.parameters, 'stop');
    //gui.add(this.parameters, 'radius', 0.0, 1.0);
    //gui.add(this.parameters, 'tube', 0.0, 1.0);
    //gui.add(this.parameters, 'tubularSegments', 10, 150, 1);
    //gui.add(this.parameters, 'radialSegments', 2, 20, 1);
    //gui.add(this.parameters, 'p', 1, 10, 1);
    //gui.add(this.parameters, 'q', 0, 10, 1);
    //gui.addColor(this.parameters, 'xcolor', 2);
    //(<HTMLColor>gui.addCustom('color', this.parameters, 'xcolor')).rgbScale(2);
    ////(<HTMLTest>gui.addCustom('test', this.parameters, 'test')).thing('test');
    //(<ThreeTest>gui.addCustom('test', this.parameters, 'test')).thing('test');


    //const mesh = new HTMLMesh(gui.domElement);
    //mesh.position.x = - 0.75;
    //mesh.position.y = 1;
    //mesh.position.z = - 1;
    //mesh.rotation.y = Math.PI / 4;
    //mesh.scale.setScalar(2);

    const scene = this.store.get(s => s.scene);
    scene.add(this.group);

    //this.group.add(mesh);

    //this.mesh = mesh;
  }

}
