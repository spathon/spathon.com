import { DEVICE_PIXEL_RATIO } from './constants'
import type { IPoint } from './hex'

/**
 * Returns a random integer between min and max (inclusive).
 *
 * @param min The minimum value.
 * @param max The maximum value.
 * @returns A random integer between min and max.
 */
export function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

/**
 * Checks if a number is within a specified range (inclusive).
 *
 * @param x The number to check.
 * @param min The minimum value of the range.
 * @param max The maximum value of the range.
 * @returns True if x is within the range [min, max], false otherwise.
 */
export function inRange(x: number, min: number, max: number): boolean {
  return (x - min) * (x - max) <= 0
}

/**
 * Returns the direction based on the value.
 * - Returns -1 for positive values (right or down).
 * - Returns 1 for negative values (left or up).
 * - Returns 0 for zero.
 *
 * @param value The value to determine the direction.
 * @returns The direction: -1, 1, or 0.
 */
export function getDirection(value: number): number {
  if (value > 0) return -1
  if (value < 0) return 1
  return 0
}

/**
 * Returns a random color from the provided array of colors.
 *
 * @param colors An array of color strings.
 * @returns A random color from the array.
 */
export function getRandomColor(colors: string[]): string {
  return colors[randomBetween(0, colors.length - 1)]
}

/**
 * Get color for hexagon from Point.
 */
export function getHexagonColor(
  ctx: CanvasRenderingContext2D,
  point: IPoint,
): {
  rgba: string
} {
  const x = point.x * DEVICE_PIXEL_RATIO
  const y = point.y * DEVICE_PIXEL_RATIO
  const { data } = ctx.getImageData(x, y, 1, 1)
  const [r, g, b, a] = data
  return {
    rgba: `rgba(${r}, ${g}, ${b}, ${a})`,
  }
}
