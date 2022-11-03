import { AfterViewInit, ChangeDetectionStrategy, Component, ContentChild, Input, TemplateRef, ViewChild } from "@angular/core";

import { Group, Object3D } from "three";
import { NgtObjectProps, NgtVector2 } from "@angular-three/core";
import { LAYOUT_EVENT } from "../flat-ui-utils";
import { FlatUIDataGridColumn } from "../data-grid-column/data-grid-column.component";


@Component({
  selector: 'flat-ui-data-grid[datasource]',
  exportAs: 'flatUIDataGrid',
  templateUrl: './data-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FlatUIDataGrid extends NgtObjectProps<Group> {
  @Input() margin: NgtVector2 = 0.01;
  @Input() datasource!: Array<any>;

  @Input() rowcount = 5;
  @Input() rowheight = 0.1;

  private _displaycolumns: Array<string> = []
  @Input()
  get displaycolumns(): Array<string> { return this._displaycolumns }
  set displaycolumns(newvalue: Array<string>) {
    this._displaycolumns = newvalue;
    this.updatecolumns();
  }

  private updatecolumns() {
    this.columns.length = 0;
    this._displaycolumns.forEach(name => {
      const column = this._columns.find(item => item.name == name);
      if (column) this.columns.push(column);
    });
  }

  private _columns: Array<FlatUIDataGridColumn> = [];

  columns: Array<FlatUIDataGridColumn> = [];

  addcolumn(column: FlatUIDataGridColumn) {
    this._columns.push(column);
    column.rows = this.datasource;
    this.updatecolumns();
  }

  private firstdrawindex = 0;

  data: Array<any> = [];

  private updaterows() {
    let drawindex = this.firstdrawindex;

    // if the whole list is shorter than what can be displayed, start from the first item in the list
    if (this.datasource.length < this.rowcount) {
      this.firstdrawindex = drawindex = 0;
    }

    this.data.length = 0;

    for (let i = 0; i < this.rowcount; i++) {
      if (drawindex < this.datasource.length)
        this.data.push(this.datasource[drawindex++]);
      else
        this.data.push({});
    }
  }

  override ngOnInit() {
    super.ngOnInit();

    this.updaterows();
  }
}
