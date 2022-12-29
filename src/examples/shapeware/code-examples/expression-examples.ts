import { Block } from "../code/types";

export const variableGetSetExample: Block = {
  type: 'block',
  statements: [
    {
      type: 'variable',
      name: 'x',
      value: true
    },
    {
      type: 'expression',
      expression: {
        type: 'variable',
        name: 'x'
      }
    }
  ]
}

export const variableNotExample: Block = {
  type: 'block',
  statements: [
    {
      type: 'variable',
      name: 'x',
      value: true
    },
    {
      type: 'expression',
      expression: {
        type: 'not',
        value: {
          type: 'expression',
          expression: {
            type: 'variable',
            name: 'x'
          }
        }
      }
    }
  ]
}

export const operationExample: Block = {
  type: 'block',
  statements: [
    {
      type: 'variable',
      name: 'x',
      value: 10
    },
    {
      type: 'variable',
      name: 'y',
      value: 2
    },
    {
      type: 'expression',
      expression: {
        type: 'arithmetic',
        operation: '--',
        left: {
          type: 'expression',
          expression: {
            type: 'variable',
            name: 'x'
          }
        },
        right: {
          type: 'expression',
          expression: {
            type: 'variable',
            name: 'y'
          }
        }
      }

    }
  ]
}
