import type { Color } from './types'

export const DEVICE_PIXEL_RATIO = window.devicePixelRatio || 1

// export const BGCOLORS_DARK = ['#1c1312', '#151e13', '#141c1e', '#1d1b13']
// export const BORDER_COLORS_DARK = ['#ef8a84', '#a1fc8f', '#9ae7fc', '#f9da8c']
// export const BGCOLORS_DARK = ['#ff1900', '#2fff00', '#00ccff', '#ffcc00']
// export const BGCOLORS_DARK = ['#120c0b', '#0d120b', '#0f1517', '#1c1a11']
// export const BGCOLORS_DARK = [
//   '#551752ff',
//   '#164e00ff',
//   '#184f61ff',
//   '#a18818ff',
// ]
export const BGCOLORS_LIGHT = [
  '#c0cf94',
  '#e38c95',
  '#5d96af',
  '#f5deb2',
  '#b1d8eb',
  '#00ab6e',
  '#007bd2',
  '#D37667',
  '#ECC980',
]
// export const BORDER_COLORS = [
//   '#b1d8eb',
//   '#00ab6e',
//   '#007bd2',
//   '#D37667',
//   '#ECC980',
// ]
// const HIT_COLORS = ['#ff190050', '#2fff0050', '#00ccff50', '#ffcc0050']

export const hexAlpha = {
  100: 'FF',
  90: 'E6',
  80: 'CC',
  70: 'B3',
  60: '99',
  50: '80',
  40: '66',
  30: '4D',
  20: '33',
  10: '1A',
  0: '00',
}

export const COLORS_BOTH_DARK_AND_LIGHT: Color[] = [
  { name: 'pink', stroke: 'rgb(254,0,246)', shadow: 'rgba(254,0,246, .3)' },
  {
    name: 'lightblue',
    stroke: 'rgb(0, 145, 228)',
    shadow: 'rgba(0, 145, 228, .5)',
  },
  {
    name: 'Primary',
    stroke: '#519d90',
    shadow: 'rgba(81,157,144,.5)',
  },
  {
    name: 'Secondary',
    stroke: '#00ab6e',
    shadow: 'rgba(0,171,110,.5)',
  },
  {
    name: 'Tertiary',
    stroke: '#007bd2',
    shadow: 'rgba(0,123,210,.5)',
  },
  {
    name: 'purple',
    stroke: 'rgb(184, 108, 253)',
    shadow: 'rgba(184, 108, 253, .4)',
  },
  {
    name: 'red',
    stroke: 'rgb(252, 107, 104)',
    shadow: 'rgba(252, 107, 104, .4)',
  },
]

// export const COLORS_DARK_OLD: Color[] = [
// {
//   name: 'green',
//   stroke: 'rgba(11, 255, 1, 1)',
//   shadow: 'rgba(11, 255, 1, .5)',
// },
// {
//   name: 'lightblue',
//   stroke: 'rgb(0, 145, 228)',
//   shadow: 'rgba(0, 145, 228, .5)',
// }, // Ok but ligher blur better
// { name: 'pink', stroke: 'rgb(254,0,246)', shadow: 'rgba(254,0,246, .3)' },
// { name: 'yellow', stroke: 'rgb(253,254,2)', shadow: 'rgba(253,254,2, .3)' },
// {
//   name: 'brigh-turquoise',
//   stroke: 'rgb(12, 252, 211)',
//   shadow: 'rgba(12, 252, 211, .3)',
// },
// {
//   name: 'pink2',
//   stroke: 'rgb(254, 83, 188)',
//   shadow: 'rgba(254, 83, 188, .4)',
// },
// {
//   name: 'purple',
//   stroke: 'rgb(184, 108, 253)',
//   shadow: 'rgba(184, 108, 253, .4)',
// },
// {
//   name: 'lightblue2',
//   stroke: 'rgb(118, 213, 253)',
//   shadow: 'rgba(118, 213, 253, .4)',
// },
// {
//   name: 'red',
//   stroke: 'rgb(252, 107, 104)',
//   shadow: 'rgba(252, 107, 104, .4)',
// },
// {
//   name: 'orange',
//   stroke: 'rgba(255, 170, 1, 1)',
//   shadow: 'rgba(255, 170, 1, .4)',
// },
// { name: 'black', stroke: 'rgba(0, 0, 0, 1.00)', shadow: 'rgba(0, 0, 0, 1.00)' }, // SILENT KILLER
// {
//   name: 'white',
//   stroke: 'rgba(255, 255, 255, 1)',
//   shadow: 'rgba(255, 255, 255, .4)',
// },
// ]
