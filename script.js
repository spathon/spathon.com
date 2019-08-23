function debounce(fn, delay, context) {
	var timer = null
	return function () {
		var args = arguments
		clearTimeout(timer)
		timer = setTimeout(function () {
			fn.apply(context, args)
		}, delay)
	}
}


function Pixel() {
	this.animationTick = 0
	this.windowHeight = window.innerHeight
	this.windowWidth = window.innerWidth
	this.boxHeight = 0
	this.boxWidth = 0
	this.boxColumns = 0
	this.boxRows = 0
	this.config = {
		delay: 32,
		pixelsPerTick: 2,
		boxSize: 25,
		alpha: 0.5,
		colors: ['#c0cf94', '#e38c95', '#5d96af', '#f5deb2', '#b1d8eb', '#00ab6e', '#007bd2', '#D37667', '#ECC980']
	}
	this.canvas = document.createElement('canvas')
	this.canvas.id = 'bgCanvas'
	this.canvas.width = this.windowWidth
	this.canvas.height = this.windowHeight
	this.ctx = this.canvas.getContext('2d')

	this.initialPaint()
	this.initResizeEvent()
	this.render()
}

Pixel.prototype.initResizeEvent = function () {
	var windowResize = debounce(function() {
		this.windowWidth = window.innerWidth
		this.windowHeight = window.innerHeight
		this.canvas.width = this.windowWidth
		this.canvas.height = this.windowHeight
		this.initialPaint()
	}, 500, this)

	window.addEventListener('resize', windowResize, false)
}

Pixel.prototype.initialPaint = function() {
	document.body.appendChild(this.canvas)

	// Make the boxes fit the screen without cuting off at the ends
	var rows = Math.floor(this.windowHeight / this.config.boxSize)
	this.boxHeight = this.windowHeight / rows
	var columns = Math.floor(this.windowWidth / this.config.boxSize)
	this.boxWidth = this.windowWidth / columns

	// Set opacity
	this.ctx.globalAlpha = this.config.alpha

	this.boxColumns = this.windowWidth / this.boxWidth
	this.boxRows = this.windowHeight / this.boxHeight
	for (var i = 0; i < this.boxRows; i++) {
		for (var j = 0; j < this.boxColumns; j++) {
			this.drawPixel(j, i)
		}
	}
}

function generateRandomFloat(min, max) {
  return Math.random() * (max - min) + min
}

Pixel.prototype.drawPixel = function(x, y) {
	var randomColorIndex = Math.floor(Math.random() * this.config.colors.length)
	this.ctx.fillStyle = this.config.colors[randomColorIndex]

	this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)'
	this.ctx.lineWidth = 0.5
	this.ctx.globalAlpha = generateRandomFloat(.2, .8)

	// a random number fited to the size
	var posX = x * this.boxWidth
	var posY = y * this.boxHeight

	this.ctx.fillRect(posX, posY, this.boxWidth, this.boxHeight)
	this.ctx.strokeRect(posX, posY, this.boxWidth, this.boxHeight)
}

Pixel.prototype.render = function () {
	this.animationTick++
	if (this.animationTick > this.config.delay) {
		this.drawBoxes(this.config.pixelsPerTick)
		this.animationTick = 0
	}
	requestAnimationFrame(this.render.bind(this))
}

Pixel.prototype.drawBoxes = function (num) {
	for (var i = 0; i < num; i++) {
		var posX = Math.floor(Math.random() * this.boxColumns)
		var posY = Math.floor(Math.random() * this.boxRows)
		this.drawPixel(posX, posY)
	}
}


document.addEventListener('DOMContentLoaded', function() {
	new Pixel()
}, false);


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
	var colors = ['#c0cf94', '#e38c95', '#5d96af', '#f5deb2', '#b1d8eb', '#00ab6e', '#007bd2', '#D37667', '#ECC980']
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
	// window.onresize = function() { windowResize() }


	// document.addEventListener('DOMContentLoaded', init, false);
}(window));
