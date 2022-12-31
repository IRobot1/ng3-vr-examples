import { Color, Vector2, Vector3 } from "three";
import { Block, BooleanBlock, ExpressionBlock, NotBlock, NumberBlock, ArithmeticBlock, StringBlock, VariableBlock, AssignmentBlock, ComparisonBlock, LogicalBlock, BitwiseBlock, DefineFunctionBlock, IfBlock, WhileBlock, ForBlock, CallFunctionBlock, ColorBlock, Vector2Block, Vector3Block } from "./types";

export class ShapewareInterpreter {
  interpret(block: Block, context = {}): any {
    for (const statement of block.statements) {
      const type = statement.type;
      switch (statement.type) {
        case 'variable':
          this.updateVariable(statement, statement.value, context);
          break;
        case 'assignment':
          this.evalAssignment(statement as AssignmentBlock, context)
          break;
        case 'expression':
          return this.evalExpression(statement, context);
          break;
        case 'function':
          return this.evalFunction(statement, context);
          break;
        case 'call':
          return this.evalCall(statement, context);
          break;
        case 'return':
          return this.evalExpression(statement.return, context);
          break;
        case 'if':
          this.evalIf(statement, context);
          break;
        case 'while':
          this.evalWhile(statement, context);
          break;
        case 'for':
          this.evalFor(statement, context);
          break;
      }
    }
  }

  private evalWhile(statement: WhileBlock, context: any) {
    const start = Date.now();
    let infinite = false;

    while (this.evalExpression(statement.while, context)) {
      if (Date.now() - start > 1000) {
        infinite = true;
        break;
      }
      this.interpret(statement.body, context);
    }
    if (infinite) {
      throw `Potental infinite loop: while loop took ${Date.now() - start}ms to execute`;
    }
  }

  private forUpdate(updates: Array<AssignmentBlock | ArithmeticBlock>, context: any) {
    updates.forEach(item => {
      if (item.type == 'arithmetic') {
        this.evalArithmetic(item, context)
      }
      else if (item.type == 'assignment') {
        this.evalAssignment(item, context)
      }
    });
  }

  private evalFor(statement: ForBlock, context: any) {
    const start = Date.now();
    let infinite = false;

    for (
      statement.init.forEach(item => this.evalAssignment(item, context));
      this.evalExpression(statement.condition, context);
      this.forUpdate(statement.update, context)
    ) {
      if (Date.now() - start > 1000) {
        infinite = true;
        break;
      }
      this.interpret(statement.body, context);
    }
    if (infinite) {
      throw `Potental infinite loop: for loop took ${Date.now() - start}ms to execute`;
    }
  }

  private evalIf(statement: IfBlock, context: any) {
    if (this.evalExpression(statement.if, context)) {
      this.interpret(statement.then, context);
    } else if (statement.else) {
      this.interpret(statement.else, context);
    }
  }

  private evalFunction(statement: DefineFunctionBlock, context: any): any {
    if (statement.callback) {
      context[statement.name] = statement.callback;
    }
    else {
      const self = this;
      context[statement.name] = function (...args: any[]): any {
        if (statement.body)
          return self.interpret(statement.body, context);
      }
    }
  }

  private evalCall(statement: CallFunctionBlock, context: any): any {
    const args: Array<any> = [];
    statement.args?.forEach(arg => {
      args.push(this.evalExpression(arg, context));
    });

    return context[statement.name](args);
  }

  private updateVariable(variable: VariableBlock, value: any, context: any) {
    if (variable.object)
      variable.object[variable.name] = value;
    else if (!context[variable.name])
      context[variable.name] = value;
  }

  private checkUpdateVariable(block: ExpressionBlock, value: any, context: any) {
    if (block.expression.type == 'variable') {
      this.updateVariable(block.expression, value, context);
    }
  }

  private evalArithmetic(block: ArithmeticBlock, context: any): any {
    const left = this.evalExpression(block.left, context);

    if (block.right) {
      const right = this.evalExpression(block.right, context);

      switch (block.operation) {
        case '*':
          return left * right;
          break;
        case '/':
          return left / right;
          break;
        case '%':
          return left % right;
          break;
        case '+':
          return left + right;
          break;
        case '-':
          return left - right;
          break;
        case '**':
          return left ** right;
          break;
      }
    }
    else {
      switch (block.operation) {
        case '++':
          let leftnumber1 = left as number;
          leftnumber1++;
          this.checkUpdateVariable(block.left, leftnumber1, context);
          return leftnumber1;
          break;
        case '--':
          let leftnumber2 = left as number;
          leftnumber2--;
          this.checkUpdateVariable(block.left, leftnumber2, context);
          return leftnumber2;
          break;
        default:
          console.warn(`arithmetic operation ${block.operation} missing right side expression`);
          break;
      }
    }
  }

  private evalAssignment(block: AssignmentBlock, context: any): any {
    let left = this.evalExpression(block.left, context);
    const right = this.evalExpression(block.right, context);

    switch (block.assignment) {
      case '=':
        if (left instanceof Color) {
          left.copy(right)
        }
        else if (left instanceof Vector2) {
          left.copy(right)
        }
        else if (left instanceof Vector3) {
          left.copy(right)
        }
        else
          left = right;
        break;
      case '+=':
        left += right;
        break;
      case '-=':
        left -= right;
        break;
      case '*=':
        left *= right;
        break;
      case '/=':
        left /= right;
        break;
      case '%=':
        left %= right;
        break;
      case '**=':
        left **= right;
        break;
    }
    this.checkUpdateVariable(block.left, left, context);
  }

  private evalLogical(block: LogicalBlock, context: any): any {
    let left = this.evalExpression(block.left, context);
    const right = this.evalExpression(block.right, context);

    switch (block.logical) {
      case '&&':
        return left && right
        break;
      case '||':
        return left || right
        break;
    }
  }

  private evalBitwise(block: BitwiseBlock, context: any): any {
    let left = this.evalExpression(block.left, context);
    const right = this.evalExpression(block.right, context);

    switch (block.bitwise) {
      case '&':
        return left & right
        break;
      case '|':
        return left | right
        break;
      case '~':
        return ~left; // note https://www.w3schools.com/js/js_bitwise.asp
        break;
      case '^':
        return left ^ right
        break;
      case '<<':
        return left << right
        break;
      case '>>':
        return left >> right
        break;
      case '>>>':
        return left >>> right
        break;
    }
  }

  private evalVariable(variable: VariableBlock, context: any): any {
    if (variable.object)
      return variable.object[variable.name]
    else
      return context[variable.name];
  }

  private evalNumberOrVariable(red: NumberBlock | VariableBlock, context: any): number {
    if (red.type == 'number') {
      return red.value;
    }
    else if (red.type == 'variable') {
      return this.evalVariable(red, context);
    }
    return 0;
  }

  private evalExpression(block: ExpressionBlock, context: any): any {
    switch (block.expression.type) {
      case 'number':
        return (block.expression as NumberBlock).value;
        break;
      case 'string':
        return (block.expression as StringBlock).value;
        break;
      case 'boolean':
        return (block.expression as BooleanBlock).value;
        break;
      case 'variable':
        return this.evalVariable(block.expression, context);
        break;
      case 'color':
        const color = block.expression as ColorBlock;
        return new Color(
          this.evalNumberOrVariable(color.red, context),
          this.evalNumberOrVariable(color.green, context),
          this.evalNumberOrVariable(color.blue, context)
        );
        break;
      case 'vector2':
        const v2 = block.expression as Vector2Block;
        return new Vector2(
          this.evalNumberOrVariable(v2.x, context),
          this.evalNumberOrVariable(v2.y, context),
        );
        break;
      case 'vector3':
        const v3 = block.expression as Vector3Block;
        return new Vector3(
          this.evalNumberOrVariable(v3.x, context),
          this.evalNumberOrVariable(v3.y, context),
          this.evalNumberOrVariable(v3.z, context),
        );
        break;
      case 'expression':
        const expression = (block.expression as ExpressionBlock).expression as ExpressionBlock;
        return this.evalExpression(expression, context);
        break;
      case 'arithmetic':
        return this.evalArithmetic(block.expression as ArithmeticBlock, context)
        break;
      case 'not':
        const notexpression = (block.expression as NotBlock).value as ExpressionBlock;
        return !this.evalExpression(notexpression, context)
      case 'comparison':
        return this.evalComparison(block.expression as ComparisonBlock, context)
        break;
      case 'logical':
        return this.evalLogical(block.expression as LogicalBlock, context)
        break;
      case 'bitwise':
        return this.evalBitwise(block.expression as BitwiseBlock, context)
        break;
    }

  }


  private evalComparison(block: ComparisonBlock, context: any): any {
    let left = this.evalExpression(block.left, context);
    const right = this.evalExpression(block.right, context);

    switch (block.comparison) {
      case '==':
        return left == right;
        break;
      case '!=':
        return left != right;
        break;
      case '>':
        return left > right;
        break;
      case '>=':
        return left >= right;
        break;
      case '<':
        return left < right;
        break;
      case '<=':
        return left <= right;
        break;
    }
  }

}
