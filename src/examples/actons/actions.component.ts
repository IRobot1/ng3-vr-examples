import { NgtTriple } from "@angular-three/core";
import { ChangeDetectionStrategy, Component, EventEmitter, OnInit } from "@angular/core";

import { CardAction, InteractiveObjects } from "ng3-flat-ui";

@Component({
  templateUrl: './actions.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActionsExample implements OnInit  {
  selectable = new InteractiveObjects();

  cardsize = 1;
  buttonwidth = 0.15;
  buttonheight = 0.15;
  padding = 0.02;

  action = new EventEmitter<CardAction>();

  ngOnInit(): void {
    this.action.subscribe(next => this.doaction('local', next));
  }

  actions: Array<CardAction> = [
    { position: [-this.cardsize / 2 + this.buttonwidth * 0.5, this.cardsize / 2 + this.buttonheight / 2 + this.padding, 0] as NgtTriple, materialicon: 'add', label: 'Add', action: this.action },
    { position: [-this.cardsize / 2 + this.buttonwidth * 1.5 + this.padding, this.cardsize / 2 + this.buttonheight / 2 + this.padding, 0] as NgtTriple, materialicon: 'more_vert', label: 'More', action: this.action },
  ];

  doaction(source: string, action: CardAction) {
    console.warn(source, action)
  }
}
