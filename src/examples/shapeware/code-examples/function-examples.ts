import { Block } from "../code/types";

export const functionExample: Block = {
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

export const callbackExample: Block = {
  type: 'block',
  statements: [
    {
      type: 'variable',
      name: 'x',
      value: 5
    },
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
      callback: (e: any) => { return e * e }
    }
  ]
}

