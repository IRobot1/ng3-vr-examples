import { NgtObjectProps, NgtTriple } from "@angular-three/core";

import { Group } from "three";
import { ChangeDetectionStrategy, Component, Input, Optional } from "@angular/core";

import { InteractiveObjects } from "../interactive-objects";
import { FlatUIDataGrid } from "../data-grid/data-grid.component";

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
  @Input() rowcount = 0;
  @Input() showfirstlast = true;
  @Input() buttonsize = 0.1;
  @Input() buttonspacing = 0.01;

  @Input() selectable?: InteractiveObjects;

  width = 0
  protected buttons: Array<PageButtonData> = [];

  constructor(
    @Optional() private datagrid: FlatUIDataGrid) {
    super();
  }

  override ngOnInit() {
    super.ngOnInit();

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

    this.width = buttonwidth * this.buttons.length - this.buttonspacing * 2;
  }

  clicked(keycode: string) {
    if (!this.datagrid) return;

    if (keycode == '|<')
      this.datagrid.movefirst();
    else if (keycode == '<') {
      this.datagrid.moveprevious();
    }
    else if (keycode == '>') {
      this.datagrid.movenext();
    }
    else if (keycode == '>|') {
      this.datagrid.movelast();
    }
  }

}
