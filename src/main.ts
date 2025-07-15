import type { IPoint } from './hex'
import { Hex, Hexa, Point } from './hex'

type Color = {
  name?: string
  stroke: string
  shadow: string
}

const DPR = window.devicePixelRatio
const WIDTH = window.innerWidth
const HEIGHT = window.innerHeight

const bgCanvas = document.createElement('canvas')
bgCanvas.id = 'bgCanvas'
bgCanvas.classList.add('canvas')
bgCanvas.width = WIDTH * DPR
bgCanvas.height = HEIGHT * DPR
document.body.appendChild(bgCanvas)
// biome-ignore lint/style/noNonNullAssertion: Should be safe to assert non-null
const bgCtx = bgCanvas.getContext('2d')!
bgCtx.fillStyle = 'rgba(0, 0, 0, .1)'
bgCtx.strokeStyle = '#007bd2'
bgCtx.lineWidth = 1

bgCtx.scale(DPR, DPR)

const evtCanvas = document.createElement('canvas')
evtCanvas.id = 'evtCanvas'
evtCanvas.classList.add('canvas')
document.body.appendChild(evtCanvas)

evtCanvas.width = WIDTH
evtCanvas.height = HEIGHT

// biome-ignore lint/style/noNonNullAssertion: Should be safe to assert non-null
const evtCtx = evtCanvas.getContext('2d')!
evtCtx.fillStyle = '#fff'
evtCtx.strokeStyle = 'rgba(255, 255, 255, 1)'
evtCtx.lineWidth = 1

// Fixed variables
const SIZE = 15
const SPACING = 0
const TOTAL_SIZE = SIZE + SPACING
const grid = []
const HEX_WIDTH = TOTAL_SIZE * 2
const HEX_HEIGHT = Math.sqrt(3) * TOTAL_SIZE
const HEX_SPACING = (HEX_WIDTH * 3) / 4
const ITEMS_WIDTH = WIDTH / HEX_SPACING + 1
const ITEMS_HEIGHT = HEIGHT / HEX_HEIGHT + 1
const COLORS: Color[] = [
  {
    name: 'green',
    stroke: 'rgba(11, 255, 1, 1)',
    shadow: 'rgba(11, 255, 1, .5)',
  },
  // { name: 'blue', stroke: 'rgb(1,30,254)', shadow: 'rgba(1,30,254, .5)' }, // Nah
  // { name: 'lightblue', stroke: 'rgb(0, 145, 228)', shadow: 'rgba(0, 145, 228, .5)' }, // Ok but ligher blur better
  { name: 'pink', stroke: 'rgb(254,0,246)', shadow: 'rgba(254,0,246, .5)' },
  { name: 'yellow', stroke: 'rgb(253,254,2)', shadow: 'rgba(253,254,2, .3)' },
  {
    name: 'brigh-turquoise',
    stroke: 'rgb(12, 252, 211)',
    shadow: 'rgba(12, 252, 211, .8)',
  },
  { stroke: 'rgb(254, 83, 188)', shadow: 'rgba(254, 83, 188, .8)' }, // Pink
  { stroke: 'rgb(184, 108, 253)', shadow: 'rgba(184, 108, 253, 1)' }, // Purple
  { stroke: 'rgb(118, 213, 253)', shadow: 'rgba(118, 213, 253, .8)' }, // Ligher blue Save
  { stroke: 'rgb(252, 107, 104)', shadow: 'rgba(252, 107, 104, .4)' }, // Red
  { stroke: 'rgba(255, 170, 1, 1.00)', shadow: 'rgba(255, 170, 1, 1.00)' }, // Orange
  // { stroke: 'rgba(0, 0, 0, 1.00)', shadow: 'rgba(0, 0, 0, 1.00)' }, // Black SILENT KILLER
  { stroke: 'rgba(255, 255, 255, 1.00)', shadow: 'rgba(255, 255, 255, .6)' }, // White
]
type DirectionKey = 0 | 60 | 120 | 180 | 240 | 300
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
const directions: Record<DirectionKey, DirectionValue> = {
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

// state variables
let currentColor: Color
let timeOutId: number | undefined

const hexa = new Hexa({ size: SIZE, spacing: SPACING })

function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min)
}
function inRange(x: number, min: number, max: number): boolean {
  return (x - min) * (x - max) <= 0
}

function draw(cube: Hex, color?: string) {
  const center = hexa.flatHexToPixel(cube)
  const corners = hexa.getCorners(center)
  console.log('CENTER', center, 'CORNERS', corners)

  bgCtx.fillStyle = 'rgba(0, 0, 0, .1)'
  bgCtx.strokeStyle = '#007bd2'

  bgCtx.beginPath()
  bgCtx.moveTo(corners[0].x, corners[0].y)

  for (let i = 1; i < corners.length; i++) {
    bgCtx.lineTo(corners[i].x, corners[i].y)
  }

  bgCtx.closePath()
  bgCtx.stroke()
  if (color) bgCtx.fillStyle = color
  bgCtx.fill()
}

for (let iY = 0; iY < ITEMS_HEIGHT; iY++) {
  for (let iX = 0; iX < ITEMS_WIDTH; iX++) {
    const cube = Hexa.oddqToCube(Point(iX, iY))
    grid.push(cube)
    draw(cube)
  }
}

type Player = {
  initPos: Hex
  direction: DirectionKey | null
  prevDirection: DirectionKey | null
  from: IPoint
  to: IPoint
  amount: number
  directionX: number
  directionY: number
}

const player: Player = {
  initPos: new Hex(0, 0, 0),
  direction: null,
  prevDirection: null,
  from: Point(0, 0),
  to: Point(0, 0),
  amount: 0,
  directionX: 0,
  directionY: 0,
}

function getDirection(value: number) {
  if (value > 0) return -1
  if (value < 0) return 1
  return 0
}

function startGame() {
  currentColor = COLORS[randomBetween(0, COLORS.length - 1)]
  const center = hexa.flatHexToPixel(player.initPos)
  const corners = hexa.getCorners(center, TOTAL_SIZE)
  const randomNum = randomBetween(0, 5)
  const corner = corners[randomNum]
  const nextCorner = randomNum === 5 ? corners[0] : corners[randomNum + 1]
  player.from = corner
  player.to = nextCorner
  player.amount = 0
  player.directionX = getDirection(corner.x - nextCorner.x)
  player.directionY = getDirection(corner.y - nextCorner.y)

  evtCtx.beginPath()
  evtCtx.moveTo(corner.x, corner.y)
  drawCircle(corner)
  evtCtx.moveTo(corner.x, corner.y)
  clearTimeout(timeOutId)
  animate()
}

function animate() {
  player.amount += 0.1
  const x = player.from.x + (player.to.x - player.from.x) * player.amount
  const y = player.from.y + (player.to.y - player.from.y) * player.amount
  evtCtx.lineTo(x, y)
  evtCtx.strokeStyle = 'rgba(255, 255, 255, 1)'
  evtCtx.lineWidth = 1
  evtCtx.shadowBlur = 5
  evtCtx.shadowColor = 'rgba(255, 255, 255, .3)'

  evtCtx.strokeStyle = currentColor.stroke
  evtCtx.shadowColor = currentColor.shadow
  evtCtx.stroke()

  if (inRange(x, player.to.x - 0.1, player.to.x + 0.1)) {
    evtCtx.beginPath()
    evtCtx.moveTo(x, y)
    const hex = hexa.pixelToFlatHex({
      x: x + player.directionX,
      y: y + player.directionY,
    })
    const center = hexa.flatHexToPixel(hex)
    const corners = hexa.getCorners(center, TOTAL_SIZE)
    const outOfBounds = corners.find(
      (c) => c.y < 0 || c.y > HEIGHT || c.x < 0 || c.x > WIDTH,
    )
    const endCorner = corners.findIndex(
      (c) => inRange(c.x, x - 1, x + 1) && inRange(c.y, y - 1, y + 1),
    )
    // console.log('DONE', x, y, 'NEW', hex, 'CORNERS', corners, 'END', endCorner)
    player.from = corners[endCorner]
    if (!player.from) {
      console.log('NOPE', corners, endCorner)
    }
    // console.log(player.from.degree, directions[player.from.degree], player.direction, directions[player.from.degree][player.direction])
    // const dir = player.from?.degree || (0 as DirectionKey)
    const nextDirection = outOfBounds ? 1 : randomBetween(0, 1)
    // const nextDirection =
    //   player.direction !== null
    //     ? directions[dir][player.direction]
    //     : outOfBounds
    //       ? 1
    //       : randomBetween(0, 1)
    if (nextDirection) {
      player.to = endCorner === 5 ? corners[0] : corners[endCorner + 1]
    } else {
      player.to = endCorner === 0 ? corners[5] : corners[endCorner - 1]
    }
    // console.log('DIR', nextDirection, 'Degree', player.from.degree)
    // player.prevDirection = nextDirection
    player.direction = null
    player.amount = 0
    player.directionX = getDirection(player.from.x - player.to.x)
    player.directionY = getDirection(player.from.y - player.to.y)
    draw(hex, 'rgba(221, 61, 54, .5)')
    // drawCircle(corners[endCorner])
    animate()
  } else {
    timeOutId = setTimeout(() => animate(), 100)
  }
}

function drawCircle(corner: IPoint) {
  const radius = 2
  evtCtx.beginPath()
  evtCtx.arc(corner.x, corner.y, radius, 0, 2 * Math.PI)
  evtCtx.fillStyle = currentColor.stroke
  evtCtx.stroke()
  evtCtx.fill()
  evtCtx.beginPath()
}

// startGame()
