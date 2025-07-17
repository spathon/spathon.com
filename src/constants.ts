export const DEVICE_PIXEL_RATIO = window.devicePixelRatio
export const WIDTH = window.innerWidth
export const HEIGHT = window.innerHeight

// Fixed variables
export const RADIUS = 15
export const SPACING = 0
export const HEX_RADIUS = RADIUS + SPACING
const HEX_WIDTH = HEX_RADIUS * 2
const HEX_HEIGHT = Math.sqrt(3) * HEX_RADIUS
const HEX_SPACING = (HEX_WIDTH * 3) / 4
export const ITEMS_WIDTH = WIDTH / HEX_SPACING + 1
export const ITEMS_HEIGHT = HEIGHT / HEX_HEIGHT + 1
// export const BGCOLORS = ['#1c1312', '#151e13', '#141c1e', '#1d1b13']
export const BGCOLORS = ['#120c0b', '#0d120b', '#0f1517', '#1c1a11']
export const BORDER_COLORS = [
  '#b1d8eb',
  '#00ab6e',
  '#007bd2',
  '#D37667',
  '#ECC980',
]
// const HIT_COLORS = ['#ff190050', '#2fff0050', '#00ccff50', '#ffcc0050']

export const hexAlpha = {
  100: 'FF',
  90: 'E6',
  80: 'CC',
  70: 'B3',
  60: '99',
  50: '80',
  40: '66',
  30: '4D',
  20: '33',
  10: '1A',
  0: '00',
}

export type Color = {
  name: string
  stroke: string
  shadow: string
}
export const COLORS: Color[] = [
  {
    name: 'green',
    stroke: 'rgba(11, 255, 1, 1)',
    shadow: 'rgba(11, 255, 1, .5)',
  },
  // { name: 'blue', stroke: 'rgb(1,30,254)', shadow: 'rgba(1,30,254, .5)' }, // Nah
  {
    name: 'lightblue',
    stroke: 'rgb(0, 145, 228)',
    shadow: 'rgba(0, 145, 228, .5)',
  }, // Ok but ligher blur better
  { name: 'pink', stroke: 'rgb(254,0,246)', shadow: 'rgba(254,0,246, .3)' },
  { name: 'yellow', stroke: 'rgb(253,254,2)', shadow: 'rgba(253,254,2, .3)' },
  {
    name: 'brigh-turquoise',
    stroke: 'rgb(12, 252, 211)',
    shadow: 'rgba(12, 252, 211, .3)',
  },
  {
    name: 'pink2',
    stroke: 'rgb(254, 83, 188)',
    shadow: 'rgba(254, 83, 188, .4)',
  },
  {
    name: 'purple',
    stroke: 'rgb(184, 108, 253)',
    shadow: 'rgba(184, 108, 253, .4)',
  },
  {
    name: 'lightblue2',
    stroke: 'rgb(118, 213, 253)',
    shadow: 'rgba(118, 213, 253, .4)',
  },
  {
    name: 'red',
    stroke: 'rgb(252, 107, 104)',
    shadow: 'rgba(252, 107, 104, .4)',
  },
  // {
  //   name: 'orange',
  //   stroke: 'rgba(255, 170, 1, 1)',
  //   shadow: 'rgba(255, 170, 1, .4)',
  // },
  // { name: 'black', stroke: 'rgba(0, 0, 0, 1.00)', shadow: 'rgba(0, 0, 0, 1.00)' }, // SILENT KILLER
  // {
  //   name: 'white',
  //   stroke: 'rgba(255, 255, 255, 1)',
  //   shadow: 'rgba(255, 255, 255, .4)',
  // },
]
type DirectionKey = 0 | 60 | 120 | 180 | 240 | 300
export type Direction = 'left' | 'up' | 'right' | 'down'
type DirectionValue = {
  hitPos:
    | 'right'
    | 'right-bottom'
    | 'left-bottom'
    | 'left'
    | 'left-top'
    | 'right-top'
  up: 0 | 1
  left: 0 | 1
  down: 0 | 1
  right: 0 | 1
  next: { 0: DirectionKey; 1: DirectionKey }
}
export const DIRECTIONS: Record<DirectionKey, DirectionValue> = {
  0: {
    hitPos: 'right',
    up: 0,
    left: 1,
    down: 1,
    right: 0,
    next: { 0: 60, 1: 300 },
  },
  60: {
    hitPos: 'right-bottom',
    up: 0,
    left: 1,
    down: 1,
    right: 0,
    next: { 0: 120, 1: 0 },
  },
  120: {
    hitPos: 'left-bottom',
    up: 1,
    left: 1,
    down: 0,
    right: 0,
    next: { 0: 180, 1: 60 },
  },
  180: {
    hitPos: 'left',
    up: 1,
    left: 1,
    down: 0,
    right: 0,
    next: { 0: 240, 1: 120 },
  },
  240: {
    hitPos: 'left-top',
    up: 1,
    left: 0,
    down: 0,
    right: 1,
    next: { 0: 300, 1: 180 },
  },
  300: {
    hitPos: 'right-top',
    up: 0,
    left: 0,
    down: 1,
    right: 1,
    next: { 0: 0, 1: 240 },
  },
}
