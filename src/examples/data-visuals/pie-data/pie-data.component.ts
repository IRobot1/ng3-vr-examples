import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Optional, Output } from "@angular/core";

import { BufferGeometry, Material } from "three";
import { PieChart, PieData } from "../pie-chart/pie-chart.component";

@Component({
  selector: 'pie-data',
  exportAs: 'pieData',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartPieData implements OnInit, OnDestroy, PieData {
  @Input() label = ''
  @Input() labelsize = 0.07;
  @Input() value = 0;
  @Input() material!: Material;

  constructor(
    @Optional() private chart: PieChart,
  ) { }

  ngOnDestroy(): void {
    if (this.chart)
      this.chart.removeSlice(this);
  }

  ngOnInit(): void {
    if (!this.chart) return;

    this.chart.addSlice(this);
  }
}
