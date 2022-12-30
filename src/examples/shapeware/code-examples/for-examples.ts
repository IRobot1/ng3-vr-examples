import { Block } from "../code/types";

export const forExample: Block = {
  type: 'block',
  statements: [
    //{
    //  type: 'variable',
    //  name: 'x',
    //  value: 1
    //},
    //{
    //  type: 'variable',
    //  name: 'y',
    //  value: 0
    //},
    {
      type: 'for',
      init: [
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
              value: 1
            }
          }
        },
        {
          type: 'assignment',
          assignment: '=',
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
              value: 1
            }
          }
        }

      ],
      condition: {
        type: 'expression',
        expression: {
          type: 'logical',
          logical: '&&',
          left: {
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
                  value: 10,
                }
              }
            }
          },
          right: {
            type: 'expression',
            expression: {
              type: 'comparison',
              comparison: '<',
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
                  value: 100,
                }
              }

            }
          }
        },
      },
      update: [
        {
          type: 'arithmetic',
          operation: '++',
          left: {
            type: 'expression',
            expression: {
              type: 'variable',
              name: 'x'
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
      ],
      body: {
        type: 'block',
        statements: [
        ]
      },
    }
  ]
}

