import { BGCOLORS_LIGHT, DEVICE_PIXEL_RATIO, hexAlpha } from './constants'
import { type Cube, Hexa, type IPoint, Point } from './hex'
import type { State } from './types'
import { getRandomColor } from './utils'

/**
 * Initializes a canvas with the specified name, line width, and shadow blur.
 *
 * @param {Object} params - The parameters for the canvas.
 * @param {string} params.name - The name of the canvas.
 * @param {number} params.lineWidth - The line width for the canvas context.
 * @param {number} params.shadowBlur - The shadow blur for the canvas context.
 * @returns {Object} An object containing the canvas element and its 2D rendering context.
 */
export function initCanvas({
  state,
  name,
  lineWidth = 1,
  shadowBlur = 5,
  className,
}: {
  state: State
  name: string
  lineWidth?: number
  shadowBlur?: number
  className?: string
}) {
  const canvas = document.createElement('canvas')
  canvas.setAttribute('name', name)
  canvas.classList.add('canvas')
  if (className) canvas.classList.add(className)
  canvas.width = state.WIDTH * DEVICE_PIXEL_RATIO
  canvas.height = state.HEIGHT * DEVICE_PIXEL_RATIO
  document.body.appendChild(canvas)
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Failed to get 2d context for bg canvas')
  ctx.lineWidth = lineWidth
  ctx.shadowBlur = shadowBlur
  ctx.scale(DEVICE_PIXEL_RATIO, DEVICE_PIXEL_RATIO)

  return { canvas, ctx } as const
}
/**
 * Draws a hexagon on the canvas.
 *
 * @param ctx - The canvas rendering context to draw on.
 * @param cube - The cube coordinates of the hexagon to draw.
 * @param color - Optional color to fill the hexagon. Defaults to a light gray.
 */
export function drawHexagon(
  ctx: CanvasRenderingContext2D,
  radius: number,
  cube: Cube,
  {
    strokeColor,
    strokeOpacity,
    fillColor,
    fillOpacity,
  }: {
    strokeColor?: string
    strokeOpacity?: string
    fillColor?: string
    fillOpacity?: string
  } = {},
) {
  const center = Hexa.flatHexToPixel(cube, radius)
  const corners = Hexa.getAllCorners(center, radius)

  ctx.beginPath()
  ctx.moveTo(corners[0].x, corners[0].y)

  for (let i = 1; i < corners.length; i++) {
    ctx.lineTo(corners[i].x, corners[i].y)
  }

  ctx.closePath()

  if (strokeColor) {
    ctx.strokeStyle = `${strokeColor}${strokeOpacity || ''}`
    ctx.stroke()
  }

  if (fillColor) {
    ctx.fillStyle = `${fillColor}${fillOpacity || ''}`
    ctx.fill()
  }
}

/**
 * Draws a circle on the canvas at the specified corner.
 *
 * @param ctx - The canvas rendering context to draw on.
 * @param corner - The corner point where the circle should be drawn.
 * @param color - The color of the circle.
 */
export function drawCircle(
  ctx: CanvasRenderingContext2D,
  { corner, color }: { corner: IPoint; color: string },
) {
  if (!ctx) return
  const radius = 2
  ctx.beginPath()
  ctx.arc(corner.x, corner.y, radius, 0, 2 * Math.PI)
  if (color) ctx.fillStyle = color
  ctx.stroke()
  ctx.fill()
  ctx.beginPath()
}

/**
 * Draw full background canvas with hexagons
 */
export function drawBgHexagons(
  ctx: CanvasRenderingContext2D,
  state: State,
  isDarkMode: boolean,
) {
  // Clear the canvas
  ctx.clearRect(0, 0, state.WIDTH, state.HEIGHT)

  // Draw hexagons in a grid pattern
  for (let iY = 0; iY < state.ITEMS_HEIGHT; iY++) {
    for (let iX = 0; iX < state.ITEMS_WIDTH; iX++) {
      const cube = Hexa.oddqToCube(Point(iX, iY))
      // const color = BGCOLORS[randomBetween(0, BGCOLORS.length - 1)]
      const fillColor = getRandomColor(BGCOLORS_LIGHT)
      drawHexagon(ctx, state.HEX_RADIUS, cube, {
        fillColor,
        fillOpacity: hexAlpha[20],
        strokeColor: isDarkMode ? '#000000' : '#777777',
        strokeOpacity: hexAlpha[10],
        // strokeColor: fillColor,
        // strokeOpacity: hexAlpha[10],
      })
    }
  }
}

// Too distracting with pixels and "snake""
// let rafId: number | null = null
// export function startRandomPixelPaint(
//   ctx: CanvasRenderingContext2D,
//   state: State,
//   hexa: Hexa,
// ) {
//   if (rafId) {
//     window.cancelAnimationFrame(rafId)
//   }
//   let animationTick = 0
//   const delay = 30

//   const render = () => {
//     animationTick++
//     if (animationTick > delay) {
//       paintRandomHex()
//       animationTick = 0
//     }
//     rafId = window.requestAnimationFrame(render)
//   }

//   function paintRandomHex() {
//     const randomX = randomBetween(0, state.WIDTH)
//     const randomY = randomBetween(0, state.HEIGHT)
//     const randomPoint = Point(randomX, randomY)

//     const cube = hexa.pixelToFlatHex(randomPoint)
//     drawHexagon(ctx, state.HEX_RADIUS, cube, {
//       fillColor: getRandomColor(BGCOLORS_LIGHT),
//       fillOpacity: hexAlpha[20],
//       strokeColor: 'transparent',
//     })
//   }

//   render()
// }
