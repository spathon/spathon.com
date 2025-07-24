import { drawBgHexagons, drawCircle, initCanvas } from './canvas'
import { initColorSchemeToggle } from './color-scheme-toggle'
import { COLORS_BOTH_DARK_AND_LIGHT, DEVICE_PIXEL_RATIO } from './constants'
import { Hexa, Point } from './hex'
import type { Player, State } from './types'
import { getDirection, inRange, randomBetween } from './utils'

// 1 = Fast, 10 = quick, 100 = player speed
const SPEED = 10

// Dark/light state
const colorScheme = localStorage.getItem('colorScheme')
const isDefaultDark = colorScheme
  ? colorScheme === 'dark'
  : window?.matchMedia('(prefers-color-scheme: dark)')?.matches

// State of the game
function getState(): State {
  const WIDTH = window.innerWidth
  const HEIGHT = window.innerHeight
  const RADIUS = 12
  const SPACING = 0
  const HEX_RADIUS = RADIUS + SPACING
  const HEX_WIDTH = HEX_RADIUS * 2
  const HEX_HEIGHT = Math.sqrt(3) * HEX_RADIUS
  const HEX_SPACING = (HEX_WIDTH * 3) / 4
  const ITEMS_WIDTH = WIDTH / HEX_SPACING + 1
  const ITEMS_HEIGHT = HEIGHT / HEX_HEIGHT + 1

  const state: State = {
    currentColor: COLORS_BOTH_DARK_AND_LIGHT[0],
    timeOutId: undefined,
    isDarkMode: isDefaultDark,
    // Size of the canvas
    WIDTH,
    HEIGHT,
    // Size of the hexagons
    RADIUS,
    SPACING,
    HEX_RADIUS,
    HEX_WIDTH,
    HEX_HEIGHT,
    HEX_SPACING,
    ITEMS_WIDTH,
    ITEMS_HEIGHT,
  }

  return state
}
let state: State = getState()

const hexa = new Hexa({ size: state.RADIUS, spacing: state.SPACING })

/**
 * Setup canvases for background and events
 */
const { canvas: bgCanvas, ctx: bgCtx } = initCanvas({
  state,
  name: 'Background hex grid',
})
const { canvas: evtCanvas, ctx: evtCtx } = initCanvas({
  state,
  name: 'Player canvas',
  className: 'evt-canvas',
})

/**
 * Player
 */
function initPlayer() {
  const $page = document.getElementById('page')
  const rect = $page?.getBoundingClientRect()
  const R2 = state.HEX_RADIUS * 2
  function getInitialPoint() {
    const initX = randomBetween(R2, state.WIDTH - R2)
    const initY = randomBetween(R2, state.HEIGHT - R2)
    if (!rect) return Point(initX, initY)
    // Check if the initial point is not behind the page
    if (
      initX > rect.x &&
      initX < rect.x + rect.width &&
      initY > rect.y &&
      initY < rect.y + rect.height
    ) {
      return getInitialPoint()
    }
    return Point(initX, initY)
  }

  return {
    initPos: hexa.pixelToFlatHex(getInitialPoint()),
    from: Point(0, 0),
    to: Point(0, 0),
    amount: 0,
    directionX: 0,
    directionY: 0,
  }
}
let player: Player = initPlayer()

/**
 * Start the player
 */
function startGame() {
  if (!evtCtx) return
  state.currentColor =
    COLORS_BOTH_DARK_AND_LIGHT[
      randomBetween(0, COLORS_BOTH_DARK_AND_LIGHT.length - 1)
    ]
  console.log(
    `%cCurrent color: ${state.currentColor.name}`,
    `color: ${state.currentColor.stroke}`,
  )

  const center = Hexa.flatHexToPixel(player.initPos, state.HEX_RADIUS)
  const corners = Hexa.getAllCorners(center, state.HEX_RADIUS)
  // Start at a random corner
  const randomNum = randomBetween(0, 5)
  const corner = corners[randomNum]
  const nextCorner = randomNum === 5 ? corners[0] : corners[randomNum + 1]
  // Update player state
  player.from = corner
  player.to = nextCorner
  player.amount = 0
  player.directionX = getDirection(corner.x - nextCorner.x)
  player.directionY = getDirection(corner.y - nextCorner.y)

  // Draw initial circle & start animation
  evtCtx.strokeStyle = state.currentColor.stroke
  evtCtx.shadowColor = state.currentColor.shadow
  evtCtx.beginPath()
  evtCtx.moveTo(corner.x, corner.y)
  drawCircle(evtCtx, { corner, color: state.currentColor.stroke })
  clearTimeout(state.timeOutId)
  animate()
}

/**
 * Loop the animation
 */
function animate() {
  if (!evtCtx || !bgCtx) return

  // Move the player one step towards the next corner
  player.amount += 0.1
  const x = player.from.x + (player.to.x - player.from.x) * player.amount
  const y = player.from.y + (player.to.y - player.from.y) * player.amount
  evtCtx.lineTo(x, y)
  evtCtx.stroke()

  // If the player is at the next corner, update the state
  if (inRange(x, player.to.x - 0.1, player.to.x + 0.1)) {
    evtCtx.beginPath() // Reset to prevent the glow from growing on existing path
    evtCtx.moveTo(x, y)

    // Get the hexagon straight at the current position
    const hex = hexa.pixelToFlatHex({
      x: x + player.directionX,
      y: y + player.directionY,
    })
    const center = Hexa.flatHexToPixel(hex, state.HEX_RADIUS)
    const corners = Hexa.getAllCorners(center, state.HEX_RADIUS)
    // Find the corner where the player is currently at of the new hexagon
    const endCorner = corners.findIndex(
      (c) => inRange(c.x, x - 1, x + 1) && inRange(c.y, y - 1, y + 1),
    )

    // Update the player with it's new position
    const newFrom = corners[endCorner]
    // Only happens if an error
    if (!newFrom) {
      console.log('*** FAILED ***')
      console.log({ player, corners, endCorner })
      throw new Error('Could not find the new corner for the player.')
    }
    player.from = newFrom

    // If any corner is out of bounds, keep turning
    const outOfBounds = corners.find(
      (corner) =>
        corner.y < 0 ||
        corner.y > state.HEIGHT ||
        corner.x < 0 ||
        corner.x > state.WIDTH,
    )
    // Prevent going out of bounds
    const nextDirection = outOfBounds ? 1 : randomBetween(0, 1)
    if (nextDirection) {
      player.to = endCorner === 5 ? corners[0] : corners[endCorner + 1]
    } else {
      player.to = endCorner === 0 ? corners[5] : corners[endCorner - 1]
    }

    player.amount = 0
    player.directionX = getDirection(player.from.x - player.to.x)
    player.directionY = getDirection(player.from.y - player.to.y)

    animate()
  } else {
    state.timeOutId = setTimeout(() => animate(), SPEED)
  }
}

/**
 * Start
 */
initColorSchemeToggle(isDefaultDark, (isDarkMode) => {
  drawBgHexagons(bgCtx, state, isDarkMode)
})
drawBgHexagons(bgCtx, state, isDefaultDark)
startGame()
// startRandomPixelPaint(bgCtx, state, hexa)

/**
 * Click to set a new player position & random color
 */
evtCanvas.addEventListener('click', (evt) => {
  const offsetX = evt.pageX
  const offsetY = evt.pageY
  // Find hexagon at click position
  const hex = hexa.pixelToFlatHex(Point(offsetX, offsetY))
  player.initPos = hex
  startGame()
})

/**
 * Resize event listener
 * Reset state and redraw background hexagons on resize
 */
let resizeTimeout: number | undefined
window.addEventListener('resize', () => {
  // Stop the current animation
  clearTimeout(state.timeOutId)

  // Reset state on resize
  if (resizeTimeout) clearTimeout(resizeTimeout)
  resizeTimeout = setTimeout(() => {
    // Generate new state
    state = getState()

    // Reset canvases
    bgCanvas.width = state.WIDTH * DEVICE_PIXEL_RATIO
    bgCanvas.height = state.HEIGHT * DEVICE_PIXEL_RATIO
    evtCanvas.width = state.WIDTH * DEVICE_PIXEL_RATIO
    evtCanvas.height = state.HEIGHT * DEVICE_PIXEL_RATIO
    bgCtx.clearRect(0, 0, state.WIDTH, state.HEIGHT)
    evtCtx.clearRect(0, 0, state.WIDTH, state.HEIGHT)
    // Reset styles as they are lost?
    evtCtx.lineWidth = 1
    evtCtx.shadowBlur = 5
    bgCtx.lineWidth = 1
    bgCtx.shadowBlur = 5
    bgCtx.scale(DEVICE_PIXEL_RATIO, DEVICE_PIXEL_RATIO)
    evtCtx.scale(DEVICE_PIXEL_RATIO, DEVICE_PIXEL_RATIO)

    // Reinitialize player
    player = initPlayer()

    // Redraw background hexagons and start the game
    drawBgHexagons(bgCtx, state, state.isDarkMode)
    startGame()
    // startRandomPixelPaint(bgCtx, state, hexa)
  }, 100)
})
