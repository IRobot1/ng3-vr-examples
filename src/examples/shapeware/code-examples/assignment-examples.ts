import { Block } from "../code/types";

export const assignmentExample: Block = {
  type: 'block',
  statements: [
    {
      type: 'variable',
      name: 'x',
      value: 5
    },
    {
      type: 'variable',
      name: 'y',
      value: 3
    },
    {
      type: 'assignment',
      assignment: '**=',
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
  ]
}

