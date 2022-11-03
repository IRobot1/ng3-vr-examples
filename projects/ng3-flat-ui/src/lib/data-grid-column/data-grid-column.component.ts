import { ChangeDetectionStrategy, Component, ContentChild, Input, OnInit, Optional, TemplateRef } from "@angular/core";

import { FlatUIDataGrid } from "../data-grid/data-grid.component";


@Component({
  selector: 'flat-ui-data-grid-column[name]',
  exportAs: 'flatUIDataGridColumn',
  template: '', // rendered in data grid
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FlatUIDataGridColumn implements OnInit {
  @Input() name!: string;
  @Input() rows: Array<any> = [];
  @Input() width = 0.5;
  @Input() height = 0.1;

  @ContentChild('columnRow')
  columnRow!: TemplateRef<any>;

  constructor(
    @Optional() public datagrid: FlatUIDataGrid,
  ) { }

  ngOnInit(): void {
    if (!this.datagrid) return;

    this.datagrid.addcolumn(this);
  }
}
