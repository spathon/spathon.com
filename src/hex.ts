const degreeValues = [0, 60, 120, 180, 240, 300] as const
const degreeIndexes = [0, 1, 2, 3, 4, 5] as const
export type Degrees = (typeof degreeValues)[number]
export type DegreeIndexes = (typeof degreeIndexes)[number]

export interface IPoint {
  x: number
  y: number
  degree?: Degrees
}

export interface HexaConfig {
  size?: number
  spacing?: number
}

// Creates a point object with optional degree (angle in hex grid)
export function Point(x: number, y: number, degree: Degrees = 0): IPoint {
  return { x, y, degree }
}

//       240   300
//        ______
//       /      \
//  180 ❮        ❯ 0
//       \______/
//      120     60

export type Hex = {
  q: number // x coordinate in cube coordinates
  r: number // y coordinate in cube coordinates
  // s: number z coordinate in cube coordinates (derived from q and r)
}

/**
 * Constructs a hex using axial coordinates (q, r).
 * q = x, r = y
 */
function Hex(q: number, r: number): Hex {
  return { q, r }
}

export type Cube = {
  q: number // x coordinate in cube coordinates
  r: number // y coordinate in cube coordinates
  s: number // z coordinate in cube coordinates (derived from q and r)
}

/**
 * Constructs a hex using cube coordinates (q, r, s).
 * q = x, r = y, s = z (Up one position form center (1, 0, -1) and down (-1, 0, 1))
 * The sum q + r + s must always be 0 for valid hex coordinates.
 * This is a property of cube coordinates in hex grids.
 */
export function Cube(q: number, r: number, s: number): Cube {
  if (Math.round(q + r + s) !== 0) throw new Error('q + r + s must be 0')
  return {
    q,
    r,
    s,
  }
}

const cubeDirectionVectors = {
  downRight: Cube(+1, 0, -1),
  upRight: Cube(+1, -1, 0),
  up: Cube(0, -1, +1),
  upLeft: Cube(-1, 0, +1),
  downLeft: Cube(-1, +1, 0),
  down: Cube(0, +1, -1),
}
export type CubeDirection = keyof typeof cubeDirectionVectors

export class Hexa {
  RADIUS: number
  SPACING: number
  HEX_RADIUS: number

  /**
   * Constructs a Hexa grid configuration.
   * SIZE: radius of hex
   * SPACING: gap between hexes
   * TOTAL_SIZE: effective hex size including spacing
   */
  constructor(config: HexaConfig = {}) {
    this.RADIUS = config.size ?? 20
    this.SPACING = config.spacing ?? 3
    this.HEX_RADIUS = this.RADIUS + this.SPACING
  }

  static cubeDirection(direction: CubeDirection): Hex {
    return cubeDirectionVectors[direction]
  }

  /**
   * Converts odd-q offset coordinates (used in 2D arrays) to cube coordinates.
   * q: (x) column, r: (y) row adjusted for odd columns, s: (z) derived to keep q+r+s=0.
   * See https://www.redblobgames.com/grids/hexagons/#coordinates-odd-q
   */
  static oddqToCube(point: IPoint): Cube {
    const parity = Math.abs(point.x % 2)
    const q = point.x
    const r = point.y - (point.x - parity) / 2
    const s = -q - r // z
    return Cube(q, r, s)
  }

  static cubeToOddq(cube: Cube): IPoint {
    const parity = cube.q & 1 // Same as Math.abs(hex.q % 2)
    const col = cube.q
    const row = cube.r + (cube.q - parity) / 2
    return Point(col, row)
  }

  /**
   * Converts cube hex coordinates to pixel coordinates for flat-topped hexes.
   * x: horizontal position, y: vertical position using hex math.
   * See https://www.redblobgames.com/grids/hexagons/#hex-to-pixel
   */
  static flatHexToPixel(cube: Cube, radius: number): IPoint {
    const x = (3 / 2) * cube.q * radius
    const y = ((Math.sqrt(3) / 2) * cube.q + Math.sqrt(3) * cube.r) * radius
    return Point(x, y)
  }

  /**
   * Rounds floating point cube coordinates to nearest valid integer cube coordinates.
   * Ensures q + r + s = 0 after rounding by correcting the largest difference.
   */
  static cubeRound(cube: Cube): Cube {
    let qi = Math.round(cube.q)
    let ri = Math.round(cube.r)
    let si = Math.round(cube.s)
    const qDiff = Math.abs(qi - cube.q)
    const rDiff = Math.abs(ri - cube.r)
    const sDiff = Math.abs(si - cube.s)

    // Correct the coordinate with the largest rounding error
    if (qDiff > rDiff && qDiff > sDiff) {
      qi = -ri - si
    } else if (rDiff > sDiff) {
      ri = -qi - si
    } else {
      si = -qi - ri
    }
    return Cube(qi, ri, si)
  }

  /**
   * Axial coordinates (q, r) to cube coordinates (q, r, s).
   * Axial aka Hex
   */
  static axialToCube(hex: Hex) {
    const s = -hex.q - hex.r
    return Cube(hex.q, hex.r, s)
  }

  /**
   * Converts pixel coordinates to cube hex coordinates for flat-topped hexes.
   * Uses inverse of flatHexToPixel math, then rounds to nearest hex.
   */
  pixelToFlatHex(point: IPoint): Cube {
    // invert the scaling
    const xScaled = point.x / this.HEX_RADIUS
    const yScaled = point.y / this.HEX_RADIUS
    // cartesian to hex
    const q = (2 / 3) * xScaled
    const r = (-1 / 3) * xScaled + (Math.sqrt(3) / 3) * yScaled
    const cube = Hexa.axialToCube(Hex(q, r))
    return Hexa.cubeRound(cube)
  }

  /**
   * Returns the 6 corner points of a hex centered at 'center' with given 'size'.
   * Each corner is calculated by rotating 60 degrees around the center.
   * Starting from 0 degrees, it returns points in clockwise order.
   */
  static getAllCorners(center: IPoint, radius: number): IPoint[] {
    return degreeIndexes.map((i) => Hexa.flatHexCorner(center, radius, i))
  }

  /**
   * Returns a single corner point of a flat-topped hexagon.
   * Uses the angle in degrees to calculate the position based on center and radius.
   * i: index from 0 to 5 representing the corner (0 = right, 1 = up-right, etc.)
   */
  static flatHexCorner(
    center: IPoint,
    radius: number,
    i: DegreeIndexes,
  ): IPoint {
    // Returns the corner points of a flat-topped hexagon
    const angleDegree = degreeValues[i] // 60 * i
    const radian = (Math.PI / 180) * angleDegree
    const x = center.x + radius * Math.cos(radian)
    const y = center.y + radius * Math.sin(radian)

    return Point(x, y, angleDegree)
  }
}
