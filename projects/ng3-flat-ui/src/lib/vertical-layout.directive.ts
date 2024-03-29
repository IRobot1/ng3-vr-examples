import { Directive, EventEmitter, Input, OnDestroy, OnInit, Output } from "@angular/core";

import { NgtVector2 } from "@angular-three/core";
import { NgtGroup } from "@angular-three/core/group";

import { VerticalLayout } from "./layout";
import { HEIGHT_CHANGED_EVENT } from "./flat-ui-utils";



@Directive({
  selector: '[vertical-layout]',
  exportAs: 'verticalLayout',
  standalone: true
})
export class VerticalLayoutDirective implements OnInit, OnDestroy {
  private _margin: NgtVector2 = 0;
  @Input()
  get margin(): NgtVector2 { return this._margin }
  set margin(newvalue: NgtVector2) {
    this._margin = newvalue;
    if (this.panel) {
      this.panel.margin = newvalue;
    }
  }

  @Output() heightchange = new EventEmitter<number>();

  private panel!: VerticalLayout;

  constructor(private ngtgroup: NgtGroup) { }

  ngOnDestroy(): void {
    clearInterval(this.updatetimer)
    clearInterval(this.listentimer)
  }

  private updatetimer: any;
  private listentimer: any;


  ngOnInit(): void {
    const group = this.ngtgroup.instance.value;

    group.addEventListener(HEIGHT_CHANGED_EVENT, (e: any) => {
      this.heightchange.next(e.height);
    })

    this.panel = new VerticalLayout(group);
    this.panel.margin = this.margin;

    this.updatetimer = setInterval(() => {
      this.panel.update();
    }, 1000 / 60)

    this.listentimer = setInterval(() => {
      this.panel.listen(group);
    }, 125)
  }
}
