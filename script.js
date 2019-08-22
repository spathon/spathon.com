(function(window){
	'use strict'
	var document = window.document

	/**
	 * Variables
	 */
	var canvas, ctx, boxHeight, boxWidth
	var delay = 1
	var windowHeight = window.innerHeight
	var windowWidth = window.innerWidth
	var boxSize = 25
	var colors = ['#c0cf94', '#e38c95', '#5d96af', '#f5deb2', '#b1d8eb']
	var colorsCount = colors.length
	// Blue
	// var colors = ['#d8e7f1', '#bfd6e8', '#a3c4de', '#89b3d4', '#6ba2ca', '#fff'], // , '#3779a9'


	function drawBox() {
		var randomColorIndex = Math.floor(Math.random() * colorsCount)
		ctx.fillStyle = colors[randomColorIndex]

		ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)'
		ctx.lineWidth = 0.5

		// a random number fited to the size
		var posX = Math.floor(Math.random() * (windowWidth / boxWidth)) * boxWidth
		var posY = Math.floor(Math.random() * (windowHeight / boxHeight)) * boxHeight

		ctx.fillRect(posX, posY, boxWidth, boxHeight)
		ctx.strokeRect(posX, posY, boxWidth, boxHeight)
	}


	function initialPaint() {
		// Make the boxes fit the screen without cuting off at the ends
		var rows = Math.floor(windowHeight / boxSize)
		boxHeight = windowHeight / rows
		var columns = Math.floor(windowWidth / boxSize)
		boxWidth = windowWidth / columns

		// Set opacity
		ctx.globalAlpha = 0.5

		var num = (windowWidth / boxWidth) * (windowHeight / boxHeight) * 2
		for(var i = 0; i < num; i++) {
			drawBox()
		}
	}


	function render() {
		delay++
		if (delay > 32) {
			drawBox()
			delay = 0
		}
		requestAnimationFrame(render)
	}


	function init() {
		canvas = document.createElement('canvas')
		canvas.id = 'bgCanvas'
		canvas.width = windowWidth
		canvas.height = windowHeight
		document.body.appendChild(canvas)
		ctx = canvas.getContext('2d')

		initialPaint()
		render()
	}


	function debounce(fn, delay) {
		var timer = null
		return function () {
			var context = this, args = arguments
			clearTimeout(timer)
			timer = setTimeout(function () {
				fn.apply(context, args)
			}, delay)
		}
	}


	var windowResize = debounce(function() {
		windowWidth = window.innerWidth
		windowHeight = window.innerHeight
		canvas.width = windowWidth
		canvas.height = windowHeight
		initialPaint()
	}, 500)
	window.onresize = function() { windowResize() }


	document.addEventListener('DOMContentLoaded', init, false);
}(window));
