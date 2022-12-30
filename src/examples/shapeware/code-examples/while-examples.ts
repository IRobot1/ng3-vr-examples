import { Block } from "../code/types";

export const whileExample: Block = {
  type: 'block',
  statements: [
    {
      type: 'variable',
      name: 'x',
      value: 1
    },
    {
      type: 'variable',
      name: 'y',
      value: 0
    },
    {
      type: 'while',
      while: {
        type: 'expression',
        expression: {
          type: 'comparison',
          comparison: '<',
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
              value: 100
            }
          }
        }
      },
      body: {
        type: 'block',
        statements: [
          {
            type: 'expression',
            expression: {
              type: 'arithmetic',
              operation: '++',
              left: {
                type: 'expression',
                expression: {
                  type: 'variable',
                  name: 'x'
                }
              }
            }
          },
          {
            type: 'assignment',
            assignment: '+=',
            left: {
              type: 'expression',
              expression: {
                type: 'variable',
                name: 'y'
              }
            },
            right: {
              type: 'expression',
              expression: {
                type: 'number',
                value: 10
              }
            }
          }
        ]
      },
    }
  ]
}

