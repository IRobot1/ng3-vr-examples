import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, Optional } from "@angular/core";

import { Material } from "three";
import { StackData, StackedBar } from "../stacked-bar/stacked-bar.component";

@Component({
  selector: 'stack-data',
  exportAs: 'stackData',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartStackData implements OnInit, OnDestroy, StackData {
  @Input() label = ''
  @Input() value = 0;
  @Input() material!: Material;

  constructor(
    @Optional() private chart: StackedBar,
  ) { }

  ngOnDestroy(): void {
    if (this.chart)
      this.chart.removeSegment(this);
  }

  ngOnInit(): void {
    if (!this.chart) return;

    this.chart.addSegment(this);
  }
}
