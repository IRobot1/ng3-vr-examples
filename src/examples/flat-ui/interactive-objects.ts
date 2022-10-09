import { Object3D } from "three";


export class InteractiveObjects {
  private _list: Array<Object3D> = [];

  get list(): Array<Object3D> { return this._list; }

  add(...object: Object3D[]) {
    this._list.push(...object);
  }

  remove(...object: Object3D[]) {
    object.forEach(item => {
      const index = this._list.findIndex(x => x == item);
      if (index != undefined && index != -1)
        this._list.splice(index, 1);
    });
  }
}
