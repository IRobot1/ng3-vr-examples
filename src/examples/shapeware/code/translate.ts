import { Color, Euler, Vector2, Vector3 } from "three";
import { Block, BooleanBlock, ExpressionBlock, NotBlock, NumberBlock, ArithmeticBlock, StringBlock, VariableBlock, AssignmentBlock, ComparisonBlock, LogicalBlock, BitwiseBlock, DefineFunctionBlock, IfBlock, WhileBlock, ForBlock, CallFunctionBlock, ColorBlock, Vector2Block, Vector3Block, RotationBlock } from "./types";

export class ShapewareJavascript {

  private translateVariable(block: VariableBlock): string {
    if (typeof block.value == 'string')
      return `'${block.value}'`
    else if (block.value instanceof Color) {
      return `new Color(${block.value.r},${block.value.g},${block.value.b})`
    }
    else if (block.value instanceof Vector2) {
      return `new Vector2(${block.value.x},${block.value.y})`
    }
    else if (block.value instanceof Vector3) {
      return `new Vector3(${block.value.x},${block.value.y},${block.value.z})`
    }
    else if (block.value instanceof Euler) {
      return `new Euler(${block.value.x},${block.value.y},${block.value.z})`
    }
    else
      return block.name
  }

  translate(block: Block): string {
    const lines: Array<string> = []
    block.statements.forEach(statement => {
      const type = statement.type;
      switch (statement.type) {
        case 'variable':
          lines.push(`let ${statement.name} = ${this.translateVariable(statement)};`);
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
        case 'call':
          lines.push(this.translateCall(statement));
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
        case 'for':
          lines.push(this.translateFor(statement));
          break;

      }
    })
    return lines.join('\n');
  }


  private translateFor(block: ForBlock): string {
    const init: Array<string> = []
    block.init.forEach(item => init.push(this.translateAssignment(item)));

    const updates: Array<string> = []
    block.update.forEach(item => {
      if (item.type == 'arithmetic') {
        updates.push(this.translateArithmetic(item))

      } else if (item.type == 'assignment') {
        updates.push(this.translateAssignment(item))
      }
    });

    return `for (let ${init.join(',')};${this.translateExpression(block.condition)}; ${updates.join(',')}) {
${this.translate(block.body)}
}`
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

  private translateFunction(block: DefineFunctionBlock): string {
    const args: Array<string> = []
    block.args?.forEach(arg => {
      args.push(this.translateExpression(arg));
    });

    let body = '// builtin function'
    if (block.body) body = this.translate(block.body);

    return `function ${block.name}(${args.join(',')})
{
 ${body}
}`;
  }

  private translateCall(block: CallFunctionBlock): string {
    const args: Array<string> = []
    block.args?.forEach(arg => {
      args.push(this.translateExpression(arg));
    });

    return `${block.name}(${args.join(',')})`;
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

    if (block.left.expression.type == 'variable') {
      return `${left}.set(${right})`;
    }
    else {
      return `${left} ${block.assignment} ${right}`;
    }
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

  private translateNumberOrVariable(block: NumberBlock | VariableBlock): string {
    if (block.type == 'number') {
      return block.value.toString();
    }
    else if (block.type == 'variable') {
      return this.translateVariable(block)
    }
    return '';
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
        return this.translateVariable(block.expression);
        break;
      case 'color':
        const color = block.expression as ColorBlock;
        return `${this.translateNumberOrVariable(color.red)},${this.translateNumberOrVariable(color.green)},${this.translateNumberOrVariable(color.blue)}`
        break;
      case 'vector2':
        const v2 = block.expression as Vector2Block;
        return `${this.translateNumberOrVariable(v2.x)},${this.translateNumberOrVariable(v2.y)}`
        break;
      case 'vector3':
        const v3 = block.expression as Vector3Block;
        return `${this.translateNumberOrVariable(v3.x)},${this.translateNumberOrVariable(v3.y)},${this.translateNumberOrVariable(v3.z)}`
        break;
      case 'rotation':
        const rotation = block.expression as RotationBlock;
        return `${this.translateNumberOrVariable(rotation.x)},${this.translateNumberOrVariable(rotation.y)},${this.translateNumberOrVariable(rotation.z)}`
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
