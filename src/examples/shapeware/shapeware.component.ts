import { Component, OnInit } from "@angular/core";
import { assignmentExample } from "./code-examples/assignment-examples";
import { bitwiseExample, comparisonExample, logicalExample, operationExample, variableGetSetExample, variableNotExample } from "./code-examples/expression-examples";
import { callbackExample, functionExample } from "./code-examples/function-examples";
import { ShapewareInterpreter } from "./code/interpret";
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
    const context = {}
    const result = this.code.interpret(callbackExample, context);
    console.warn(result, context)

    const code = this.js.translate(callbackExample);
    console.warn(code);

    console.warn(eval(code))

    //setInterval(() => {
    //  if (this.width > 2 || this.width < 0.8)
    //    widthchange = -widthchange;
    //  this.width += widthchange;

    //  if (this.height > 1 || this.height < 0.1)
    //    heightchange = -heightchange;
    //  //this.height += heightchange;
    //}, 1000)
  }

}
