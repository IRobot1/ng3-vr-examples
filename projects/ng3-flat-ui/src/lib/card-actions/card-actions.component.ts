import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Subscription } from "rxjs";

import { Group } from "three";
import { NgtObjectProps } from "@angular-three/core";

import { FlatUICard } from "../card/card.component";
import { CardAction } from "../card-action/card-action.component";
import { InteractiveObjects } from "../interactive-objects";


@Component({
  selector: 'flat-ui-card-actions',
  exportAs: 'flatUICardActions',
  templateUrl: './card-actions.component.html',
})
export class FlatUICardActions extends NgtObjectProps<Group> {
  @Input() actions: Array<CardAction> = [];
  @Input() buttonwidth = 0.1;
  @Input() buttonheight = 0.1;
  @Input() iconsize = 0.1;
  @Input() showlabels = false;
  @Input() closedelay = 2;

  @Input() selectable?: InteractiveObjects;

  @Output() action = new EventEmitter<CardAction>();

  private subs = new Subscription();

  constructor(
    private card: FlatUICard,
  ) {
    super();
  }

  protected clicked(item: CardAction) {
    this.action.next(item);
    item.action.next(item);
    this.hide();
  }

  private delay = 0;
  private timer: any;

  override ngOnDestroy(): void {
    super.ngOnDestroy();

    clearInterval(this.timer);
    this.subs.unsubscribe();
  }

  override ngOnInit(): void {
    super.ngOnInit();

    this.visible = false;

    this.subs.add(this.card.pointerover.subscribe(next => {
      this.show();
    }));

    this.subs.add(this.card.pointerout.subscribe(next => {
      this.delayhide();
    }));

    this.timer = setInterval(() => {
      if (this.delay > 0) {
        this.delay--;
        if (!this.delay)
          this.visible = false;
      }
    }, 1000);
  }

  private show() {
    this.visible = true;
    this.delay = 0;
  }

  private delayhide() {
    this.delay = this.closedelay;
  }

  private hide() {
    this.visible = false;
    this.delay = 0;
  }


  addaction(action: CardAction) {
    this.actions.push(action);
  }

  removeaction(action: CardAction) {
    this.actions = this.actions.filter(item => item != action);
  }
}
