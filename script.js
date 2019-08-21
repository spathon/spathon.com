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
		size = 32,
		// colors = ['#d8e7f1', '#bfd6e8', '#a3c4de', '#89b3d4', '#6ba2ca', '#fff'], // , '#3779a9'
		colors = ['#c0cf94', '#e38c95', '#5d96af', '#f5deb2', '#b1d8eb'],
		color_lenght = colors.length;

	var init = function(){
		// if the width is to small abort
		// if(wWidth < 600) return;

		canvas = document.createElement('canvas');
		canvas.id = 'bgCanvas';
		canvas.width = wWidth;
		canvas.height = wHeight;
		document.body.appendChild(canvas);

		ctx = canvas.getContext('2d');
		ctx.globalAlpha = 0.5

		initCanvas();
	}

	function drawInit() {
		var num = (wWidth / size) * (wHeight / size) * 2;
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
		// ctx.shadowOffsetX = 0;
		// ctx.shadowOffsetY = 0;
		// ctx.shadowBlur = .5;
		// ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';

		// a random number fited to the size
		var posX = ( ( Math.random()*(wWidth / size) ) << 0 )*size,
			posY = ( ( Math.random()*(wHeight / size) ) << 0)*size;

		ctx.fillRect(posX, posY, size, size);
		ctx.strokeRect(posX, posY, size, size)
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
