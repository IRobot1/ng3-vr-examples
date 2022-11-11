import { Directive, Injectable, OnInit } from "@angular/core";

import { Object3D } from "three";
import { NgtObject } from "@angular-three/core";

import { ListItem } from "ng3-flat-ui";

export const DRAG_START_EVENT = 'flat-ui-dragstart';
export const DRAG_END_EVENT = 'flat-ui-dragend';
export const DRAG_DROP_EVENT = 'flat-ui-drop';

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
  providers: [DropListService]
})
export class DropListDirective implements OnInit {
  constructor(
    public dropservice: DropListService,
    public ngtobject: NgtObject,
  ) { }

  ngOnInit(): void {
    const object = this.ngtobject.instance.value;
    console.warn(object)
    this.dropservice.addlist(object);
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
