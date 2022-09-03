import { Component, Input, OnInit } from "@angular/core";

import { Observable, Subscription, timer } from "rxjs";

import { MathUtils } from "three";
import { NgtTriple } from "@angular-three/core";


@Component({
  selector: 'wall-clock',
  templateUrl: './wall-clock.component.html',
})
export class WallClockComponent implements OnInit {
  @Input() position = [0, 0, 0] as NgtTriple;
  @Input() rotation = [0, 0, 0] as NgtTriple;
  @Input() scale = [1, 1, 1] as NgtTriple;

  @Input() showrim = true;
  @Input() showsecondticks = true;
  @Input() shownumbers = true;

  @Input() color = 'black';
  @Input() rimcolor = 'black';
  @Input() secondcolor = 'red';
  @Input() numbercolor = 'black';

  ticks: Array<number> = []
  secondticks: Array<number> = []

  hour = 0
  minute = 0
  second = 0

  private timer: Observable<number> = timer(0, 1000);
  private subs = new Subscription();


  ngOnInit(): void {
    const sides = 12
    let rotation = MathUtils.degToRad(360 / sides);

    for (let i = 0; i < sides; i++) {
      this.ticks.push(rotation * i);
    }

    if (this.showsecondticks) {
      const minutes = 60;
      rotation = MathUtils.degToRad(360 / minutes);
      for (let i = 0; i < minutes; i++) {
        if (i % 5 > 0)
          this.secondticks.push(rotation * i);
      }
    }

    this.subs.add(this.timer.subscribe(() => {
      const now = new Date();

      const minute = now.getMinutes();
      this.minute = -MathUtils.degToRad(minute * 360 / 60);

      const hour = now.getHours();
      const hourangle = 360 / 12;
      const subhourangle = hourangle / 60;
      this.hour = -MathUtils.degToRad(hour * hourangle) - MathUtils.degToRad(minute * subhourangle);

      const second = now.getSeconds();
      this.second = -MathUtils.degToRad(second * 360 / 60);

    }));

  }
}
