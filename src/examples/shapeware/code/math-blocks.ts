import { Block } from "./types"

export const mathFunctions: Block = {
  type: 'block',
  statements: [
    {
      type: 'function',
      name: 'abs',
      args: [
        {
          type: 'expression',
          expression: {
            type: 'variable',
            name: 'x',
          }
        }
      ],
      callback: (e: number) => { return Math.abs(e); }
    },
    {
      type: 'function',
      name: 'acos',
      args: [
        {
          type: 'expression',
          expression: {
            type: 'variable',
            name: 'x',
          }
        }
      ],
      callback: (e: number) => { return Math.acos(e); }
    },
    {
      type: 'function',
      name: 'acosh',
      args: [
        {
          type: 'expression',
          expression: {
            type: 'variable',
            name: 'x',
          }
        }
      ],
      callback: (e: number) => { return Math.acosh(e); }
    },
    {
      type: 'function',
      name: 'asin',
      args: [
        {
          type: 'expression',
          expression: {
            type: 'variable',
            name: 'x',
          }
        }
      ],
      callback: (e: number) => { return Math.asin(e); }
    }]
}
