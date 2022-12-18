import { CommandData } from "./path-util";

// pass the following examples to the load function

export const lathe1: Array<CommandData> = [
  { "type": "moveto", "x": 0, "y": -1 },
  { "type": "horizontal", "x": 0.6, "y": -1 },
  { "type": "vertical", "x": 0.6, "y": -0.9 },
  { "type": "lineto", "x": 0.2, "y": -0.8 },
  { "type": "quadratic", "x": 0.4, "y": -0.6, "cpx": 0.1, "cpy": -0.8 },
  { "type": "vertical", "x": 0.4, "y": -0.5 },
  { "type": "lineto", "x": 0.2, "y": -0.4 },
  { "type": "lineto", "x": 0.2, "y": -0.1 },
  { "type": "quadratic", "x": 0.2, "y": 0.1, "cpx": 0.4, "cpy": 0 },
  { "type": "quadratic", "x": 0.2, "y": 0.3, "cpx": 0.1, "cpy": 0.1 },
  { "type": "cubic", "x": 0.6, "y": 1, "cpx": 0.4, "cpy": 0.3, "cp2x": 0.6, "cp2y": 0.4 },
  { "type": "lineto", "x": 0.5, "y": 1 },
  { "type": "cubic", "x": 0.2, "y": 0.4, "cpx": 0.5, "cpy": 0.5, "cp2x": 0.4, "cp2y": 0.4 },
  { "type": "lineto", "x": 0, "y": 0.4 }
]

export const label2: Array<CommandData> = [
  { "type": "moveto", "x": -0.3, "y": 0.4 },
  { "type": "quadratic", "x": 0.3, "y": 0.4, "cpx": 0, "cpy": 0.3 },
  { "type": "quadratic", "x": 0.4, "y": 0.3, "cpx": 0.4, "cpy": 0.4 },
  { "type": "quadratic", "x": 0.4, "y": -0.1, "cpx": 0.6, "cpy": 0.1 },
  { "type": "quadratic", "x": 0.3, "y": -0.2, "cpx": 0.4, "cpy": -0.2 },
  { "type": "quadratic", "x": -0.3, "y": -0.2, "cpx": 0, "cpy": -0.1 },
  { "type": "quadratic", "x": -0.4, "y": -0.1, "cpx": -0.4, "cpy": -0.2 },
  { "type": "quadratic", "x": -0.4, "y": 0.3, "cpx": -0.6, "cpy": 0.1 },
  { "type": "quadratic", "x": -0.3, "y": 0.4, "cpx": -0.4, "cpy": 0.4 }
]

export const label1: Array<CommandData> = [
  { "type": "moveto", "x": -0.3, "y": 0.3 },
  { "type": "horizontal", "x": 0.3, "y": 0.3 },
  { "type": "quadratic", "x": 0.4, "y": 0.2, "cpx": 0.4, "cpy": 0.3 },
  { "type": "quadratic", "x": 0.4, "y": -0.2, "cpx": 0.6, "cpy": 0 },
  { "type": "quadratic", "x": 0.3, "y": -0.3, "cpx": 0.4, "cpy": -0.3 },
  { "type": "horizontal", "x": -0.3, "y": -0.3 },
  { "type": "quadratic", "x": -0.4, "y": -0.2, "cpx": -0.4, "cpy": -0.3 },
  { "type": "quadratic", "x": -0.4, "y": 0.2, "cpx": -0.6, "cpy": 0 },
  { "type": "quadratic", "x": -0.3, "y": 0.3, "cpx": -0.4, "cpy": 0.3 }
]
