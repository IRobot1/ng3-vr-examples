

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

export interface NotBlock {
  type: 'not';
  value: ExpressionBlock
}

export interface ArithmeticBlock {
  type: 'arithmetic',
  operation: '+' | '-' | '*' | '/' | '%' | '**' | '++' | '--'
  left: ExpressionBlock;
  right: ExpressionBlock;
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
  expression: NotBlock | NumberBlock | StringBlock | BooleanBlock | VariableBlock | ArithmeticBlock | ComparisonBlock | ExpressionBlock | LogicalBlock | BitwiseBlock
}

export interface ReturnBlock {
  type: 'return';
  return: ExpressionBlock
}


export interface FunctionBlock {
  type: 'function';
  name: string;
  args?: Array<ExpressionBlock>;
  body?: Block;
  callback?: (e: any) => void;
}

export interface IfBlock {
  type: 'if';
  condition: ExpressionBlock;
  then: Block;
  else?: Block;
}


export interface Block {
  type: 'block';
  statements: Array<VariableBlock | ExpressionBlock | AssignmentBlock | FunctionBlock | ReturnBlock | IfBlock>;
}

