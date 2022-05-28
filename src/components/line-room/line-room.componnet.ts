import { AfterViewInit, Component, OnDestroy } from "@angular/core";

import { LineBasicMaterial, LineSegments } from "three";

import { NgtStore } from "@angular-three/core";

import { BoxLineGeometry } from 'three-stdlib';


@Component({
  selector: 'line-room',
  templateUrl: './line-room.component.html',
})
export class LineRoomComponent implements AfterViewInit, OnDestroy {
  constructor(
    private store: NgtStore,
  ) { }


  private room = new LineSegments(
    new BoxLineGeometry(6, 6, 6, 10, 10, 10),
    new LineBasicMaterial({ color: 0x808080 })
  );

  ngAfterViewInit(): void {
    this.room.geometry.translate(0, 3, 0);

    const scene = this.store.get((s) => s.scene);
    scene.add(this.room);
  }
  ngOnDestroy(): void {
    const scene = this.store.get((s) => s.scene);
    scene.remove(this.room);
  }
}
