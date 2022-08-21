import { Component } from "@angular/core";

import { AnyConstructor, NgtCommonGeometry, provideCommonGeometryRef, provideNgtCommonGeometry } from "@angular-three/core";

import { RoundedBoxGeometry } from 'three-stdlib';

@Component({
  selector: 'rounded-box-geometry',
  template: `<ng-content></ng-content>`,
  providers: [provideNgtCommonGeometry(RoundedBoxGeometryComponent), provideCommonGeometryRef(RoundedBoxGeometryComponent)],

})
export class RoundedBoxGeometryComponent extends NgtCommonGeometry<RoundedBoxGeometry>  {
  static ngAcceptInputType_args: ConstructorParameters<typeof RoundedBoxGeometry> | undefined;

  // defaults - width = 1, height = 1, depth = 1, segments = 2, radius = 0.1

  get geometryType(): AnyConstructor<RoundedBoxGeometry> {
    return RoundedBoxGeometry;
  }
}
