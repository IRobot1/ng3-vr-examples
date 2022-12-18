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

export const lathe2: Array<CommandData> = [
  { "type": "moveto", "x": -0.3, "y": 0.5 },
  { "type": "quadratic", "x": 0.3, "y": 0.5, "cpx": 0, "cpy": 0.7 },
  { "type": "quadratic", "x": 0.4, "y": 0.3, "cpx": 0.5, "cpy": 0.3 },
  { "type": "cubic", "x": 0.1, "y": 0.3, "cpx": 0.3, "cpy": 0.3, "cp2x": 0.2, "cp2y": 0.4 },
  { "type": "lineto", "x": 0.2, "y": -0.4 },
  { "type": "cubic", "x": -0.2, "y": -0.4, "cpx": 0, "cpy": -0.3, "cp2x": 0, "cp2y": -0.3 },
  { "type": "lineto", "x": -0.1, "y": 0.3 },
  { "type": "cubic", "x": -0.4, "y": 0.3, "cpx": -0.2, "cpy": 0.4, "cp2x": -0.3, "cp2y": 0.3 },
  { "type": "quadratic", "x": -0.3, "y": 0.5, "cpx": -0.5, "cpy": 0.3 }
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

export const label3: Array<CommandData> = [
  { "type": "moveto", "x": -0.1, "y": 0.4 },
  { "type": "lineto", "x": 0.1, "y": 0.4 },
  { "type": "quadratic", "x": 0.2, "y": 0.3, "cpx": 0.2, "cpy": 0.4 },
  { "type": "lineto", "x": 0.5, "y": 0.3 },
  { "type": "lineto", "x": 0.5, "y": 0.2 },
  { "type": "quadratic", "x": 0.5, "y": -0.2, "cpx": 0.6, "cpy": 0 },
  { "type": "lineto", "x": 0.5, "y": -0.3 },
  { "type": "lineto", "x": 0.2, "y": -0.3 },
  { "type": "quadratic", "x": 0.1, "y": -0.4, "cpx": 0.2, "cpy": -0.4 },
  { "type": "lineto", "x": -0.1, "y": -0.4 },
  { "type": "quadratic", "x": -0.2, "y": -0.3, "cpx": -0.2, "cpy": -0.4 },
  { "type": "lineto", "x": -0.5, "y": -0.3 },
  { "type": "lineto", "x": -0.5, "y": -0.2 },
  { "type": "quadratic", "x": -0.5, "y": 0.2, "cpx": -0.6, "cpy": 0 },
  { "type": "lineto", "x": -0.5, "y": 0.3 },
  { "type": "lineto", "x": -0.2, "y": 0.3 },
  { "type": "quadratic", "x": -0.1, "y": 0.4, "cpx": -0.2, "cpy": 0.4 }
]

export const label4: Array<CommandData> = [
  { "type": "moveto", "x": -0.3, "y": 0.4 },
  { "type": "lineto", "x": 0.3, "y": 0.4 },
  { "type": "quadratic", "x": 0.4, "y": 0.3, "cpx": 0.4, "cpy": 0.4 },
  { "type": "quadratic", "x": 0.5, "y": 0.2, "cpx": 0.5, "cpy": 0.3 },
  { "type": "cubic", "x": 0.5, "y": -0.2, "cpx": 0.7, "cpy": 0.2, "cp2x": 0.7, "cp2y": -0.2 },
  { "type": "quadratic", "x": 0.4, "y": -0.3, "cpx": 0.5, "cpy": -0.3 },
  { "type": "quadratic", "x": 0.3, "y": -0.4, "cpx": 0.4, "cpy": -0.4 },
  { "type": "lineto", "x": -0.3, "y": -0.4 },
  { "type": "quadratic", "x": -0.4, "y": -0.3, "cpx": -0.4, "cpy": -0.4 },
  { "type": "quadratic", "x": -0.5, "y": -0.2, "cpx": -0.5, "cpy": -0.3 },
  { "type": "cubic", "x": -0.5, "y": 0.2, "cpx": -0.7, "cpy": -0.2, "cp2x": -0.7, "cp2y": 0.2 },
  { "type": "quadratic", "x": -0.4, "y": 0.3, "cpx": -0.5, "cpy": 0.3 },
  { "type": "quadratic", "x": -0.3, "y": 0.4, "cpx": -0.4, "cpy": 0.4 }
]

export const label5: Array<CommandData> = [
  { "type": "moveto", "x": 0.3, "y": 0.4 },
  { "type": "lineto", "x": 0.3, "y": 0.4 },
  { "type": "quadratic", "x": 0.4, "y": 0.3, "cpx": 0.4, "cpy": 0.4 },
  { "type": "quadratic", "x": 0.5, "y": 0.2, "cpx": 0.5, "cpy": 0.3 },
  { "type": "cubic", "x": 0.5, "y": -0.2, "cpx": 0.6, "cpy": 0.1, "cp2x": 0.6, "cp2y": -0.1 },
  { "type": "quadratic", "x": 0.4, "y": -0.3, "cpx": 0.5, "cpy": -0.3 },
  { "type": "quadratic", "x": 0.3, "y": -0.4, "cpx": 0.4, "cpy": -0.4 },
  { "type": "cubic", "x": -0.3, "y": -0.4, "cpx": 0.1, "cpy": -0.5, "cp2x": -0.1, "cp2y": -0.5 },
  { "type": "lineto", "x": -0.3, "y": -0.4 },
  { "type": "quadratic", "x": -0.4, "y": -0.3, "cpx": -0.4, "cpy": -0.4 },
  { "type": "quadratic", "x": -0.5, "y": -0.2, "cpx": -0.5, "cpy": -0.3 },
  { "type": "cubic", "x": -0.5, "y": 0.2, "cpx": -0.6, "cpy": -0.1, "cp2x": -0.6, "cp2y": 0.1 },
  { "type": "quadratic", "x": -0.4, "y": 0.3, "cpx": -0.5, "cpy": 0.3 },
  { "type": "quadratic", "x": -0.3, "y": 0.4, "cpx": -0.4, "cpy": 0.4 },
  { "type": "cubic", "x": 0.3, "y": 0.4, "cpx": -0.1, "cpy": 0.5, "cp2x": 0.1, "cp2y": 0.5 }
]


export const label6: Array<CommandData> = [
  { "type": "moveto", "x": 0, "y": 0.3 },
  { "type": "lineto", "x": 0.4, "y": 0.3 },
  { "type": "quadratic", "x": 0.5, "y": 0.2, "cpx": 0.5, "cpy": 0.3 },
  { "type": "lineto", "x": 0.7, "y": 0.26 },
  { "type": "cubic", "x": 0.69, "y": -0.25, "cpx": 0.8, "cpy": 0.1, "cp2x": 0.8, "cp2y": -0.1 },
  { "type": "lineto", "x": 0.5, "y": -0.2 },
  { "type": "quadratic", "x": 0.4, "y": -0.3, "cpx": 0.5, "cpy": -0.3 },
  { "type": "lineto", "x": -0.4, "y": -0.3 },
  { "type": "quadratic", "x": -0.5, "y": -0.2, "cpx": -0.5, "cpy": -0.3 },
  { "type": "lineto", "x": -0.71, "y": -0.25 },
  { "type": "cubic", "x": -0.71, "y": 0.25, "cpx": -0.8, "cpy": -0.1, "cp2x": -0.8, "cp2y": 0.1 },
  { "type": "lineto", "x": -0.5, "y": 0.2 },
  { "type": "quadratic", "x": -0.4, "y": 0.3, "cpx": -0.5, "cpy": 0.3 }
]

export const label7: Array<CommandData> = [
  { "type": "moveto", "x": -0.4, "y": 0.5 },
  { "type": "cubic", "x": 0.4, "y": 0.5, "cpx": -0.3, "cpy": 0.7, "cp2x": 0.3, "cp2y": 0.7 },
  { "type": "lineto", "x": 0.5, "y": 0.5 },
  { "type": "lineto", "x": 0.5, "y": 0 },
  { "type": "lineto", "x": -0.5, "y": 0 },
  { "type": "lineto", "x": -0.5, "y": 0.5 },
  { "type": "lineto", "x": -0.4, "y": 0.5 }
]

export const label8: Array<CommandData> = [
  { "type": "moveto", "x": 0.3, "y": 0.2 },
  { "type": "quadratic", "x": 0.5, "y": 0.1, "cpx": 0.5, "cpy": 0.2 },
  { "type": "cubic", "x": 0.5, "y": -0.1, "cpx": 0.6, "cpy": 0.1, "cp2x": 0.6, "cp2y": -0.1 },
  { "type": "quadratic", "x": 0.3, "y": -0.2, "cpx": 0.5, "cpy": -0.2 },
  { "type": "cubic", "x": -0.3, "y": -0.2, "cpx": 0.3, "cpy": -0.5, "cp2x": -0.3, "cp2y": -0.5 },
  { "type": "lineto", "x": -0.3, "y": -0.2 },
  { "type": "quadratic", "x": -0.5, "y": -0.1, "cpx": -0.5, "cpy": -0.2 },
  { "type": "cubic", "x": -0.5, "y": 0.1, "cpx": -0.6, "cpy": -0.1, "cp2x": -0.6, "cp2y": 0.1 },
  { "type": "quadratic", "x": -0.3, "y": 0.2, "cpx": -0.5, "cpy": 0.2 },
  { "type": "cubic", "x": 0.3, "y": 0.2, "cpx": -0.3, "cpy": 0.5, "cp2x": 0.3, "cp2y": 0.5 }
]

export const label9: Array<CommandData> = [
  { "type": "moveto", "x": -0.1, "y": 0.3 },
  { "type": "quadratic", "x": 0.1, "y": 0.3, "cpx": 0, "cpy": 0.4 },
  { "type": "lineto", "x": 0.2, "y": 0.2 },
  { "type": "lineto", "x": 0.4, "y": 0.2 },
  { "type": "quadratic", "x": 0.5, "y": 0.1, "cpx": 0.5, "cpy": 0.2 },
  { "type": "quadratic", "x": 0.5, "y": -0.1, "cpx": 0.6, "cpy": 0 },
  { "type": "quadratic", "x": 0.4, "y": -0.2, "cpx": 0.5, "cpy": -0.2 },
  { "type": "lineto", "x": 0.2, "y": -0.2 },
  { "type": "lineto", "x": 0.1, "y": -0.3 },
  { "type": "quadratic", "x": -0.1, "y": -0.3, "cpx": 0, "cpy": -0.4 },
  { "type": "lineto", "x": -0.2, "y": -0.2 },
  { "type": "lineto", "x": -0.4, "y": -0.2 },
  { "type": "quadratic", "x": -0.5, "y": -0.1, "cpx": -0.5, "cpy": -0.2 },
  { "type": "quadratic", "x": -0.5, "y": 0.1, "cpx": -0.6, "cpy": 0 },
  { "type": "quadratic", "x": -0.4, "y": 0.2, "cpx": -0.5, "cpy": 0.2 },
  { "type": "lineto", "x": -0.2, "y": 0.2 }
]

export const label10: Array<CommandData> = [
  { "type": "moveto", "x": 0, "y": 0.4 },
  { "type": "cubic", "x": 0.5, "y": 0.4, "cpx": 0.1, "cpy": 0.2, "cp2x": 0.4, "cp2y": 0.5 },
  { "type": "cubic", "x": 0.6, "y": 0, "cpx": 0.6, "cpy": 0.3, "cp2x": 0.4, "cp2y": 0.1 },
  { "type": "cubic", "x": 0.5, "y": -0.4, "cpx": 0.4, "cpy": -0.1, "cp2x": 0.6, "cp2y": -0.3 },
  { "type": "cubic", "x": 0, "y": -0.4, "cpx": 0.4, "cpy": -0.5, "cp2x": 0.1, "cp2y": -0.2 },
  { "type": "cubic", "x": -0.5, "y": -0.4, "cpx": -0.1, "cpy": -0.2, "cp2x": -0.4, "cp2y": -0.5 },
  { "type": "cubic", "x": -0.6, "y": 0, "cpx": -0.6, "cpy": -0.3, "cp2x": -0.4, "cp2y": -0.1 },
  { "type": "cubic", "x": -0.5, "y": 0.4, "cpx": -0.4, "cpy": 0.1, "cp2x": -0.6, "cp2y": 0.3 },
  { "type": "cubic", "x": 0, "y": 0.4, "cpx": -0.4, "cpy": 0.5, "cp2x": -0.1, "cp2y": 0.2 }
]

export const label11: Array<CommandData> = [
  { "type": "moveto", "x": -0.4, "y": 0.3 },
  { "type": "lineto", "x": 0.4, "y": 0.3 },
  { "type": "quadratic", "x": 0.5, "y": 0.2, "cpx": 0.4, "cpy": 0.2 },
  { "type": "lineto", "x": 0.5, "y": -0.2 },
  { "type": "quadratic", "x": 0.4, "y": -0.3, "cpx": 0.4, "cpy": -0.2 },
  { "type": "lineto", "x": -0.4, "y": -0.3 },
  { "type": "quadratic", "x": -0.5, "y": -0.2, "cpx": -0.4, "cpy": -0.2 },
  { "type": "lineto", "x": -0.5, "y": 0.2 },
  { "type": "quadratic", "x": -0.4, "y": 0.3, "cpx": -0.4, "cpy": 0.2 }
]

export const label12: Array<CommandData> = [
  { "type": "moveto", "x": 0, "y": -0.4 },
  { "type": "cubic", "x": -0.7, "y": -0.4, "cpx": -0.1, "cpy": -0.6, "cp2x": -0.5, "cp2y": -0.3 },
  { "type": "lineto", "x": -0.7, "y": -0.3 },
  { "type": "quadratic", "x": -0.6, "y": -0.2, "cpx": -0.6, "cpy": -0.3 },
  { "type": "lineto", "x": -0.6, "y": 0.2 },
  { "type": "quadratic", "x": -0.7, "y": 0.3, "cpx": -0.6, "cpy": 0.3 },
  { "type": "lineto", "x": -0.7, "y": 0.4 },
  { "type": "cubic", "x": -0.1, "y": 0.7, "cpx": -0.3, "cpy": 0.2, "cp2x": -0.3, "cp2y": 0.9 },
  { "type": "cubic", "x": 0, "y": 0.4, "cpx": -0.3, "cpy": 0.6, "cp2x": -0.2, "cp2y": 0.4 },
  { "type": "cubic", "x": 0.1, "y": 0.7, "cpx": 0.2, "cpy": 0.4, "cp2x": 0.3, "cp2y": 0.6 },
  { "type": "cubic", "x": 0.7, "y": 0.4, "cpx": 0.3, "cpy": 0.9, "cp2x": 0.3, "cp2y": 0.2 },
  { "type": "lineto", "x": 0.7, "y": 0.3 },
  { "type": "quadratic", "x": 0.6, "y": 0.2, "cpx": 0.6, "cpy": 0.3 },
  { "type": "lineto", "x": 0.6, "y": -0.2 },
  { "type": "quadratic", "x": 0.7, "y": -0.3, "cpx": 0.6, "cpy": -0.3 },
  { "type": "lineto", "x": 0.7, "y": -0.4 },
  { "type": "cubic", "x": 0, "y": -0.4, "cpx": 0.5, "cpy": -0.3, "cp2x": 0.1, "cp2y": -0.6 }

]
