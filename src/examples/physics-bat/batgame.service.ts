import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class BatGame {
  private _remaining = 0;
  private _score = 0;

  private store = new BehaviorSubject({ score: this._score, remaining: this._remaining  });
  public gamestate$ = this.store.asObservable();

  constructor() {
    console.warn('start bat game')
  }

  get remaining(): number { return this._remaining }
  get score(): number { return this._score }

  private update() {
    this.store.next({ ...this.store.value, score: this._score, remaining: this._remaining  } );
  }

  reset(remaining: number) {
    this._remaining = remaining;
    this._score = 0;
    this.update();
  }

  addPoints(points: number) {
    this._score += points;
    this.update();
  }

  subRemaining(count: number = 1) {
    this._remaining -= count;
    this.update();
  }
}
