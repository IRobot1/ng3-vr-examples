import { Component, Input } from "@angular/core";

import { Observable, Subscription, timer } from "rxjs";

import { MathUtils } from "three";
import { NgtTriple } from "@angular-three/core";

class TickData {
  constructor(public position: NgtTriple, public angle: number) { }
}

@Component({
  selector: 'wall-clock',
  templateUrl: './wall-clock.component.html',
})
export class WallClockComponent {
  @Input() position = [0, 0, 0] as NgtTriple;
  @Input() rotation = [0, 0, 0] as NgtTriple;
  @Input() scale = [1, 1, 1] as NgtTriple;

  ticks: Array<TickData> = []

  hour= 0
  minute=0
  second=0

  private timer: Observable<number> = timer(0,1000);
  private subs = new Subscription();

  constructor() {
    const PI2 = Math.PI * 2

    const sides = 12
    const rotation = MathUtils.degToRad(360 / sides);

    for (let i = 0; i < sides; i++) {
      const angle = (i / sides) * PI2
      this.ticks.push(new TickData([Math.sin(angle), Math.cos(angle), 0], rotation * i));
    }

    this.subs.add(this.timer.subscribe(() => {
      const now = new Date();

      const hour = now.getHours();
      this.hour= -MathUtils.degToRad(hour * 360 / 12);

      const minute = now.getMinutes();
      this.minute=-MathUtils.degToRad(minute * 360 / 60);

      const second = now.getSeconds();
      this.second=-MathUtils.degToRad(second * 360 / 60);
  
    }));
  }
}
