import type { Cube, IPoint } from './hex'

export type Color = {
  name: string
  stroke: string
  shadow: string
}

export type State = {
  currentColor: Color
  timeOutId: number | undefined
  isDarkMode: boolean

  WIDTH: number
  HEIGHT: number

  RADIUS: number
  SPACING: number
  HEX_RADIUS: number
  HEX_WIDTH: number
  HEX_HEIGHT: number
  HEX_SPACING: number
  ITEMS_WIDTH: number
  ITEMS_HEIGHT: number
}

export type Player = {
  initPos: Cube
  from: IPoint
  to: IPoint
  amount: number
  directionX: number
  directionY: number
}
