import { Component } from "@angular/core";

import { XRHandSpace } from "three";

import { HandModelType } from "./showhand.directive";

import { awesome, cuphand, fist, fivefingers, flathand, fourfingers, grab, grip, gun, holdpen, middlefinger, pinchend, pinchstart, pointend, pointstart, shoot, threefingers, thumbsup, touchthumbindex, touchthumbmiddle, touchthumbpinky, touchthumbring, twofingerpoint, twofingers } from "./gestures";


@Component({
  templateUrl: './hand.component.html',
})
export class HandInputExample {

  showhand = true;
  handinput = true;

  modeltype: HandModelType = 'boxes';

  lefttext!: string;
  righttext!: string;

  shootgestures: Array<{ name: string, vectors: Array<number> }> = [
    { name: 'gun', vectors: gun },
    { name: 'shoot', vectors: shoot },
  ]

  clickgestures: Array<{ name: string, vectors: Array<number> }> = [
    { name: 'pinchstart', vectors: pinchstart },
    { name: 'pinchend', vectors: pinchend },
  ]

  gestures: Array<{ name: string, vectors: Array<number> }> = [
    { name: 'fist', vectors: fist },
    { name: 'thumbsup', vectors: thumbsup },
    { name: 'pointstart', vectors: pointstart },
    { name: 'point2fingers', vectors: twofingerpoint },
    { name: 'twofingers', vectors: twofingers },
    { name: 'threefingers', vectors: threefingers },
    { name: 'fourfingers', vectors: fourfingers },
    { name: 'fivefingers', vectors: fivefingers },
    { name: 'touchthumbindex', vectors: touchthumbindex },
    { name: 'touchthumbmiddle', vectors: touchthumbmiddle },
    { name: 'touchthumbring', vectors: touchthumbring },
    { name: 'touchthumbpinky', vectors: touchthumbpinky },
    { name: 'awesome', vectors: awesome },
    { name: 'holdpen', vectors: holdpen },
    { name: 'cuphand', vectors: cuphand },
    { name: 'gun', vectors: gun },
    { name: 'shoot', vectors: shoot },
    { name: 'pinchstart', vectors: pinchstart },
    { name: 'pinchend', vectors: pinchend },
    { name: 'pointend', vectors: pointend },
    { name: 'grip', vectors: grip },
    { name: 'grab', vectors: grab },
    { name: 'middlefinger', vectors: middlefinger },
    { name: 'flathand', vectors: flathand },
  ]


  constructor() {
    // uncomment to test enable/disable at runtime
    //setInterval(() => { this.handinput = !this.handinput }, 5000);
  }


  log(event: string, data: XRHandSpace) {
    //console.warn(event, data);
  }

  pinch(data: XRHandSpace) {
    if (this.modeltype == 'boxes') {
      this.modeltype = 'spheres'
    }
    else if (this.modeltype == 'spheres') {
      this.modeltype = 'boxes';
    }
  }
}
