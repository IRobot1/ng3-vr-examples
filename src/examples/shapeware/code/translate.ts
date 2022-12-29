import { Block, BooleanBlock, ExpressionBlock, NotBlock, NumberBlock, ArithmeticBlock, StringBlock, VariableBlock, AssignmentBlock, ComparisonBlock, LogicalBlock, BitwiseBlock } from "./types";

export class ShapewareJavascript {
  translate(block: Block): string {
    const lines : Array<string> = []
    for (const statement of block.statements) {
      const type = statement.type;
      switch (statement.type) {
        case 'variable':
          lines.push(`let ${statement.name} = ${statement.value};`);
          break;
        case 'assignment':
          lines.push(this.translateAssignment(statement as AssignmentBlock));
          break;
        case 'expression':
          lines.push(this.translateExpression(statement));
          break;
      }
    }
    return lines.join('\n');
  }

  private translateArithmetic(block: ArithmeticBlock): string {
    const left = this.translateExpression(block.left);

    switch (block.operation) {
      case '++':
        return `++${left}`;
        break;
      case '--':
        return `--${left}`;
        break;
      default:
        const right = this.translateExpression(block.right);
        return `let ${left} ${block.operation} ${right}`;
        break;
    }

  }

  private translateAssignment(block: AssignmentBlock): string {
    let left = this.translateExpression(block.left);
    const right = this.translateExpression(block.right);

    return `${left} ${block.assignment} ${right}`;
  }

  private translateLogical(block: LogicalBlock): string {
    let left = this.translateExpression(block.left);
    const right = this.translateExpression(block.right);

    return `${left} ${block.logical} ${right}`;
  }

  private translateBitwise(block: BitwiseBlock): string {
    let left = this.translateExpression(block.left);

    switch (block.bitwise) {
      case '~':
        return `~${left}`
        break;
      default:
        const right = this.translateExpression(block.right);
        return `${left} ${block.bitwise} ${right}`;
        break;
    }
  }

  private translateExpression(block: ExpressionBlock): string {
    switch (block.expression.type) {
      case 'number':
        return (block.expression as NumberBlock).value.toString();
        break;
      case 'string':
        return (block.expression as StringBlock).value;
        break;
      case 'boolean':
        return (block.expression as BooleanBlock).value.toString();
        break;
      case 'variable':
        return (block.expression as VariableBlock).name
        break;
      case 'expression':
        const expression = (block.expression as ExpressionBlock).expression as ExpressionBlock;
        return this.translateExpression(expression);
        break;
      case 'arithmetic':
        return this.translateArithmetic(block.expression as ArithmeticBlock)
        break;
      case 'not':
        const notexpression = (block.expression as NotBlock).value as ExpressionBlock;
        return `!${this.translateExpression(notexpression)}`
      case 'comparison':
        return this.translateComparison(block.expression as ComparisonBlock)
        break;
      case 'logical':
        return this.translateLogical(block.expression as LogicalBlock)
        break;
      case 'bitwise':
        return this.translateBitwise(block.expression as BitwiseBlock)
        break;
    }

  }

  private translateComparison(block: ComparisonBlock): string {
    let left = this.translateExpression(block.left);
    const right = this.translateExpression(block.right);

    return `${left} ${block.comparison} ${right}`;
  }

}
