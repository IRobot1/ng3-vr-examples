import { HTMLString } from "../../htmlgui";
import { Controller } from "./controller"

export class GUIFactory {

  private static controllers = new Map<string, () => Controller>([])

  static create(type: string): Controller {
    const x = this.controllers.get(type);
    if (x)
      return x();
    throw 'test';
  }

  static register(type: string, create: () => Controller) {
    this.controllers.set(type, create);
  }

  static get count(): number { return this.controllers.size }
}

