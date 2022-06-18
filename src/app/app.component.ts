import { NgtState } from '@angular-three/core';
import { Component } from '@angular/core';

import { VRButton } from 'three-stdlib/webxr/VRButton';
import { WebXRService } from '../examples/xr-controller/webxr.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',   
})
export class AppComponent {

  examples = [
    'viewer',
    'ballshooter',
    'dragging',
    'handinput',
    'teleport',
    'bat',
    'inspect',
    'drumstick',
    'touchpad',
    'joystick',
    'room1',
  ]

  constructor(private webxr: WebXRService) {
  }

  created(state: NgtState) {
    document.body.appendChild(VRButton.createButton(state.gl));
    this.webxr.start(state.gl.xr, state.scene);
  }
}
