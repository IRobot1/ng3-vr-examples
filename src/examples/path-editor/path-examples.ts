import { CommandData } from "./path-util";

// pass the following examples to the load function

export const label1: Array<CommandData> = [
  {
    "type": "moveto",
    "x": -0.3,
    "y": 0.3
  },
  {
    "type": "horizontal",
    "x": 0.3,
    "y": 0.3
  },
  {
    "type": "quadratic",
    "x": 0.4,
    "y": 0.2,
    "cpx": 0.4,
    "cpy": 0.3
  },
  {
    "type": "quadratic",
    "x": 0.4,
    "y": -0.2,
    "cpx": 0.6,
    "cpy": 0
  },
  {
    "type": "quadratic",
    "x": 0.3,
    "y": -0.3,
    "cpx": 0.4,
    "cpy": -0.3
  },
  {
    "type": "horizontal",
    "x": -0.3,
    "y": -0.3
  },
  {
    "type": "quadratic",
    "x": -0.4,
    "y": -0.2,
    "cpx": -0.4,
    "cpy": -0.3
  },
  {
    "type": "quadratic",
    "x": -0.4,
    "y": 0.2,
    "cpx": -0.6,
    "cpy": 0
  },
  {
    "type": "quadratic",
    "x": -0.3,
    "y": 0.3,
    "cpx": -0.4,
    "cpy": 0.3
  }
]
