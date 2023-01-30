import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Optional, Output } from "@angular/core";

import { BufferGeometry, Material } from "three";
import { ColumnChart, ColumnData } from "../column-chart/column-chart.component";

@Component({
  selector: 'column-data',
  exportAs: 'columnData',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartColumnData implements OnInit, OnDestroy, ColumnData {
  @Input() label = ''
  @Input() minorlabel: string | undefined;
  @Input() value = 0;
  @Input() displayvalue: string | undefined;
  @Input() geometry!: BufferGeometry;
  @Input() material!: Material;

  constructor(
    @Optional() private chart: ColumnChart,
  ) { }

  ngOnDestroy(): void {
    if (this.chart)
      this.chart.removeColumn(this);
  }

  ngOnInit(): void {
    if (!this.chart) return;

    this.chart.addColumn(this);
  }
}
