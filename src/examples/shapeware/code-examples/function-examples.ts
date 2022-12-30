import { Block } from "../code/types";

export const defineFunctionExample: Block = {
  type: 'block',
  statements: [
    {
      type: 'function',
      name: 'square',
      args: [
        {
          type: 'expression',
          expression: {
            type: 'variable',
            name: 'x',
          }
        },
        {
          type: 'expression',
          expression: {
            type: 'variable',
            name: 'y',
          }
        }

      ],
      body: {
        type: 'block',
        statements: [
          {
            type: 'return',
            return: {
              type: 'expression',
              expression: {
                type: 'arithmetic',
                operation: '*',
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
                    name: 'x'
                  }
                }
              }
            }
          }
        ]
      }
    }
  ]
}

export const builtinFunctionExample: Block = {
  type: 'block',
  statements: [
    {
      type: 'function',
      name: 'square',
      args: [
        {
          type: 'expression',
          expression: {
            type: 'variable',
            name: 'x',
          }
        }
      ],
      callback: (e: any) => { console.warn('callback'); return e * e }
    }
  ]
}

export const callFunctionExample: Block = {
  type: 'block',
  statements: [
    {
      type: 'variable',
      name: 'x',
      value: 5
    },
    {
      type: 'call',
      name: 'square',
      args: [
        {
          type: 'expression',
          expression: {
            type: 'variable',
            name: 'x',
          }
        }
      ]
    }
  ]
}

