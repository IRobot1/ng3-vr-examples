import { Component, OnInit } from "@angular/core";

import { MeshBasicMaterial, PlaneGeometry } from "three";

import { InteractiveObjects } from "ng3-flat-ui";
import { Ng3GUI } from "ng3-gui";

import { BlockConsoleEvent } from "./block-console/block-console.component";

@Component({
  templateUrl: './control-room.component.html',
})
export class ControlRoomExample implements OnInit {
  blockheight = 1
  blockwidth = 1
  blockdepth = 0.6
  blockshelf = 0.1
  blockscreenheight = 0.6;
  screenangle = 0;

  protected blockscreen!: PlaneGeometry;
  blockmaterial = new MeshBasicMaterial({ color: '#CD8C50' });

  selectable = new InteractiveObjects()
  gui!: Ng3GUI;

  ngOnInit(): void {
    let gui = new Ng3GUI({ width: 300 });
    gui.settitle('Block Console')
    gui.add(this, 'blockheight', 1, 1.5, 0.1).name('Height');
    gui.add(this, 'blockwidth', 0.5, 2, 0.1).name('Width');
    gui.add(this, 'blockdepth', 0.2, 1, 0.1).name('Depth');
    gui.add(this, 'blockshelf', 0, 0.5, 0.1).name('Shelf');
    gui.add(this, 'blockscreenheight', 0.5, 1, 0.1).name('Screen Height');
    this.gui = gui;
  }

  updatescreen(e: BlockConsoleEvent) {
    const bordersize = 0.02;

    const geometry = new PlaneGeometry(this.blockwidth - bordersize * 2, e.screenheight - bordersize * 2);
    geometry.translate(0, e.screenheight / 2, 0);
    geometry.rotateX(-e.screenangle)

    this.blockscreen = geometry;

    this.screenangle = e.screenangle;
  }
}
