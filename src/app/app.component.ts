import { NgtState } from '@angular-three/core';
import { Component } from '@angular/core';

import { VRButton } from 'three-stdlib/webxr/VRButton';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',   
})
export class AppComponent {

  examples = [
    'viewer'
  ]

  created(state: NgtState) {
    document.body.appendChild(VRButton.createButton(state.gl));
  }
}
