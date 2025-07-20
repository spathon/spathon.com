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
}

export type Player = {
  initPos: Cube
  from: IPoint
  to: IPoint
  amount: number
  directionX: number
  directionY: number
}
