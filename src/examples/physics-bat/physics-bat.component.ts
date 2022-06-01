import { Component } from '@angular/core';
import { BatGame } from './batgame.service';

@Component({
  templateUrl: './physics-bat.component.html',
})
export class BatExample {
  step = 1 / 120;
  gravity = -4;

  balls = 1000;

  constructor(public gamestate: BatGame) {
    this.gamestate.reset(this.balls);

    this.gamestate.gamestate$.subscribe(next => {
      if (next.remaining == 0) {
        console.warn('game over')
      }
    })
  }
}
