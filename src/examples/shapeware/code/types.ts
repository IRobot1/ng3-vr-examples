

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

export interface ExpressionBlock {
  type: 'expression',
  expression: NotBlock | NumberBlock | StringBlock | BooleanBlock | VariableBlock | ArithmeticBlock | ExpressionBlock
}


export interface Block {
  type: 'block';
  statements: Array<VariableBlock | ExpressionBlock>;
}

