export type Degrees = 0 | 60 | 120 | 180 | 240 | 300
export interface IPoint {
  x: number
  y: number
  degree?: Degrees
}

export function Point(x: number, y: number, degree: Degrees = 0): IPoint {
  return { x, y, degree }
}

export class Hex {
  q: number
  r: number
  s: number
  // directions = [
  //   new Hex(1, 0, -1),
  //   new Hex(1, -1, 0),
  //   new Hex(0, -1, 1),
  //   new Hex(-1, 0, 1),
  //   new Hex(-1, 1, 0),
  //   new Hex(0, 1, -1),
  // ]

  constructor(q: number, r: number, s: number) {
    if (Math.round(q + r + s) !== 0) throw new Error('q + r + s must be 0')
    this.q = q
    this.r = r
    this.s = s
  }
}

export interface HexaConfig {
  size?: number
  spacing?: number
}

export class Hexa {
  SIZE: number
  SPACING: number
  TOTAL_SIZE: number

  constructor(config: HexaConfig = {}) {
    this.SIZE = config.size ?? 20
    this.SPACING = config.spacing ?? 3
    this.TOTAL_SIZE = this.SIZE + this.SPACING
  }

  static oddqToCube(point: IPoint): Hex {
    const q = point.x
    const r = point.y - (point.x - Math.abs(point.x % 2)) / 2
    const s = -q - r
    return new Hex(q, r, s)
  }

  flatHexToPixel(hex: Hex): IPoint {
    const x = this.TOTAL_SIZE * ((3 / 2) * hex.q)
    const y =
      this.TOTAL_SIZE * ((Math.sqrt(3) / 2) * hex.q + Math.sqrt(3) * hex.r)
    return Point(x, y)
  }

  static cubeRound(hex: Hex): Hex {
    let qi = Math.round(hex.q)
    let ri = Math.round(hex.r)
    let si = Math.round(hex.s)
    const qDiff = Math.abs(qi - hex.q)
    const rDiff = Math.abs(ri - hex.r)
    const sDiff = Math.abs(si - hex.s)

    if (qDiff > rDiff && qDiff > sDiff) {
      qi = -ri - si
    } else if (rDiff > sDiff) {
      ri = -qi - si
    } else {
      si = -qi - ri
    }
    return new Hex(qi, ri, si)
  }

  pixelToFlatHex(point: IPoint): Hex {
    const q = ((2 / 3) * point.x) / this.TOTAL_SIZE
    const r =
      ((-1 / 3) * point.x + (Math.sqrt(3) / 3) * point.y) / this.TOTAL_SIZE
    return this.hexRound(q, r)
  }

  hexRound(q: number, r: number): Hex {
    const hex = new Hex(q, r, -q - r)
    return (this.constructor as typeof Hexa).cubeRound(hex)
  }

  getCorners(center: IPoint, size: number = this.SIZE): IPoint[] {
    const points: IPoint[] = []
    for (let i = 0; i < 6; i += 1) {
      const degree = (60 * i) as Degrees
      const radian = (Math.PI / 180) * degree

      const point = Point(
        center.x + size * Math.cos(radian),
        center.y + size * Math.sin(radian),
        degree,
      )
      points.push(point)
    }
    return points
  }
}
