import { Directive, EventEmitter, Injectable, OnInit, Output } from "@angular/core";

import { Object3D } from "three";
import { NgtObject } from "@angular-three/core";

import { FlatUIList, ListItem } from "./list/list.component";

export const DRAG_START_EVENT = 'flat-ui-dragstart';
export const DRAG_END_EVENT = 'flat-ui-dragend';
export const DRAG_DROP_EVENT = 'flat-ui-drop';

export interface DropEvent {
  //list?: Array<ListItem>;
  value: any;
}

@Injectable()
export class DropListService {
  droplist: Array<Object3D> = [];

  source?: Array<ListItem>;

  addlist(object: Object3D) {
    this.droplist.push(object);
  }

  start(data: any) {
    this.droplist.forEach(object => object.dispatchEvent({ type: DRAG_START_EVENT, data }))
  }

  dropped(data: any) {
    this.droplist.forEach(object => object.dispatchEvent({ type: DRAG_DROP_EVENT, data }))
  }
}


@Directive({
  selector: '[drop-list]',
  exportAs: 'dropList',
})
export class DropListDirective implements OnInit {

  @Output() dropped = new EventEmitter<DropEvent>();


  constructor(
    public dropservice: DropListService,
    public list: FlatUIList,
  ) { }

  ngOnInit(): void {
    this.list.ready.subscribe(next => {
      const mesh = this.list.mesh;

      this.dropservice.addlist(mesh);

      mesh.addEventListener(DRAG_DROP_EVENT, (e: any) => {
        if (this.list.isover) {
          this.dropped.next({ value: e.data });
        }
        setTimeout(() => {
          this.list.refresh();
        }, 0)
      });
    });
  }
}

@Directive({
  selector: '[draggable]',
  exportAs: 'draggable'
})
export class DraggableDirective implements OnInit {
  constructor(
    private dropservice: DropListService,
    private ngtobject: NgtObject,
  ) { }

  ngOnInit(): void {
    const object = this.ngtobject.instance.value;
    object.addEventListener(DRAG_START_EVENT, (e: any) => { this.dropservice.start(e.data) });
    object.addEventListener(DRAG_END_EVENT, (e: any) => { this.dropservice.dropped(e.data) });
  }
}
