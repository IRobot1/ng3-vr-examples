import { Component, OnInit } from "@angular/core";
import { assignmentExample } from "./code-examples/assignment-examples";
import { operationExample, variableGetSetExample, variableNotExample } from "./code-examples/expression-examples";
import { ShapewareCode } from "./code/main";

@Component({
  templateUrl: './shapeware.component.html',
})
export class ShapewareExample implements OnInit {
  width = 0.8
  height = 0

  log(text: string, data: any) {
    console.warn(text, data)
  }

  code = new ShapewareCode();

  ngOnInit(): void {
    let widthchange = 0.1;
    let heightchange = 0.1;

    const context = {}
    const result = this.code.interpret(assignmentExample, context);
    console.warn(result, context)

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
