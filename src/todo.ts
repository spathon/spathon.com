/**
 * TODO
 *
 * - [ ] Add player movement with arrow keys
 * - [ ] Menu to configure variables like hex radius, spacing, colors etc.
 * - [ ] light up the hexagon a player hits with fade away effect
 * - [ ] Reset on resize
 */

// /**
//  * Steer the game with arrow keys
//  */

// // Left 37 - Up 38 - Right 39 - Down 40
// const arrows = {
//   ArrowLeft: { key: 'left', value: 0 },
//   ArrowUp: { key: 'up', value: 1 },
//   ArrowRight: { key: 'right', value: 1 },
//   ArrowDown: { key: 'down', value: 0 },
// } as const

// const nextDirection = document.getElementById('nextDirection')
// document.addEventListener('keydown', (evt) => {
//   const code = evt.code
//   if (
//     code !== 'ArrowLeft' &&
//     code !== 'ArrowUp' &&
//     code !== 'ArrowRight' &&
//     code !== 'ArrowDown'
//   ) {
//     return
//   }
//   const { key, value } = arrows[code]
//   const playerDegree = player.from.degree
//   if (!playerDegree) return

//   const nextCorner = DIRECTIONS[playerDegree].next[value]
//   const nextOptionsDir = DIRECTIONS[nextCorner][key]
//   const nextDirectionDegree = DIRECTIONS[nextCorner].next[nextOptionsDir]
//   if (nextDirection) {
//     nextDirection.style.transform = `rotate(${nextDirectionDegree}deg)`
//   }
//   player.direction = key
// })

// /**
//  * DEBUG function to get color from canvas at click position
//  */
// function componentToHex(c: number) {
//   var hex = c.toString(16)
//   return hex.length === 1 ? `0${hex}` : hex
// }
// function rgbToHex(r: number, g: number, b: number) {
//   return `#${componentToHex(r) + componentToHex(g) + componentToHex(b)}`
// }
// bgCanvas.addEventListener('click', (evt) => {
//   const offsetX = evt.pageX * DEVICE_PIXEL_RATIO
//   const offsetY = evt.pageY * DEVICE_PIXEL_RATIO
//   const imageData = bgCtx.getImageData(offsetX, offsetY, 1, 1)
//   const hex = rgbToHex(imageData.data[0], imageData.data[1], imageData.data[2])
//   console.log(
//     `%cClicked color at (${offsetX}, ${offsetY}): ${hex}`,
//     `color: ${hex}`,
//   )
// })
