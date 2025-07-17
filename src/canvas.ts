import {
  // BGCOLORS,
  BORDER_COLORS,
  HEX_RADIUS,
  hexAlpha,
  ITEMS_HEIGHT,
  ITEMS_WIDTH,
} from './constants'
import { type Cube, Hexa, Point } from './hex'
import { getRandomColor } from './utils'

/**
 * Draws a hexagon on the canvas.
 * @param ctx - The canvas rendering context to draw on.
 * @param cube - The cube coordinates of the hexagon to draw.
 * @param color - Optional color to fill the hexagon. Defaults to a light gray.
 */
export function drawHexagon(
  ctx: CanvasRenderingContext2D,
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
  const center = Hexa.flatHexToPixel(cube, HEX_RADIUS)
  const corners = Hexa.getAllCorners(center, HEX_RADIUS)

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
 * Draw full background canvas with hexagons
 */
export function drawBgHexagons(ctx: CanvasRenderingContext2D) {
  for (let iY = 0; iY < ITEMS_HEIGHT; iY++) {
    for (let iX = 0; iX < ITEMS_WIDTH; iX++) {
      const cube = Hexa.oddqToCube(Point(iX, iY))
      // const color = BGCOLORS[randomBetween(0, BGCOLORS.length - 1)]
      const fillColor = getRandomColor(BORDER_COLORS)
      drawHexagon(ctx, cube, {
        fillColor,
        fillOpacity: hexAlpha[20],
        strokeColor: '#777777',
        strokeOpacity: hexAlpha[10],
        // strokeColor: fillColor,
        // strokeOpacity: hexAlpha[10],
      })
    }
  }
}
