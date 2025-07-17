import { drawBgHexagons, drawHexagon } from './canvas'
import type { Color, Direction } from './constants'
import {
  BGCOLORS,
  BORDER_COLORS,
  COLORS,
  DEVICE_PIXEL_RATIO,
  DIRECTIONS,
  HEIGHT,
  HEX_RADIUS,
  hexAlpha,
  RADIUS,
  SPACING,
  WIDTH,
} from './constants'
import type { IPoint } from './hex'
import { Cube, Hexa, Point } from './hex'
import { getDirection, getRandomColor, inRange, randomBetween } from './utils'

// 1 = Fast, 10 = quick, 100 = player speed
const SPEED = 10

// State of the game
type State = {
  currentColor: Color
  timeOutId: number | undefined
}
const state: State = {
  currentColor: COLORS[0],
  timeOutId: undefined,
}

const hexa = new Hexa({ size: RADIUS, spacing: SPACING })

/**
 * Setup bg canvas
 */
const bgCanvas = document.createElement('canvas')
bgCanvas.setAttribute('name', 'bg hex grid')
bgCanvas.classList.add('canvas')
bgCanvas.width = WIDTH * DEVICE_PIXEL_RATIO
bgCanvas.height = HEIGHT * DEVICE_PIXEL_RATIO
document.body.appendChild(bgCanvas)
const bgCtx = bgCanvas.getContext('2d')
if (!bgCtx) throw new Error('Failed to get 2d context for bg canvas')
bgCtx.lineWidth = 1
bgCtx.scale(DEVICE_PIXEL_RATIO, DEVICE_PIXEL_RATIO)

/**
 * Event canvas for the player drawing
 */
const evtCanvas = document.createElement('canvas')
evtCanvas.id = 'evtCanvas'
evtCanvas.classList.add('canvas')
document.body.appendChild(evtCanvas)
evtCanvas.width = WIDTH * DEVICE_PIXEL_RATIO
evtCanvas.height = HEIGHT * DEVICE_PIXEL_RATIO
const evtCtx = evtCanvas.getContext('2d')
if (!evtCtx) throw new Error('Failed to get 2d context for bg canvas')
evtCtx.scale(DEVICE_PIXEL_RATIO, DEVICE_PIXEL_RATIO)
evtCtx.lineWidth = 1
evtCtx.shadowBlur = 5

type Player = {
  initPos: Cube
  direction: Direction | null
  from: IPoint
  to: IPoint
  amount: number
  directionX: number
  directionY: number
}

const player: Player = {
  initPos: Cube(0, 0, 0),
  direction: null,
  from: Point(0, 0),
  to: Point(0, 0),
  amount: 0,
  directionX: 0,
  directionY: 0,
}

function startGame() {
  if (!evtCtx) return
  state.currentColor = COLORS[randomBetween(0, COLORS.length - 1)]
  console.log(
    `%cCurrent color: ${state.currentColor.name}`,
    `color: ${state.currentColor.stroke}`,
  )

  const center = Hexa.flatHexToPixel(player.initPos, HEX_RADIUS)
  const corners = Hexa.getAllCorners(center, HEX_RADIUS)
  const randomNum = randomBetween(0, 5)
  const corner = corners[randomNum]
  const nextCorner = randomNum === 5 ? corners[0] : corners[randomNum + 1]
  player.from = corner
  player.to = nextCorner
  player.amount = 0
  player.directionX = getDirection(corner.x - nextCorner.x)
  player.directionY = getDirection(corner.y - nextCorner.y)

  evtCtx.strokeStyle = state.currentColor.stroke
  evtCtx.shadowColor = state.currentColor.shadow

  evtCtx.beginPath()
  evtCtx.moveTo(corner.x, corner.y)
  drawCircle(corner)
  evtCtx.moveTo(corner.x, corner.y)
  clearTimeout(state.timeOutId)
  animate()
}

function animate() {
  if (!evtCtx || !bgCtx) return
  player.amount += 0.1
  const x = player.from.x + (player.to.x - player.from.x) * player.amount
  const y = player.from.y + (player.to.y - player.from.y) * player.amount
  evtCtx.lineTo(x, y)
  evtCtx.stroke()

  if (inRange(x, player.to.x - 0.1, player.to.x + 0.1)) {
    evtCtx.beginPath()
    evtCtx.moveTo(x, y)
    const hex = hexa.pixelToFlatHex({
      x: x + player.directionX,
      y: y + player.directionY,
    })
    const center = Hexa.flatHexToPixel(hex, HEX_RADIUS)
    const corners = Hexa.getAllCorners(center, HEX_RADIUS)
    const outOfBounds = corners.find(
      (c) => c.y < 0 || c.y > HEIGHT || c.x < 0 || c.x > WIDTH,
    )
    const endCorner = corners.findIndex(
      (c) => inRange(c.x, x - 1, x + 1) && inRange(c.y, y - 1, y + 1),
    )

    player.from = corners[endCorner]
    if (!player.from) {
      console.log('NOPE', corners, endCorner)
    }

    // Prevent going out of bounds
    const nextDirection = outOfBounds
      ? 1
      : player.direction !== null
        ? DIRECTIONS[player.from?.degree || 0][player.direction]
        : randomBetween(0, 1)
    if (nextDirection) {
      player.to = endCorner === 5 ? corners[0] : corners[endCorner + 1]
    } else {
      player.to = endCorner === 0 ? corners[5] : corners[endCorner - 1]
    }

    player.direction = null
    player.amount = 0
    player.directionX = getDirection(player.from.x - player.to.x)
    player.directionY = getDirection(player.from.y - player.to.y)
    // draw(hex, 'rgba(221, 61, 54, .5)')
    // draw(hex, HIT_COLORS[randomBetween(0, HIT_COLORS.length - 1)])
    // @todo Match bg hit color & fade out after a while

    drawHexagon(bgCtx, hex, {
      fillColor: getRandomColor(BGCOLORS),
      fillOpacity: hexAlpha[100],
      strokeColor: getRandomColor(BORDER_COLORS),
      strokeOpacity: hexAlpha[40],
    }) // Mark clicked hex

    // drawCircle(corners[endCorner])
    animate()
  } else {
    state.timeOutId = setTimeout(() => animate(), SPEED)
  }
}

function drawCircle(corner: IPoint) {
  if (!evtCtx) return
  const radius = 2
  evtCtx.beginPath()
  evtCtx.arc(corner.x, corner.y, radius, 0, 2 * Math.PI)
  evtCtx.fillStyle = state.currentColor.stroke
  evtCtx.stroke()
  evtCtx.fill()
  evtCtx.beginPath()
}

/**
 * Start
 */
drawBgHexagons(bgCtx)

/**
 * Click event to start the "game"
 */
evtCanvas.addEventListener('click', (evt) => {
  const offsetX = evt.pageX
  const offsetY = evt.pageY
  const hex = hexa.pixelToFlatHex(Point(offsetX, offsetY))
  player.initPos = hex
  // draw(hex, '#191') Mark clicked hex
  // drawHexagon(evtCtx, hex, { strokeColor: getRandomColor(BORDER_COLORS) }) // Mark clicked hex
  startGame()
})

const nextDirection = document.getElementById('nextDirection')

// Left 37 - Up 38 - Right 39 - Down 40
const arrows = {
  ArrowLeft: { key: 'left', value: 0 },
  ArrowUp: { key: 'up', value: 1 },
  ArrowRight: { key: 'right', value: 1 },
  ArrowDown: { key: 'down', value: 0 },
} as const

document.addEventListener('keydown', (evt) => {
  const code = evt.code
  if (
    code !== 'ArrowLeft' &&
    code !== 'ArrowUp' &&
    code !== 'ArrowRight' &&
    code !== 'ArrowDown'
  ) {
    return
  }
  const { key, value } = arrows[code]
  const playerDegree = player.from.degree
  if (!playerDegree) return

  const nextCorner = DIRECTIONS[playerDegree].next[value]
  const nextOptionsDir = DIRECTIONS[nextCorner][key]
  const nextDirectionDegree = DIRECTIONS[nextCorner].next[nextOptionsDir]
  if (nextDirection) {
    nextDirection.style.transform = `rotate(${nextDirectionDegree}deg)`
  }
  player.direction = key
})

/**
 * Dark mode toggle
 */
const colorScheme = localStorage.getItem('colorScheme')
const isDefaultDark = colorScheme
  ? colorScheme === 'dark'
  : window?.matchMedia('(prefers-color-scheme: dark)')?.matches
const $darkModeToggle = document.getElementById('darkModeToggle')
const $body = document.body
if ($darkModeToggle) {
  $body.classList.add(isDefaultDark ? 'moon' : 'sun')
  $darkModeToggle.addEventListener('click', () => {
    if ($body.classList.contains('sun')) {
      $body.classList.add('moon')
      $body.classList.remove('sun')
      localStorage.setItem('colorScheme', 'dark')
    } else {
      $body.classList.add('sun')
      $body.classList.remove('moon')
      localStorage.setItem('colorScheme', 'light')
    }
  })
}

/**
 *
 * Get color from canvas at click position
 */
function componentToHex(c: number) {
  var hex = c.toString(16)
  return hex.length === 1 ? `0${hex}` : hex
}
function rgbToHex(r: number, g: number, b: number) {
  return `#${componentToHex(r) + componentToHex(g) + componentToHex(b)}`
}
bgCanvas.addEventListener('click', (evt) => {
  const offsetX = evt.pageX * DEVICE_PIXEL_RATIO
  const offsetY = evt.pageY * DEVICE_PIXEL_RATIO
  const imageData = bgCtx.getImageData(offsetX, offsetY, 1, 1)
  const hex = rgbToHex(imageData.data[0], imageData.data[1], imageData.data[2])
  console.log(
    `%cClicked color at (${offsetX}, ${offsetY}): ${hex}`,
    `color: ${hex}`,
  )
})
