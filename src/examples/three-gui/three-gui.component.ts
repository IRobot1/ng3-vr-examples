import { Component, OnInit } from "@angular/core";

import { MathUtils, Mesh } from "three";
import { NgtTriple } from "@angular-three/core";

import { CameraService } from "../../app/camera.service";

import { InteractiveObjects } from "ng3-flat-ui";

import { Ng3GUI } from "ng3-gui";

//
// adapted from https://github.com/georgealways/lil-gui/blob/master/examples/kitchen-sink/kitchen-sink.js
//

class GUIData {
  constructor(public gui: Ng3GUI, public position: NgtTriple) { }
}

@Component({
  templateUrl: './three-gui.component.html',
})
export class ThreeGUIExample implements OnInit {
  leftwall: Array<GUIData> = [];
  frontwall: Array<GUIData> = [];
  rightwall: Array<GUIData> = [];
  backwall: Array<GUIData> = [];

  selectable = new InteractiveObjects();

  make(options: any, callback = (gui: Ng3GUI): any => { }): Ng3GUI {
    const gui = new Ng3GUI(options);
    return callback(gui) || gui;
  }

  getDepth(g: any) {
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

  makeNumbers(position: NgtTriple) {
    const gui = this.make({ title: 'Numbers', width: 300 }, gui => {

      gui.add({ x: 0 }, 'x').name('No Parameters');
      gui.add({ x: 0 }, 'x', 0).name('Min');
      gui.add({ x: 0 }, 'x').max(0).name('Max');

      const guiStep = gui.addFolder('Step');

      guiStep.add({ x: 0 }, 'x').step(0.01).name('0.01');
      guiStep.add({ x: 0 }, 'x').step(0.1).name('0.1');
      guiStep.add({ x: 0 }, 'x').step(1).name('1');
      guiStep.add({ x: 0 }, 'x').step(10).name('10');

    });

    this.leftwall.push(new GUIData(gui, position));
  }

  makeImplicitStep(position: NgtTriple) {
    const gui = this.make({ title: 'Implicit step', width: 300 }, gui => {

      const implicitStep = (min: number, max: number) => {
        gui.add({ x: max }, 'x', min, max).name(`[${min},${max}]`);
      };

      implicitStep(0, 1);
      implicitStep(0, 100);
      implicitStep(-1, 1);
      implicitStep(0, 3);
      implicitStep(0, 5);
      implicitStep(0, 7);
      implicitStep(0, 15);
      implicitStep(0, 1e32);

    });
    this.leftwall.push(new GUIData(gui, position));
  }

  makeExplicitStep(position: NgtTriple) {
    const gui = this.make({ title: 'Explicit step', width: 300 }, gui => {

      const explicitStep = (min: number, max: number, step: number, label: string = step.toString()) => {
        gui.add({ x: max }, 'x', min, max, step).name(`[${min},${max}] step ${label}`);
      };

      explicitStep(0, 100, 1);
      explicitStep(0, 1, 0.1);
      explicitStep(-1, 1, 0.25);
      explicitStep(1, 16, .01);
      explicitStep(0, 15, .015);
      explicitStep(0, 5, 1 / 3, '1/3');

    });
    this.leftwall.push(new GUIData(gui, position));
  }

  makeMiscNumbers(position: NgtTriple) {
    const gui = this.make({ title: 'Numbers Misc.', width: 300 }, gui => {

      let folder = gui.addFolder('Out of bounds');

      folder.add({ x: 2 }, 'x', 0, 1).name('[0,1] Too high');
      folder.add({ x: -2 }, 'x', 0, 1).name('[0,1] Too low');

      folder = gui.addFolder('Decimals');

      const decimalsObj = { x: 5 };

      const addDecimalCtrl = (v: any, argName = v) => {
        folder
          .add(decimalsObj, 'x', 0, 10)
          .name(`decimals( ${argName} )`)
          .decimals(v)
          .listen();
      };

      addDecimalCtrl(0);
      addDecimalCtrl(1);
      addDecimalCtrl(2);
      addDecimalCtrl(undefined, 'undef');

    });

    this.frontwall.push(new GUIData(gui, position));
  }

  makeOptions(position: NgtTriple) {
    const gui = this.make({ title: 'Options', width: 300 }, gui => {

      gui.add({ x: 0 }, 'x', [0, 1, 2]).name('Array');
      gui.add({ x: 0 }, 'x', { Label1: 0, Label2: 1, Label3: 2 }).name('Object');
      gui.add({ x: {} }, 'x', [0, 1, 2]).name('Invalid initial');
      gui.add({ x: {} }, 'x', { Label1: 0, Label2: 1, Label3: 2 }).name('Invalid initial');

      const longString = 'Anoptionorvaluewithaproblematicallylongname';
      gui.add({ x: longString }, 'x', [longString, 1, 2]).name('Long names');

    });

    this.frontwall.push(new GUIData(gui, position));
  }

  makeColors(position: NgtTriple) {
    const gui = this.make({ title: 'Colors', width: 300 }, gui => {

      const colorString = (str: string) => gui.addColor({ x: str }, 'x').name(`"${str}"`);

      colorString('#aa00Ff');
      colorString('aa00Ff');
      colorString('0xaa00Ff');
      colorString('#a0f');
      colorString('a0f');
      colorString('rgb(170, 0, 255)');

    });

    this.frontwall.push(new GUIData(gui, position));
  }

  makeColorStrings(position: NgtTriple) {
    const gui = this.make({ title: 'Color Strings', width: 300 }, gui => {

      gui.addColor({ x: 0xaa00ff }, 'x').name('Hex Integer');
      gui.addColor({ x: { r: 2 / 3, g: 0, b: 1 } }, 'x').name('{r,g,b} 0-1');
      gui.addColor({ x: [2 / 3, 0, 1] }, 'x').name('[r,g,b] 0-1');

      const guiRGBScale = gui.addFolder('RGB Scale');

      guiRGBScale.addColor({ x: [170, 0, 255] }, 'x', 255).name('{r,g,b} 0-255');
      guiRGBScale.addColor({ x: { r: 170, g: 0, b: 255 } }, 'x', 255).name('[r,g,b] 0-255');

    });

    this.rightwall.push(new GUIData(gui, position));
  }

  makeFolders(position: NgtTriple) {
    const gui = this.make({ title: 'Folders', width: 300 }, gui => {

      const folder1 = gui.addFolder('Folder');
      this.addFiller(folder1);

      this.addFiller(gui);

      gui.addFolder('Empty Folder');

      const folder2 = gui.addFolder('Closed Folder').close();

      this.addFiller(folder2);

    });

    this.rightwall.push(new GUIData(gui, position));
  }

  makeNestedFolders(position: NgtTriple) {
    const gui = this.make({ title: 'Nested Folders', width: 300 }, gui => {

      const folder3 = gui.addFolder('Folder');

      this.addFiller(folder3);

      const folder4 = folder3.addFolder('Nested Folder');

      this.addFiller(folder4);

      folder4.addFolder('Empty Nested Folder');

      this.addFiller(folder4);

    });

    this.rightwall.push(new GUIData(gui, position));
  }

  makeDisable(position: NgtTriple) {
    const gui = this.make({ title: 'Disable', width: 300 }, gui => {

      gui.add({ Number: 0 }, 'Number').disable().enable();
      gui.add({ Number: 0 }, 'Number').disable();

      gui.add({ Slider: 0 }, 'Slider', 0, 1).disable().enable();
      gui.add({ Slider: 0 }, 'Slider', 0, 1).disable();

      gui.add({ String: 'foo' }, 'String').disable().enable();
      gui.add({ String: 'foo' }, 'String').disable();

      gui.add({ Boolean: true }, 'Boolean').disable().enable();
      gui.add({ Boolean: true }, 'Boolean').disable();

      gui.add({ Options: 'a' }, 'Options', ['a', 'b', 'c']).disable().enable();
      gui.add({ Options: 'a' }, 'Options', ['a', 'b', 'c']).disable();

      gui.add({ func() { console.log('hi'); } }, 'func').name('Function').disable().enable();
      gui.add({ func() { console.log('hi'); } }, 'func').name('Function').disable();

      gui.addColor({ Color: 0xaa00ff }, 'Color').disable().enable();
      gui.addColor({ Color: 0xaa00ff }, 'Color').disable();

    });

    this.backwall.push(new GUIData(gui, position));
  }

  makeListen(position: NgtTriple) {
    const gui = this.make({ title: 'Listen', width: 300 }, gui => {

            const params = { animate: false };

      gui.add(params, 'animate');

      function listenTester(name: string, cycle: any, ...addArgs: any) {

        const obj : any= {};
        obj[name] = cycle[cycle.length - 1];
        gui.add(obj, name, ...addArgs).listen();
        let index = 0;

        const loop = () => {

          if (params.animate) obj[name] = cycle[index];
          if (++index > cycle.length - 1) {
            index = 0;
          }

          setTimeout(loop, 1000);

        };

        loop();

      }

      listenTester('Number', [1, 2, 3, 4, 5]);
      listenTester('Slider', [5, 4, 3, 2, 1], 1, 5);

      listenTester('String', ['foo', 'bar', 'baz']);
      listenTester('Boolean', [true, false]);

      listenTester('Options', ['a', 'b', 'c'], ['a', 'b', 'c']);

      gui.add = gui.addColor; // hehe
      listenTester('Color', [0xaa00ff, 0x00aaff, 0xffaa00]);

    });

    this.backwall.push(new GUIData(gui, position));
  }

  makeOnChange(position: NgtTriple) {
    const gui = this.make({ title: 'onChange', width: 300 }, gui => {

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

    this.backwall.push(new GUIData(gui, position));
  }

  ngOnInit(): void {
    this.makeNumbers([0, 3, -1.9]);
    this.makeImplicitStep([0, 1.7, -1.9]);
    this.makeExplicitStep([0, 0.5, -1.9]);

    this.makeMiscNumbers([0, 3, -1.9]);
    this.makeOptions([0, 1.7, -1.9]);
    this.makeColors([0, 0.5, -1.9]);

    this.makeColorStrings([0, 3, -1.9]);
    this.makeFolders([0, 1.9, -1.9]);
    this.makeNestedFolders([0, 0.5, -1.9]);

    this.makeDisable([0, 3, -1.9]);
    this.makeListen([0, 1.6, -1.9]);
    this.makeOnChange([0, 0.5, -1.9]);
  }
}
