import { Component, OnInit } from "@angular/core";
import { MeshBasicMaterial, PlaneGeometry } from "three";
import { BlockConsoleEvent } from "./block-console/block-console.component";

@Component({
  templateUrl: './control-room.component.html',
})
export class ControlRoomExample implements OnInit {
  blockheight = 1
  blockwidth = 1
  blockdepth = 0.6
  blockshelf = 0.1
  blockscreenheight = 0.6

  protected blockscreen!: PlaneGeometry;
  blockmaterial = new MeshBasicMaterial({ color: '#CD8C50' });

  ngOnInit(): void {
  }

  updatescreen(e: BlockConsoleEvent) {
    const bordersize = 0.02;

    const geometry = new PlaneGeometry(this.blockwidth-bordersize*2, e.screenheight-bordersize*2);
    geometry.translate(0, e.screenheight / 2, 0);
    geometry.rotateX(-e.screenangle)

    this.blockscreen = geometry;
  }
}
