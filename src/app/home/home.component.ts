import { Component } from '@angular/core';

import { NgtTriple } from '@angular-three/core';

class PanelSetting {
  constructor(public position: NgtTriple, public rotation: number, public asset: string, public text: string) { }
}

@Component({
  templateUrl: 'home.component.html',
})
export class HomeComponent {
  examples = [
    { asset: 'ballshooter', text: 'Ball Shooter' },
    { asset: 'dragging', text: 'Dragging' },
    { asset: 'handinput', text: 'Hand input' },
    { asset: 'teleport', text: 'Teleport' },
    { asset: 'bat', text: 'Physics Bat' },
    { asset: 'inspect', text: 'Grab / Inspect' },
    { asset: 'drumstick', text: 'Drumstick / Keyboard' },
    { asset: 'touchpad', text: 'Touchpad Movement' },
    { asset: 'joystick', text: 'Joystick Movement' },
    { asset: 'behaviors', text: 'Toggle Controller Behaviors' },
    { asset: 'studio', text: 'Lights, Camera, Action' },
  ]

  panels: Array<PanelSetting> = [];

  constructor() {
    const angle = 360 / this.examples.length;

    this.examples.forEach((item, index) => {
      const position = [0, 0, 0] as NgtTriple;
      const rotation = angle * index;

      const panel = new PanelSetting(position, rotation, item.asset, item.text)
      this.panels.push(panel);
    })
  }
}
