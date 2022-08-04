import { EventEmitter , Directive, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { Subscription } from "rxjs";

import { Object3D } from "three";
import { BooleanInput, coerceBooleanProperty } from "@angular-three/core";

import { ShowHandDirective } from "./showhand.directive";

@Directive({
  selector: '[handgesture]',
  exportAs: 'handGesture',
})
export class HandGestureDirective implements OnInit, OnDestroy {
  private _enabled: BooleanInput = true;
  @Input()
  get handgesture(): boolean { return coerceBooleanProperty(this._enabled) }
  set handgesture(newvalue: BooleanInput) {
    this._enabled = newvalue;
  }

  @Output() gesture = new EventEmitter<string>();
  @Output() message = new EventEmitter<string>();

  private wrist!: Object3D;
  private tips: Array<{ name: string, object: Object3D }> = [];

  private subs = new Subscription();

  constructor(
    private showhand: ShowHandDirective,
  ) { }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }


  ngOnInit(): void {
    const tipnames = ['index-finger-tip', 'middle-finger-tip', 'pinky-finger-tip', 'ring-finger-tip', 'thumb-tip'];
    this.showhand.handJoints.subscribe(joints => {
      this.tips.length = 0;

      this.wrist = joints['wrist'];
      tipnames.forEach(name => {
        this.tips.push({ name: name, object: joints[name] });
      });
    });

    this.monitor();
  }

  private monitor() {
    let prevname = '';
    setInterval(() => {
      const newname = this.guessGesture();
      if (newname && newname != prevname) {
        this.gesture.next(newname);
        prevname = newname;
      }
    }, 100);
  }
  private twofingerpoint: Array<number> = [
    0.18335025085212453, 0.19115885626112789, 0.08551343035130576, 0.0896670110881902, 0.1202841551106962
  ]

  private pointfinger: Array<number> = [
    0.17825897016865777, 0.07331487400363257, 0.05714260046331631, 0.06122604801168633, 0.12662355725864333
  ]

  private twofingers: Array<number> = [
    0.188932859745854, 0.19657178720805507, 0.09332934396380235, 0.0957640949440752, 0.12144792535741397
  ]
  private threefingers: Array<number> = [
    0.1821193893725322, 0.18993492838014903, 0.08338909023328024, 0.17679036972768009, 0.11868493140621843
  ]

  private fourfingers: Array<number> = [
    0.18409104723282343, 0.19174466094885423, 0.1598060646104273, 0.18181183301240647, 0.10081661243806547
  ]
  private fivefingers: Array<number> = [
    0.18903795039445748, 0.19671985759121763, 0.1645333558753372, 0.18602071975660806, 0.14556052419490162
  ]

  private touchthumbindex: Array<number> = [
    0.13710895417609326, 0.18713927896378574, 0.16022087003836616, 0.18127179714349823, 0.13738911923154096
  ]
  private touchthumbmiddle: Array<number> = [
    0.18256019116538205, 0.12438132442834265, 0.15937792523296074, 0.16225028110267173, 0.13344966173863126
  ]
  private touchthumbring: Array<number> = [
    0.18373236327709797, 0.18443465868806025, 0.15861823525152757, 0.12672241104681775, 0.12954805526794544
  ]
  private touchthumbpinky: Array<number> = [
    0.1843046379397662, 0.19198310583070713, 0.10780494529654873, 0.17651110152172794, 0.1271163345562858
  ]

  private thumbsup: Array<number> = [
    0.08156375644599065, 0.06678299547540584, 0.05526883769907842, 0.057494659838947235, 0.1383727629990784
  ]

  private fist: Array<number> = [
    0.09424201765555384, 0.08297021568252871, 0.06620030506532346, 0.07240520325575174, 0.12803243772707998
  ]
  private awesome: Array<number> = [
    0.0720669740711472, 0.062046462921426564, 0.14928106851267312, 0.05973034357355869, 0.13870979650417412
  ]
  private holdpen: Array<number> = [
    0.1332131219267318, 0.1262530821681633, 0.12218213909352449, 0.1255515391115566, 0.13741739908671405
  ]
  private cuphand: Array<number> = [
    0.1339765892240336, 0.14254942850779304, 0.1301670057540757, 0.13269428545482329, 0.1348637487584229
  ]


  private gestures: Array<{ name: string, vectors: Array<number> }> = [
    { name: 'fist', vectors: this.fist },
    { name: 'thumbsup', vectors: this.thumbsup },
    { name: 'pointfinger', vectors: this.pointfinger },
    { name: 'point2fingers', vectors: this.twofingerpoint },
    { name: 'twofingers', vectors: this.twofingers },
    { name: 'threefingers', vectors: this.threefingers },
    { name: 'fourfingers', vectors: this.fourfingers },
    { name: 'fivefingers', vectors: this.fivefingers },
    { name: 'touchthumbindex', vectors: this.touchthumbindex },
    { name: 'touchthumbmiddle', vectors: this.touchthumbmiddle },
    { name: 'touchthumbring', vectors: this.touchthumbring },
    { name: 'touchthumbpinky', vectors: this.touchthumbpinky },
    { name: 'awesome', vectors: this.awesome },
    { name: 'holdpen', vectors: this.holdpen },
    { name: 'cuphand', vectors: this.cuphand },
  ]

  private previous: Array<number> = [];
  private last = 100;

  captureGesture() {
    const positions: Array<number> = [];

    let distance = 0;
    this.tips.forEach((tip, index) => {
      let pos = this.wrist.position.clone().sub(tip.object.position);
      let length = pos.length();
      if (this.previous.length == this.tips.length) {
        const previous = this.previous[index];
        length = (length + previous) / 2;
      }
      else
        length = 1;

      positions.push(length);
      distance += length;
    });

    if (distance < this.last) {
      if (distance > 0) {
        console.warn('better distance', distance, this.last);
        this.previous = positions;
        console.warn(positions.join(','))
        this.last = distance;
      }
    }
    else {
      console.warn('worse distance', distance, this.last);
    }

  }

  guessGesture(): string | undefined {
    const positions: Array<number> = [];

    this.tips.forEach(tip => {
      positions.push(this.wrist.position.clone().sub(tip.object.position).length());
    });

    let bestmatch = 0;
    let name = '';
    this.gestures.forEach(gesture => {
      let match = 0;
      gesture.vectors.forEach((length, index) => {
        if (Math.abs(positions[index] - length) < 0.01) {
          match++;
        }
      });
      if (match > bestmatch) {
        bestmatch = match;
        name = gesture.name;
      }
    });
    if (bestmatch == 5) {
      return name;
    }
    return undefined;
  }
}
