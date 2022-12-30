import { Component, OnInit } from "@angular/core";
import { Mesh } from "three";
import { assignmentExample } from "./code-examples/assignment-examples";
import { bitwiseExample, comparisonExample, logicalExample, operationExample, variableGetSetExample, variableNotExample } from "./code-examples/expression-examples";
import { forExample } from "./code-examples/for-examples";
import { builtinFunctionExample, callFunctionExample, defineFunctionExample } from "./code-examples/function-examples";
import { ifExample } from "./code-examples/if-examples";
import { whileExample } from "./code-examples/while-examples";
import { ShapewareInterpreter } from "./code/interpret";
import { mathFunctions } from "./code/math-blocks";
import { ShapewareJavascript } from "./code/translate";
import { Block } from "./code/types";

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
    let widthchange = 0.1;
    let heightchange = 0.1;

    //const context = {}
    //const result = this.code.interpret(this.paramAssignment, context);
    //console.warn(result, context, this.params)

    //bitwiseExample, comparisonExample, logicalExample, operationExample, variableGetSetExample, variableNotExample
    const code = this.js.translate(defineFunctionExample);
    console.warn(code);

    //for (let x = 1, y = 1; x < 10 || y < 10 ; x+=1, y++) {
    //  ++x
    //  y += 10
    //}
    const context = {}
    this.code.interpret(mathFunctions, context);
    
    try {
      let result = this.code.interpret(defineFunctionExample, context);
      console.warn(result, context)

      result = this.code.interpret(callFunctionExample, context);
      console.warn(result, context)

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
  }

  tick(mesh: Mesh) {
    //mesh.rotation.y += 0.01;
    this.code.interpret(this.meshBlock);
  }
}
