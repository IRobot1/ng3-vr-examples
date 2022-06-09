import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, HostListener, Input, OnInit, Output } from "@angular/core";

import { NgtTriple } from "@angular-three/core";


class KeySetting {
  constructor(public position: NgtTriple, public lower: string,
    public upper?: string, public alpha?: string,
    public size = [0.2, 0.01, 0.2] as NgtTriple, public fontsize = 0.15) { }
}

type KeyCase = 'lower' | 'upper' | 'numbers';

@Component({
  selector: 'keyboard',
  templateUrl: './keyboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KeyboardComponent implements OnInit {
  @Input() position = [0, 0, 0] as NgtTriple;
  @Input() rotation = [0, 0, 0] as NgtTriple;
  @Input() scale = 1;

  @Output() message = new EventEmitter<string>();

  keys: Array<KeySetting> = [];

  displaytext = '_';
  private text = '';

  constructor(private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
    const top = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p']
    const topalpha = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']
    const middle = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l']
    const middlealpha = ['#', '$', '_', '&', '-', '+', '(', ')', '`']
    const bottom = ['z', 'x', 'c', 'v', 'b', 'n', 'm']
    const bottomalpha = ['*', '"', "'", '<', ';', '!', '~']

    top.forEach((lower, index) => {
      this.keys.push(new KeySetting([(index - 4) * (0.2 + 0.1), 0, -0.8], lower, lower.toUpperCase(), topalpha[index]));
    })
    middle.forEach((lower, index) => {
      this.keys.push(new KeySetting([(index - 3.5) * (0.2 + 0.1), 0, -0.5], lower, lower.toUpperCase(), middlealpha[index]));
    })
    this.keys.push(new KeySetting([(6) * (0.2 + 0.1), 0, -0.5], 'Back', 'Back', 'Back', [0.4, 0.01, 0.2], 0.1));

    this.keys.push(new KeySetting([(-4.5) * (0.2 + 0.1), 0, -0.2], 'ABC', 'abc', 'ABC', [0.3, 0.01, 0.2], 0.1));
    bottom.forEach((lower, index) => {
      this.keys.push(new KeySetting([(index - 3) * (0.2 + 0.1), 0, -0.2], lower, lower.toUpperCase(), bottomalpha[index]));
    })
    this.keys.push(new KeySetting([(4.5) * (0.2 + 0.1), 0, -0.2], 'Return', 'Return', 'Return', [0.4, 0.01, 0.2], 0.1));

    this.keys.push(new KeySetting([(-3.5) * (0.2 + 0.1), 0, 0.1], '123', '123', 'abc', [0.3, 0.01, 0.2], 0.1));
    this.keys.push(new KeySetting([(-0.5) * (0.2 + 0.1), 0, 0.1], ' ', ' ', ' ', [1, 0.01, 0.2]));
    this.keys.push(new KeySetting([(2.5) * (0.2 + 0.1), 0, 0.1], '.', ',', ':'));
    this.keys.push(new KeySetting([(3.5) * (0.2 + 0.1), 0, 0.1], '@', '?', '/'));
  }

  @HostListener('document:keydown', ['$event'])
  private onKeyUp(event: KeyboardEvent) {
    this.pressed(event.key);
  }

  keycase: KeyCase = 'lower';

  keycode(keys: KeySetting): string {
    if (this.keycase == 'lower')
      return keys.lower;
    else if (this.keycase == 'upper')
      return keys.upper ? keys.upper : keys.lower;
    else
      return keys.alpha ? keys.alpha : keys.lower;
  }

  pressed(keycode: string) {
    //console.warn(keycode)
    if (keycode == 'ABC') {
      this.keycase = 'upper'
    } else if (keycode == 'abc') {
      this.keycase = 'lower';
    } else if (keycode == '123') {
      this.keycase = 'numbers'
    }
    else {
      if (keycode == 'Return') {
        this.message.emit(this.text);
        this.text = '';
      }
      else if (keycode == 'Back') {
        if (this.text.length > 0) {
          this.text = this.text.slice(0, this.text.length - 1);
        }
      }
      else {
        this.text += keycode;
      }
      this.displaytext = this.text.substring(this.text.length-30) + '_';
    }
    this.cd.detectChanges();
  }

}
