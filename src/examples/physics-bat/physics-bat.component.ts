import { Component } from '@angular/core';

@Component({
  templateUrl: './physics-bat.component.html',
})
export class BatExample {
  step = 1 / 120;
  gravity = -2;
}
