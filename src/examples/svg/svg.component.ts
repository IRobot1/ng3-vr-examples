import { Component, OnDestroy } from "@angular/core";

import { Observable, Subscription, timer } from "rxjs";

import { Group } from "three";

import { allsimpleicons } from "./simple-icons-data";

class IconDisplay {
  public svg!: string
  public iconcolor!: string

  constructor(public x: number, public z: number) { }
}

@Component({
  templateUrl: './svg.component.html',
})
export class SVGExample implements OnDestroy {
  url = '';
  svg = '';
  color = 'white'

  displays: Array<IconDisplay> = [];
  count = 0;

  private timer: Observable<number> = timer(0, 30 * 1000);
  private subs!: Subscription;

  constructor() {
    for (let z = -2.5; z < 3; z += 1.5) {
      for (let x = -2.5; x < 3; x += 1.5) {
        this.displays.push(new IconDisplay(x, z))
      }
    }

    this.subs = this.timer.subscribe(() => {
      this.refreshicons();
    });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  private refreshicons() {
    this.displays.forEach(display => {

      const icon = allsimpleicons[this.count]
      if (icon) {
        display.svg = icon.svg;
        display.iconcolor = icon.color;
      }
      this.count++;
      if (this.count == allsimpleicons.length) this.count = 0;
    });
  }

  groups: Array<Group> = [];
  iconChanged(group: Group) {
    if (!this.groups.includes(group)) {
      this.groups.push(group);
    }

    const r = group.rotation.clone();
    group.lookAt(0, 0, 0)

    group.rotation.x = r.x;
    group.rotation.z = r.z;
    if (group.position.z < 0) {
      group.rotation.y = -group.rotation.y;
    }
  }

  tick() {
    this.groups.forEach(icon => {
      icon.rotation.y += 0.005;
    });
  }
}
