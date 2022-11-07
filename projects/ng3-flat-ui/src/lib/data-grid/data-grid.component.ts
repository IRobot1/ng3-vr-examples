import { ChangeDetectionStrategy, Component, ContentChild, EventEmitter, Input, Output, TemplateRef } from "@angular/core";

import { Group, Object3D } from "three";
import { NgtObjectProps, NgtVector2 } from "@angular-three/core";

import { FlatUIDataGridColumn } from "../data-grid-column/data-grid-column.component";
import { Paging } from "../flat-ui-utils";

class GridData {
  constructor(public data: any) { }
}

@Component({
  selector: 'flat-ui-data-grid[datasource]',
  exportAs: 'flatUIDataGrid',
  templateUrl: './data-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FlatUIDataGrid extends NgtObjectProps<Group> implements Paging {
  @Input() vmargin: NgtVector2 = 0.01;
  @Input() hmargin: NgtVector2 = 0.01;
  @Input() datasource!: Array<any>;

  private _rowcount = 5;
  @Input()
  get rowcount(): number { return this._rowcount }
  set rowcount(newvalue: number) {
    this._rowcount = newvalue;

    // reset columns and rows to force a full redraw
    this.columns.length = 0;
    this.rows.length = 0;

    requestAnimationFrame(() => {
      this.updatecolumns();
      this.refresh();

      this.heightchange.next(0) // recalculate height
    })
  }

  @Input() rowheight = 0.1;

  @Input() pivot = true;

  @Output() widthchange = new EventEmitter<number>();
  @Output() heightchange = new EventEmitter<number>();

  private _width = 0;
  get width(): number { return this._width }
  protected set width(newvalue: number) {
    this._width = newvalue;
    this.widthchange.next(newvalue);
  }

  private _height = 0;
  get height(): number { return this._height }
  protected set height(newvalue: number) {
    this._height = newvalue;
    this.heightchange.next(newvalue);
  }

  @ContentChild('columnHeader')
  protected columnHeader!: TemplateRef<any>;

  @ContentChild('columnFooter')
  protected columnFooter!: TemplateRef<any>;

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

  protected columns: Array<FlatUIDataGridColumn> = [];

  addcolumn(column: FlatUIDataGridColumn) {
    this._columns.push(column);
    column.rows = this.datasource;
    this.updatecolumns();
  }

  private firstdrawindex = 0;
  get firstindex(): number { return this.firstdrawindex }
  get length(): number { return this.datasource.length }
  get pagesize(): number { return this.rowcount }

  protected rows: Array<GridData> = [];

  refresh() {
    let drawindex = this.firstdrawindex;

    // if the whole list is shorter than what can be displayed, start from the first item in the list
    if (this.datasource.length < this.rowcount) {
      this.firstdrawindex = drawindex = 0;
    }

    for (let i = 0; i < this.rowcount; i++) {
      let value = {}
      if (drawindex < this.datasource.length)
        value = this.datasource[drawindex++];

      if (this.rows.length < this.rowcount)
        this.rows.push(new GridData(value));
      else
        this.rows[i].data = value;
    }
  }

  movefirst() {
    this.firstdrawindex = 0;
    this.refresh();
  }

  moveprevious() {
    if (this.firstdrawindex) {
      this.firstdrawindex--;
      this.refresh();
    }
  }

  movenext() {
    if (this.datasource.length > this.rowcount && this.firstdrawindex < this.datasource.length - this.rowcount) {
      this.firstdrawindex++;
      this.refresh();
    }
  }

  movelast() {
    this.firstdrawindex = Math.max(this.datasource.length - this.rowcount, 0);
    this.refresh();
  }

  override ngOnInit() {
    super.ngOnInit();

    this.refresh();
  }
}
