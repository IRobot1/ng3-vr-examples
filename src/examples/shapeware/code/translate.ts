import { Block, BooleanBlock, ExpressionBlock, NotBlock, NumberBlock, ArithmeticBlock, StringBlock, VariableBlock, AssignmentBlock, ComparisonBlock, LogicalBlock, BitwiseBlock, FunctionBlock, IfBlock, WhileBlock } from "./types";

export class ShapewareJavascript {
  translate(block: Block): string {
    const lines: Array<string> = []
    for (const statement of block.statements) {
      const type = statement.type;
      switch (statement.type) {
        case 'variable':
          lines.push(`let ${statement.name} = ${statement.value};`);
          break;
        case 'assignment':
          lines.push(`${this.translateAssignment(statement as AssignmentBlock)}`);
          break;
        case 'expression':
          lines.push(this.translateExpression(statement));
          break;
        case 'function':
          lines.push(this.translateFunction(statement));
          break;
        case 'return':
          lines.push(`return ${this.translateExpression(statement.return)}`);
          break;
        case 'if':
          lines.push(this.translateIf(statement));
          break;
        case 'while':
          lines.push(this.translateWhile(statement));
          break;

      }
    }
    return lines.join('\n');
  }


  private translateWhile(block: WhileBlock): string {
    return `while (${this.translateExpression(block.while)}) {
${this.translate(block.body)}
}`
  }

  private translateIf(block: IfBlock): string {
    let elsecode = '';
    if (block.else) elsecode = `else {
${this.translate(block.else)}
}`;

    return `if (${this.translateExpression(block.if)}) {
${this.translate(block.then)}
} ${elsecode}`
  }

  private translateFunction(block: FunctionBlock): string {
    const args: Array<string> = []
    block.args?.forEach(arg => {
      args.push(this.translateExpression(arg));
    });

    let body = '// runtime injected function'
    if (block.body) body = this.translate(block.body);

    return `function ${block.name}(${args.join(',')})
{
 ${body}
}
${block.name}(${args.join(',')})`;
  }

  private translateArithmetic(block: ArithmeticBlock): string {
    const left = this.translateExpression(block.left);

    if (block.right) {
      const right = this.translateExpression(block.right);
      return `${left} ${block.operation} ${right}`;
    }
    else {
      switch (block.operation) {
        case '++':
          return `++${left}`;
          break;
        case '--':
          return `--${left}`;
          break;
      }
    }
    return '';
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
        return `'${(block.expression as StringBlock).value}'`;
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
