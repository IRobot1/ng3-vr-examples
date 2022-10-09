import { Component, Input, OnInit } from "@angular/core";

import { NgtTriple } from "@angular-three/core";
import { LabelColor } from "../flat-ui-utils";

@Component({
  selector: 'flat-ui-label',
  exportAs: 'flatUILabel',
  templateUrl: './label.component.html',
})
export class FlatUILabel implements OnInit {
  @Input() text = '';
  @Input() color = LabelColor;
  @Input() font = ''; // for example, https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff
  @Input() fontsize = 0.1;
  @Input() width = 1;

  @Input() position = [0, 0, 0] as NgtTriple;
  @Input() rotation = [0, 0, 0] as NgtTriple;
  @Input() scale = [1, 1, 1] as NgtTriple;


  @Input() horizorder = 0;
  @Input() vertorder = 0;

  userData: any = {}

  ngOnInit(): void {
    this.userData.horizorder = this.horizorder;
    this.userData.vertorder = this.vertorder;
  }
}
