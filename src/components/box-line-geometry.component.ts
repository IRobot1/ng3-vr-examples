import { Component } from "@angular/core";

import { AnyConstructor, NgtCommonGeometry, provideCommonGeometryRef, provideNgtCommonGeometry } from "@angular-three/core";

import { BoxLineGeometry } from 'three-stdlib';

@Component({
  selector: 'box-line-geometry',
  template: `<ng-content></ng-content>`,
  providers: [provideNgtCommonGeometry(BoxLineGeometryComponent), provideCommonGeometryRef(BoxLineGeometryComponent)],

})
export class BoxLineGeometryComponent extends NgtCommonGeometry<BoxLineGeometry>  {
  static ngAcceptInputType_args: ConstructorParameters<typeof BoxLineGeometry> | undefined;

  get geometryType(): AnyConstructor<BoxLineGeometry> {
    return BoxLineGeometry;
  }
}
