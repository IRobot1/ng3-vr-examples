import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

import { NgtTriple } from "@angular-three/core";

import { FlatUICardActions } from "../card-actions/card-actions.component";

export interface CardAction {
  position: NgtTriple;
  materialicon: string;
  label?: string;
  data?: any;
  action: EventEmitter<CardAction>;
}

@Component({
  selector: 'flat-ui-card-action',
  exportAs: 'flatUICardAction',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class FlatUICardAction implements OnInit, CardAction {
  @Input() position = [0, 0, 0] as NgtTriple
  @Input() materialicon!: string
  @Input() label?: string

  @Output() action = new EventEmitter<CardAction>();

  constructor(
    private actions: FlatUICardActions,
  ) { }

  ngOnInit(): void {
    if (this.actions) {
      this.actions.addaction(this);
    }
  }
}
