import { NgtStore } from "@angular-three/core";
import { Component } from "@angular/core";
import { Group } from "three";
import ColorController from "./color-controller";

import { GUI, GUIFactory } from "./gui";


@Component({
  templateUrl: './gui-room.component.html',
})
export class GUIRoomExample {
  public parameters = {
    radius: 0.6,
    tube: 0.2,
    tubularSegments: 150,
    radialSegments: 20,
    p: 2,
    q: 3,
    xcolor: 1,
  };

  group = new Group();

  constructor(
    private store: NgtStore
  ) {
    GUIFactory.register('color', () => { return new ColorController() });

    const gui = new GUI();
    gui.add(this.parameters, 'radius', 0.0, 1.0);
    gui.add(this.parameters, 'tube', 0.0, 1.0);
    gui.add(this.parameters, 'tubularSegments', 10, 150, 1);
    gui.add(this.parameters, 'radialSegments', 2, 20, 1);
    gui.add(this.parameters, 'p', 1, 10, 1);
    gui.add(this.parameters, 'q', 0, 10, 1);
    gui.addColor(this.parameters, 'color', 2);
    (<ColorController>gui.addCustom('color', this.parameters, 'xcolor')).rgbScale(2);

    
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
//  constructor() {
//    const myObject = this.parameters;

//    const gui = new GUI();

//    gui.add(myObject, 'myBoolean');  // Checkbox
//    gui.add(myObject, 'myFunction'); // Button
//    gui.add(myObject, 'myString');   // Text Field
//    gui.add(myObject, 'myNumber');   // Number Field

//    // Add sliders to number fields by passing min and max
//    gui.add(myObject, 'myNumber', 0, 1);
//    gui.add(myObject, 'myNumber', 0, 100, 2); // snap to even numbers

//    // Create dropdowns by passing an array or object of named values
//    gui.add(myObject, 'myNumber', [0, 1, 2]);
//    gui.add(myObject, 'myNumber', { Label1: 0, Label2: 1, Label3: 2 });

//    // Chainable methods
//    gui.add(myObject, 'myProperty')
//      .name('Custom Name')
//      .onChange(value => {
//        console.log(value);
//      });

//    gui.addColor(myObject, 'customRange', 255);

//    const folder = gui.addFolder('Position');
//    folder.add(myObject, 'x');

//    gui.onFinishChange(event => {
//      event.object     // object that was modified
//      event.property   // string, name of property
//      event.value      // new value of controller
//      event.controller // controller that was modified
//    });
//  }
}
