import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Optional, Output } from "@angular/core";

import { Material } from "three";

import { MenuItem } from "../menu/menu.component";
import { FlatUIMenuMini } from "../menu-mini/menu-mini.component";

@Component({
  selector: 'flat-ui-menu-item',
  exportAs: 'flatUIMenuItem',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class FlatUIMenuItem implements OnInit, OnDestroy, MenuItem {
  @Input() text = '';
  @Input() icon: string | undefined;
  @Input() keycode = '';
  @Input() enabled = true;
  @Input() submenu: MenuItem[] | undefined;
  @Input() color: Material | undefined;
  @Input() visible = true;

  @Output() pressed = new EventEmitter<MenuItem>();

  selected(item: MenuItem) {
    this.pressed.next(item);
  }

  constructor(
    @Optional() private menu: FlatUIMenuMini,
  ) { }

  ngOnDestroy(): void {
    if (this.menu)
      this.menu.removemenuitem(this);
  }

  ngOnInit(): void {
    if (!this.menu) return;

    this.menu.addmenuitem(this);
  }
}
