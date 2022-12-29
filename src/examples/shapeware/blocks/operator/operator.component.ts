import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

import { Group, Mesh } from "three";
import { NgtObjectProps } from "@angular-three/core";

import { ExpressionShapeComponent } from "../../shapes/expression/expression.component";
import { GlobalShapeTheme } from "../../shape-theme";

export type OperatorTypes = '+' | '-' | '*' | '/' | '%'

@Component({
  selector: 'operator-block',
  exportAs: 'operatorBlock',
  templateUrl: './operator.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  //  standalone: true,
  //  imports: [
  //    NgtMesh,
  //  ]
})
export class OperatorBlockComponent extends NgtObjectProps<Mesh> {
  @Input() op1text = '';
  @Input() op2text = '';
  @Input() operator: OperatorTypes = '+';

  protected labelmaterial = GlobalShapeTheme.LabelMaterial;
  protected textmaterial = GlobalShapeTheme.TextMaterial;

  protected inst!: ExpressionShapeComponent;
  protected opmesh!: Group;
  protected shape2mesh!: Mesh;

  private widthA = 0;
  private widthO = 0;
  private widthB = 0;
  private updateFlag = true;

  protected op1width(newvalue: number, expression: ExpressionShapeComponent, label: Group) {
    label.position.x = newvalue / 2;
    this.widthA = expression.width = newvalue;
    this.updateFlag = true;
  }

  protected operatorwidth(newvalue: number, label: Group) {
    this.widthO = newvalue + 0.05;
    this.updateFlag = true;
  }

  protected op2width(newvalue: number, expression: ExpressionShapeComponent, label: Group) {
    label.position.x = newvalue / 2;
    this.widthB = expression.width = newvalue;
    this.updateFlag = true;
  }

  draw() {
    if (this.updateFlag) {
      this.inst.width = this.widthA + this.widthO + this.widthB + 0.08;

      this.opmesh.position.x = this.widthA + this.widthO;
      this.shape2mesh.position.x = this.widthA + this.widthO + 0.1 ;
      this.updateFlag = false;
    }
  }
}
