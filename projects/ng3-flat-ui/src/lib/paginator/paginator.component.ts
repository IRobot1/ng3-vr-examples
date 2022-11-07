import { NgtObjectProps, NgtTriple } from "@angular-three/core";

import { Group, Vector3 } from "three";
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from "@angular/core";

import { InteractiveObjects } from "../interactive-objects";
import { Paging } from "../flat-ui-utils";

class PageButtonData {
  constructor(public position: NgtTriple, public text: string) { }
}

@Component({
  selector: 'flat-ui-paginator',
  exportAs: 'flatUIPaginator',
  templateUrl: './paginator.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlatUIPaginator extends NgtObjectProps<Group> {
  @Input() paging!: Paging;

  @Input() showlabel = true;

  private _showfirstlast = true;
  @Input()
  get showfirstlast(): boolean { return this._showfirstlast }
  set showfirstlast(newvalue: boolean) {
    this._showfirstlast = newvalue;
    this.buildbuttons();
  }

  private _buttonsize = 0.1;
  @Input()
  get buttonsize(): number { return this._buttonsize }
  set buttonsize(newvalue: number) {
    this._buttonsize = newvalue;
    this.buildbuttons();
  }

  @Input() buttonspacing = 0.01;

  @Input() selectable?: InteractiveObjects;

  @Output() widthchange = new EventEmitter<number>();

  protected buttons: Array<PageButtonData> = [];
  protected get text(): string {
    if (this.paging) {
      const first = this.paging.firstindex;
      const length = this.paging.length;
      const count = Math.min(this.paging.pagesize, length);
      return `${first + 1} - ${first + count} of ${length}`;
    }
    return ''
  }
  protected textposition = new Vector3()

  override ngOnInit() {
    super.ngOnInit();

    this.buildbuttons();
  }

  private buildbuttons() {
    this.buttons.length = 0;

    const buttonwidth = this.buttonsize + this.buttonspacing;
    const halfwidth = this.buttonsize / 2;

    let x = halfwidth;

    if (this.showfirstlast) {
      this.buttons.push(new PageButtonData([x, 0, 0], '|<'));
      x += buttonwidth;
    }

    this.buttons.push(new PageButtonData([x, 0, 0], '<'));
    x += buttonwidth;

    this.buttons.push(new PageButtonData([x, 0, 0], '>'));
    x += buttonwidth;

    if (this.showfirstlast) {
      this.buttons.push(new PageButtonData([x, 0, 0], '>|'));
      x += buttonwidth;
    }

    let width = buttonwidth * this.buttons.length - this.buttonspacing * 2;

    if (this.showlabel) {
      const labelwidth = 1;
      this.textposition = new Vector3(width + labelwidth / 2 + 0.02);

      width += labelwidth / 2 + 0.02;
    }

    this.widthchange.next(width)
  }

  protected clicked(keycode: string) {
    if (!this.paging) return;

    if (keycode == '|<')
      this.paging.movefirst();
    else if (keycode == '<') {
      this.paging.moveprevious();
    }
    else if (keycode == '>') {
      this.paging.movenext();
    }
    else if (keycode == '>|') {
      this.paging.movelast();
    }
  }

}
