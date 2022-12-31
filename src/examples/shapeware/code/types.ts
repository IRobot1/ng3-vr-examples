import { Color } from "three";


export interface NumberBlock {
  type: 'number';
  value: number;
}

export interface StringBlock {
  type: 'string';
  value: string;
}

export interface BooleanBlock {
  type: 'boolean';
  value: boolean;
}

export interface VariableBlock {
  type: 'variable';
  object?: any;
  name: string;
  value?: any;
}

export interface ColorBlock {
  type: 'color';
  red: NumberBlock | VariableBlock,
  green: NumberBlock | VariableBlock,
  blue: NumberBlock | VariableBlock,
}

export interface Vector2Block {
  type: 'vector2';
  x: NumberBlock | VariableBlock,
  y: NumberBlock | VariableBlock,
}

export interface Vector3Block {
  type: 'vector3';
  x: NumberBlock | VariableBlock,
  y: NumberBlock | VariableBlock,
  z: NumberBlock | VariableBlock,
}

export interface RotationBlock {
  type: 'rotation';
  x: NumberBlock | VariableBlock,
  y: NumberBlock | VariableBlock,
  z: NumberBlock | VariableBlock,
}


export interface NotBlock {
  type: 'not';
  value: ExpressionBlock
}

export interface ArithmeticBlock {
  type: 'arithmetic',
  operation: '+' | '-' | '*' | '/' | '%' | '**' | '++' | '--'
  left: ExpressionBlock;
  right?: ExpressionBlock;
}

export interface AssignmentBlock {
  type: 'assignment',
  assignment: '=' | '+=' | '-=' | '*=' | '/=' | '%=' | '**=',
  left: ExpressionBlock;
  right: ExpressionBlock;
}

export interface ComparisonBlock {
  type: 'comparison',
  comparison: '==' | '!=' | '>' | '>=' | '<' | '<=',
  left: ExpressionBlock;
  right: ExpressionBlock;
}

export interface LogicalBlock {
  type: 'logical',
  logical: '&&' | '||',
  left: ExpressionBlock;
  right: ExpressionBlock;
}

export interface BitwiseBlock {
  type: 'bitwise',
  bitwise: '&' | '|' | '~' | '^' | '<<' | '>>' | '>>>',
  left: ExpressionBlock;
  right: ExpressionBlock;
}

export interface ExpressionBlock {
  type: 'expression',
  expression: NotBlock | NumberBlock | StringBlock | BooleanBlock | VariableBlock | ColorBlock | Vector2Block | Vector3Block | RotationBlock | ArithmeticBlock | ComparisonBlock | ExpressionBlock | LogicalBlock | BitwiseBlock
}

export interface ReturnBlock {
  type: 'return';
  return: ExpressionBlock
}


export interface IfBlock {
  type: 'if';
  if: ExpressionBlock;
  then: Block;
  else?: Block;
}

export interface WhileBlock {
  type: 'while';
  while: ExpressionBlock;
  body: Block;
}

export interface ForBlock {
  type: 'for';
  init: Array<AssignmentBlock>,
  condition: ExpressionBlock,
  update: Array<AssignmentBlock | ArithmeticBlock>
  body: Block;
}

export interface DefineFunctionBlock {
  type: 'function';
  name: string;
  args?: Array<ExpressionBlock>;
  body?: Block;
  callback?: (e: any) => void;
}

export interface CallFunctionBlock {
  type: 'call';
  name: string;
  args?: Array<ExpressionBlock>;
}

export interface Block {
  type: 'block';
  statements: Array<VariableBlock | ExpressionBlock | AssignmentBlock | DefineFunctionBlock | CallFunctionBlock | ReturnBlock | IfBlock | WhileBlock | ForBlock>;
}



