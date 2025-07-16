import { BGCOLORS, HEX_RADIUS, ITEMS_HEIGHT, ITEMS_WIDTH } from './constants'
import { type Cube, Hexa, Point } from './hex'
import { randomBetween } from './utils'

/**
 * Draws a hexagon on the canvas.
 * @param ctx - The canvas rendering context to draw on.
 * @param cube - The cube coordinates of the hexagon to draw.
 * @param color - Optional color to fill the hexagon. Defaults to a light gray.
 */
function drawHexagon(
  ctx: CanvasRenderingContext2D,
  cube: Cube,
  color?: string,
) {
  const center = Hexa.flatHexToPixel(cube, HEX_RADIUS)
  const corners = Hexa.getAllCorners(center, HEX_RADIUS)

  ctx.fillStyle = color || 'rgba(0, 0, 0, .1)'
  ctx.strokeStyle = 'rgb(0, 0, 0)' // '#007bd2'

  ctx.beginPath()
  ctx.moveTo(corners[0].x, corners[0].y)

  for (let i = 1; i < corners.length; i++) {
    ctx.lineTo(corners[i].x, corners[i].y)
  }

  ctx.closePath()
  ctx.stroke()
  ctx.fill()
}

/**
 * Draw full background canvas with hexagons
 */
export function drawBgHexagons(ctx: CanvasRenderingContext2D) {
  for (let iY = 0; iY < ITEMS_HEIGHT; iY++) {
    for (let iX = 0; iX < ITEMS_WIDTH; iX++) {
      const cube = Hexa.oddqToCube(Point(iX, iY))
      const color = BGCOLORS[randomBetween(0, BGCOLORS.length - 1)]
      drawHexagon(ctx, cube, color)
    }
  }
}
