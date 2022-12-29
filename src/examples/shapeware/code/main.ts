import { Block, BooleanBlock, ExpressionBlock, NotBlock, NumberBlock, ArithmeticBlock, StringBlock, VariableBlock } from "./types";

export class ShapewareCode {
  interpret(block: Block, context: any): any {
    for (const statement of block.statements) {
      const type = statement.type;
      console.warn('exec', type);
      switch (statement.type) {
        case 'variable':
          context[statement.name] = statement.value;
          break;
        case 'expression':
          return this.evalExpression(statement, context);
          break;
      }
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
        if (block.left.expression.type == 'variable') {
          const variable = block.left.expression as VariableBlock;
          context[variable.name] = leftnumber1;
        }
        return leftnumber1;
        break;
      case '--':
        let leftnumber2 = left as number;
        leftnumber2--;
        if (block.left.expression.type == 'variable') {
          const variable = block.left.expression as VariableBlock;
          context[variable.name] = leftnumber2;
        }
        return leftnumber2;
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
        return context[(block.expression as VariableBlock).name];
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
    }
    
  }
}
