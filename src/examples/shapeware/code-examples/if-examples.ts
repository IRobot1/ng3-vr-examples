import { Block } from "../code/types";

export const ifExample: Block = {
  type: 'block',
  statements: [
    {
      type: 'variable',
      name: 'x',
      value: 1
    },
    {
      type: 'if',
      condition: {
        type: 'expression',
        expression: {
          type: 'boolean',
          value: false
        }
      },
      then: {
        type: 'block',
        statements: [
          {
            type: 'assignment',
            assignment: '=',
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
                type: 'number',
                value: 99
              }
            }

          }
        ]
      },
      else: {
        type: 'block',
        statements: [
          {
            type: 'assignment',
            assignment: '=',
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
                type: 'number',
                value: 11
              }
            }

          }
        ]
      }

    }
  ]
}

