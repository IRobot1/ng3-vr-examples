import { Component, OnInit } from "@angular/core";
import { Color, Euler, Mesh, MeshBasicMaterial, Vector2, Vector3 } from "three";
import { assignmentExample } from "./code-examples/assignment-examples";
import { bitwiseExample, colorExample, comparisonExample, logicalExample, operationExample, rotationExample, variableGetSetExample, variableNotExample, vector2Example, vector3Example } from "./code-examples/expression-examples";
import { forExample } from "./code-examples/for-examples";
import { builtinFunctionExample, callFunctionExample, defineFunctionExample } from "./code-examples/function-examples";
import { ifExample } from "./code-examples/if-examples";
import { whileExample } from "./code-examples/while-examples";
import { ShapewareInterpreter } from "./code/interpret";
import { mathFunctions } from "./code/math-blocks";
import { ShapewareJavascript } from "./code/translate";
import { AssignmentBlock, Block, ColorBlock, ExpressionBlock } from "./code/types";

@Component({
  templateUrl: './shapeware.component.html',
})
export class ShapewareExample implements OnInit {
  width = 0.8
  height = 0

  log(text: string, data: any) {
    console.warn(text, data)
  }

  code = new ShapewareInterpreter();
  js = new ShapewareJavascript();

  params = {
    x: 5,
    y: 99
  }

  paramAssignment: Block = {
    type: 'block',
    statements: [
      {
        type: 'assignment',
        assignment: '=',
        left: {
          type: 'expression',
          expression: {
            type: 'variable',
            object: this.params,
            name: 'x'
          }
        },
        right: {
          type: 'expression',
          expression: {
            type: 'variable',
            object: this.params,
            name: 'y'
          }
        }

      }
    ]
  }


  ngOnInit(): void {
    (window as any).Color = Color;
    (window as any).Vector2 = Vector2;
    (window as any).Vector3 = Vector3;
    (window as any).Euler = Euler;

    let widthchange = 0.1;
    let heightchange = 0.1;

    //const context = {}
    //const result = this.code.interpret(this.paramAssignment, context);
    //console.warn(result, context, this.params)

    //bitwiseExample, comparisonExample, logicalExample, operationExample, variableGetSetExample, variableNotExample
    const code = this.js.translate(rotationExample);
    console.warn(code);

    const context = {}
    this.code.interpret(mathFunctions, context);

    try {
      let result = this.code.interpret(rotationExample, context);
      console.warn(result, context)

      //result = this.code.interpret(callFunctionExample, context);
      //console.warn(result, context)

      console.warn(eval(code))
    }
    catch (e) { console.error(e) }

    //setInterval(() => {
    //  if (this.width > 2 || this.width < 0.8)
    //    widthchange = -widthchange;
    //  this.width += widthchange;

    //  if (this.height > 1 || this.height < 0.1)
    //    heightchange = -heightchange;
    //  //this.height += heightchange;
    //}, 1000)
  }


  meshBlock!: Block;
  colorBlock!: Block;
  colorContext: any = {}

  meshready(mesh: Mesh) {
    this.meshBlock = {
      type: 'block',
      statements: [
        {
          type: 'assignment',
          assignment: '+=',
          left: {
            type: 'expression',
            expression: {
              type: 'variable',
              object: mesh.rotation,
              name: 'y'
            }
          },
          right: {
            type: 'expression',
            expression: {
              type: 'number',
              value: 0.01
            }
          }
        }
      ]
    }

    this.colorBlock = {
      type: 'block',
      statements: [
        {
          type: 'variable',
          name: 'red',
          value: 0
        },
        {
          type: 'assignment',
          assignment: '=',
          left: {
            type: 'expression',
            expression: {
              type: 'variable',
              object: (mesh.material as MeshBasicMaterial),
              name: 'color'
            }
          },
          right: {
            type: 'expression',
            expression: {
              type: 'color',
              red: {
                type: 'variable',
                name: 'red'
              },
              green: {
                type: 'number',
                value: 0
              },
              blue: {
                type: 'number',
                value: 0
              },
            }
          }

        }

      ]
    }
    //this.code.interpret(this.colorBlock, this.colorContext);
  }

  tick(mesh: Mesh) {
    this.colorContext.red += 1 / 255;
    if (this.colorContext.red > 1) this.colorContext.red = 0;
    
    this.code.interpret(this.colorBlock, this.colorContext);

    //mesh.rotation.y += 0.01;
    this.code.interpret(this.meshBlock);
  }
}
