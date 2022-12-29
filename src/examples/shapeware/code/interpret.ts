import { Block, BooleanBlock, ExpressionBlock, NotBlock, NumberBlock, ArithmeticBlock, StringBlock, VariableBlock, AssignmentBlock, ComparisonBlock, LogicalBlock, BitwiseBlock } from "./types";

export class ShapewareInterpreter {
  interpret(block: Block, context: any): any {
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
      }
    }
  }

  private updateVariable(variable: VariableBlock, value: any, context: any) {
    if (variable.object)
      variable.object[variable.name] = value;
    else
      context[variable.name] = value;
  }

  private checkUpdateVariable(block: ExpressionBlock, value: any, context: any) {
    if (block.expression.type == 'variable') {
      this.updateVariable(block.expression, value, context);
    }
  }

  private evalArithmetic(block: ArithmeticBlock, context: any): any {
    const left = this.evalExpression(block.left, context);
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
    }
  }

  private evalAssignment(block: AssignmentBlock, context: any): any {
    let left = this.evalExpression(block.left, context);
    const right = this.evalExpression(block.right, context);

    switch (block.assignment) {
      case '=':
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
        const variable = block.expression as VariableBlock;
        if (variable.object)
          return variable.object[variable.name]
        else
          return context[variable.name];
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
