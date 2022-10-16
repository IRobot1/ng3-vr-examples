import { NgtTriple } from "@angular-three/core";
import { Component, OnInit } from "@angular/core";
import { Mesh } from "three";
import { CameraService } from "../../app/camera.service";
import { FlatUIButton } from "../flat-ui/button/button.component";
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

  make(options: any, callback = (gui: FlatGUI): any => { }): FlatGUI {
    const gui = new FlatGUI(options);
    return callback(gui) || gui;
  }

  getDepth(g:any) {
    let depth = 0;
    while (g !== g.root) {
      g = g.parent;
      depth++;
    }
    return depth;
  }
  addFiller(g: any) {
    const nested = this.getDepth(g) > 0 ? 'Nested ' : '';
    g.add({ x: 0.5 }, 'x', 0, 1).name(`${nested}Slider`);
    g.add({ x: true }, 'x').name(`${nested}Boolean`);
    g.add({ x: function () { } }, 'x').name(`${nested}Button`);
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

    const basic = new FlatGUI({ width: 300, height: 150 });

    const folder = basic.addFolder('Folder');

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
      string: 'lil-gui',
      number: 0,
      color: '#aa00ff',
      function() { console.log('hi') }
    };

    basic.add(params, 'options', { Small: 1, Medium: 10, Large: 100 });
    basic.add(params, 'boolean');
    basic.add(params, 'string');
    basic.add(params, 'number');
    basic.addColor(params, 'color');
    basic.add(params, 'function').name('Custom Name');

    //this.basic = this.make({ title: 'Options' }, gui => {

    //  gui.add({ x: 0 }, 'x', [0, 1, 2]).name('Array');
    //  gui.add({ x: 0 }, 'x', { Label1: 0, Label2: 1, Label3: 2 }).name('Object');
    //  gui.add({ x: {} }, 'x', [0, 1, 2]).name('Invalid initial');
    //  gui.add({ x: {} }, 'x', { Label1: 0, Label2: 1, Label3: 2 }).name('Invalid initial');

    //  const longString = 'Anoptionorvaluewithaproblematicallylongname';
    //  gui.add({ x: longString }, 'x', [longString, 1, 2]).name('Long names');

    //});

    //this.basic = this.make({ title: 'Folders' }, gui => {

    //  const folder1 = gui.addFolder('Folder');
    //  this.addFiller(folder1);

    //  this.addFiller(gui);

    //  gui.addFolder('Empty Folder');

    //  const folder2 = gui.addFolder('Closed Folder').close();

    //  this.addFiller(folder2);

    //});

    //this.basic = this.make({ title: 'Disable' }, gui => {

    //  gui.add({ Number: 0 }, 'Number').disable().enable();
    //  gui.add({ Number: 0 }, 'Number').disable();

    //  gui.add({ Slider: 0 }, 'Slider', 0, 1).disable().enable();
    //  gui.add({ Slider: 0 }, 'Slider', 0, 1).disable();

    //  gui.add({ String: 'foo' }, 'String').disable().enable();
    //  gui.add({ String: 'foo' }, 'String').disable();

    //  gui.add({ Boolean: true }, 'Boolean').disable().enable();
    //  gui.add({ Boolean: true }, 'Boolean').disable();

    //  gui.add({ Options: 'a' }, 'Options', ['a', 'b', 'c']).disable().enable();
    //  gui.add({ Options: 'a' }, 'Options', ['a', 'b', 'c']).disable();

    //  gui.add({ func() { console.log('hi'); } }, 'func').name('Function').disable().enable();
    //  gui.add({ func() { console.log('hi'); } }, 'func').name('Function').disable();

    //  gui.addColor({ Color: 0xaa00ff }, 'Color').disable().enable();
    //  gui.addColor({ Color: 0xaa00ff }, 'Color').disable();

    //});

    //this.basic = this.make({ title: 'Listen' }, gui => {

    //  const params = { animate: false };

    //  gui.add(params, 'animate');

    //  function listenTester(name: string, cycle: any, ...addArgs: any) {

    //    const obj : any= {};
    //    obj[name] = cycle[cycle.length - 1];
    //    gui.add(obj, name, ...addArgs).listen();
    //    let index = 0;

    //    const loop = () => {

    //      if (params.animate) obj[name] = cycle[index];
    //      if (++index > cycle.length - 1) {
    //        index = 0;
    //      }

    //      setTimeout(loop, 1000);

    //    };

    //    loop();

    //  }

    //  listenTester('Number', [1, 2, 3, 4, 5]);
    //  listenTester('Slider', [5, 4, 3, 2, 1], 1, 5);

    //  listenTester('String', ['foo', 'bar', 'baz']);
    //  listenTester('Boolean', [true, false]);

    //  listenTester('Options', ['a', 'b', 'c'], ['a', 'b', 'c']);

    //  gui.add = gui.addColor; // hehe
    //  listenTester('Color', [0xaa00ff, 0x00aaff, 0xffaa00]);

    //});

    this.basic = this.make({ title: 'onChange' }, gui => {

      const tallies = { onChange: 0, onFinishChange: 0 };

      const change = (e: any) => {
        console.log(e.property + ' onChange');
        tallies.onChange++;
      }

      const finishChange = (e: any) => {
        console.log(e.property + ' onFinishChange');
        tallies.onFinishChange++;
      }

      let folder;

      folder = gui.addFolder('Tallies');
      folder.add(tallies, 'onChange').disable().listen();
      folder.add(tallies, 'onFinishChange').disable().listen();

      gui.add({ Number: 0 }, 'Number').onChange(change).onFinishChange(finishChange);

      gui.add({ Slider: 0 }, 'Slider', 0, 1).onChange(change).onFinishChange(finishChange);

      gui.add({ String: 'foo' }, 'String').onChange(change).onFinishChange(finishChange);

      gui.add({ Boolean: true }, 'Boolean').onChange(change).onFinishChange(finishChange);

      gui.add({ Options: 'a' }, 'Options', ['a', 'b', 'c']).onChange(change).onFinishChange(finishChange);

      gui.add({ func() { console.log('hi'); } }, 'func').onChange(change).onFinishChange(finishChange);

      gui.addColor({ Color: 0xaa00ff }, 'Color').onChange(change).onFinishChange(finishChange);

      gui.onFinishChange(e => {
        console.log('gui.onFinishChange', e);
      });

    });

    //    this.basic = basic;
  }



  tick(torus: Mesh) {
    torus.rotation.y += 0.005;
  }
}
