import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

import { Group, Mesh } from "three";

import { NgtObjectProps } from "@angular-three/core";
import { ExpressionShapeComponent } from "../../shapes/expression/expression.component";

@Component({
  selector: 'variable-block',
  exportAs: 'variableBlock',
  templateUrl: './variable.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  //  standalone: true,
  //  imports: [
  //    NgtMesh,
  //  ]
})
export class VariableBlockComponent extends NgtObjectProps<Mesh> {
  @Input() text = '';

  protected textwidth(newvalue: number, expression: ExpressionShapeComponent, label: Group) {
    label.position.x = newvalue / 2;
    expression.width = newvalue;
  }
}
