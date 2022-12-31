import { Color } from "three";
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

export const comparisonExample: Block = {
  type: 'block',
  statements: [
    {
      type: 'variable',
      name: 'x',
      value: 2
    },
    {
      type: 'variable',
      name: 'y',
      value: 2
    },
    {
      type: 'expression',
      expression: {
        type: 'comparison',
        comparison: '>=',
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

export const logicalExample: Block = {
  type: 'block',
  statements: [
    {
      type: 'variable',
      name: 'x',
      value: false
    },
    {
      type: 'variable',
      name: 'y',
      value: false
    },
    {
      type: 'expression',
      expression: {
        type: 'logical',
        logical: '||',
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

export const bitwiseExample: Block = {
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
      value: 1
    },
    {
      type: 'expression',
      expression: {
        type: 'bitwise',
        bitwise: '<<',
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

export const colorExample: Block = {
  type: 'block',
  statements: [
    {
      type: 'variable',
      name: 'x',
      value: 'rgb(1, 0, 0)'
    },
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
          type: 'color',
          red: {
            type: 'number',
            value: 1
          },
          green: {
            type: 'number',
            value: 0
          },
          blue: {
            type: 'number',
            value: 0
          }
        }
      }
    }
  ]
}
