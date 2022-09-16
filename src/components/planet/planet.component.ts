import { Component, Input, OnInit } from "@angular/core";

import { Mesh, sRGBEncoding, Texture } from "three";
import { NgtObjectProps, NgtTriple, provideNgtInstance, provideNgtObject } from "@angular-three/core";


@Component({
  selector: 'planet',
  exportAs: 'planet',
  templateUrl: './planet.component.html',
})
export class PlanetComponent implements OnInit {
  @Input() position = [0, 0, 0] as NgtTriple;
  @Input() rotation = [0, 0, 0] as NgtTriple;
  @Input() scale = [1, 1, 1] as NgtTriple;

  mesh!: Mesh;

  private _surfaceMap!: Texture;
  @Input()
  get surfaceMap(): Texture { return this._surfaceMap }
  set surfaceMap(newvalue: Texture) {
    this._surfaceMap = newvalue;
    if (newvalue) {
      newvalue.encoding = sRGBEncoding;
    }
  }

  private _metalnessMap!: Texture;
  @Input()
  get metalnessMap(): Texture { return this._metalnessMap }
  set metalnessMap(newvalue: Texture) {
    this._metalnessMap = newvalue;
    if (newvalue) {
    }
  }

  private _normalMap!: Texture;
  @Input()
  get normalMap(): Texture { return this._normalMap }
  set normalMap(newvalue: Texture) {
    this._normalMap = newvalue;
    if (newvalue) {
    }
  }

  ngOnInit() {
    if (!this.surfaceMap) {
      console.error('planet surface texture missing');
      return;
    }
  }
}
