(function(window){
	'use strict';
	var document = window.document;

	/**
	 * Variables
	 */
	var canvas, ctx,
		delay = 1,
		wHeight = window.innerHeight,
		wWidth = window.innerWidth,
		size = 25,
		size_h,
		size_w,
		// colors = ['#d8e7f1', '#bfd6e8', '#a3c4de', '#89b3d4', '#6ba2ca', '#fff'], // , '#3779a9'
		colors = ['#c0cf94', '#e38c95', '#5d96af', '#f5deb2', '#b1d8eb'],
		color_lenght = colors.length;

	var init = function() {
		canvas = document.createElement('canvas');
		canvas.id = 'bgCanvas';
		canvas.width = wWidth;
		canvas.height = wHeight;
		document.body.appendChild(canvas);
		ctx = canvas.getContext('2d');

		initCanvas();
	}

	function drawInit() {
		// Make the boxes fit the screen without cuting off at the ends
		var rows = Math.floor(wHeight / size)
		size_h = wHeight / rows
		var columns = Math.floor(wWidth / size)
		size_w = wWidth / columns

		// Set opacity
		ctx.globalAlpha = 0.5

		var num = (wWidth / size_w) * (wHeight / size_h) * 2;
		for(var i = 0; i < num; i++){
			drawCanvas();
		}
	}

	var initCanvas = function(){
		drawInit();
		renderCanvas();
	}
	var renderCanvas = function(){
		delay++;
		if(delay > 32){
			drawCanvas();
			delay = 0;
		}
		requestAnimationFrame(renderCanvas);
	}

	var drawCanvas = function(){
		ctx.fillStyle = colors[Math.floor(Math.random()*color_lenght)];

		ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)'
		ctx.lineWidth = 0.5

		// a random number fited to the size
		var posX = ( ( Math.random()*(wWidth / size_w) ) << 0 )*size_w,
			posY = ( ( Math.random()*(wHeight / size_h) ) << 0)*size_h;

		ctx.fillRect(posX, posY, size_w, size_h);
		ctx.strokeRect(posX, posY, size_w, size_h)
	}

	function debounce(fn, delay) {
		var timer = null;
		return function () {
			var context = this, args = arguments;
			clearTimeout(timer);
			timer = setTimeout(function () {
				fn.apply(context, args);
			}, delay);
		};
	}

	var windowResize = debounce(function() {
		console.log('Start')
		wWidth = window.innerWidth,
		wHeight = window.innerHeight;
		canvas.width = wWidth;
		canvas.height = wHeight;
		drawInit();
		console.log('Done')
	}, 500)

	window.onresize = function() {
		windowResize()
	}

	document.addEventListener('DOMContentLoaded', init, false);
}(window));
