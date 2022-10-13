import { NgtTriple } from "@angular-three/core";
import { Component, OnInit } from "@angular/core";
import { Mesh } from "three";
import { CameraService } from "../../app/camera.service";
import { InteractiveObjects } from "../flat-ui/interactive-objects";
import { FlatGUI } from "./flat-gui";


@Component({
  templateUrl: './three-gui.component.html',
})
export class ThreeGUIExample implements OnInit {
  public parameters = {
    radius: 0.6,
    tube: 0.2,
    tubularSegments: 150,
    radialSegments: 20,
    p: 2,
    q: 3
  };

  public gui!: FlatGUI;
  public basic!: FlatGUI;
  public guiscale = [0.5, 0.5, 0.5] as NgtTriple;

  public meshes: Array<Mesh> = [];

  selectable = new InteractiveObjects();

  constructor(
    public camera: CameraService,
  ) {
    this.camera.position = [0, 1, 0.5];
    this.camera.lookAt = [0, 1, -3];
    this.camera.fov = 55;


  }

  ngOnInit(): void {
    const gui = new FlatGUI({ width: 300 });
    gui.add(this.parameters, 'radius', 0.1, 1.0, 0.01);
    gui.add(this.parameters, 'tube', 0.01, 1.0, 0.01);
    gui.add(this.parameters, 'tubularSegments', 10, 150, 1);
    gui.add(this.parameters, 'radialSegments', 2, 20, 1);
    gui.add(this.parameters, 'p', 1, 10, 1);
    gui.add(this.parameters, 'q', 0, 10, 1);
    this.gui = gui;

    const basic = new FlatGUI({width:300, height:150});

		const folder = basic.addFolder( 'Folder' );

		const folderParams = {
			number: 0.5,
			boolean: false,
			color: '#0cf',
			function() { console.log( 'hi' ) }
		};

		folder.add( folderParams, 'number', 0, 1 );
		folder.add( folderParams, 'boolean' );
		folder.addColor( folderParams, 'color' );
		folder.add( folderParams, 'function' );

		const params = {
			options: 10,
			boolean: true,
			string: 'lil-gui',
			number: 0,
			color: '#aa00ff',
			function() { console.log( 'hi' ) }
		};

		basic.add( params, 'options', { Small: 1, Medium: 10, Large: 100 } );
		basic.add( params, 'boolean' );
		basic.add( params, 'string' );
		basic.add( params, 'number' );
		basic.addColor( params, 'color' );
		basic.add( params, 'function' ).name( 'Custom Name' );

    this.basic = basic;
  }

  tick(torus: Mesh) {
    torus.rotation.y += 0.005;
  }
}
