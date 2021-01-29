const Y_AXIS = 1,
	X_AXIS = 2;
let c0, c1, buffer, original, img;

function preload() {
	img = loadImage("pic.png");
}

function setup() {
	createCanvas(500, 500);
	c0 = color(20);
	c1 = color(235);
	buffer = createGraphics(500, 500);
	original = createGraphics(500, 500);
	// setGradient(original, 0, 0, width, height, c0, c1);
	// setGradient(buffer, 0, 0, width, height, c0, c1);
	original.image(img, 0, 0, width, height);
	buffer.image(img, 0, 0, width, height);
	frameRate(1);
}

function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffleAndPrintImage(n, buffer, grid = true) {
	console.log(`image #${n}`);
	let swaps = n + 1, //;Math.max(1, Math.ceil(Math.pow(n - 1, 2)));
		size = Math.round(width / n);

	if (grid) {
		buffer.stroke(255, (n / 100) * 32);
		buffer.strokeWeight(1);
		buffer.noFill();
		buffer.rect(0, 0, width, height);
		for (let i = 0; i < swaps; i++) {
			// draws grid
			buffer.line(i * size - 0.5, -0.5, i * size - 0.5, height - 0.5);
			buffer.line(-0.5, i * size - 0.5, width - 0.5, i * size - 0.5);
		}
	}

	if (n == 1) {
		image(buffer, 0, 0);
	} else {
		let coords = [];
		// defines swaps
		for (let i = 0; i < swaps; i++) {
			let x, y;
			do {
				x = getRandomInt(0, n - 1);
				y = getRandomInt(0, n - 1);
			} while (coords.some((item) => item.x === x && item.y === y));
			coords.push({ x, y });
		}
		for (let i = 1; i < swaps; i++) {
			let sx = coords[i - 1].x * size,
				sy = coords[i - 1].y * size,
				dx = coords[i].x * size,
				dy = coords[i].y * size;
			buffer.image(original, sx, sy, size, size, dx, dy, size, size);
			buffer.image(original, dx, dy, size, size, sx, sy, size, size);
		}
	}

	image(buffer, 0, 0);
}

function draw() {
	// buffer.fill((1 - frameCount / 100) * 255, (frameCount / 100) * 255);
	buffer.fill(0, 16);
	buffer.rect(0, 0, width, height);
	// buffer.image(img, 0, 0);
	shuffleAndPrintImage(frameCount, buffer);
	if (frameCount == 100) {
		noLoop();
	}
}

function setGradient(buffer, x, y, w, h, c1, c2, axis = Y_AXIS) {
	noFill();

	if (axis === Y_AXIS) {
		// Top to bottom gradient
		for (let i = y; i <= y + h; i++) {
			let inter = map(Math.pow(i / (y + h), 2), 0, 1, 0, 1);
			let c = lerpColor(c1, c2, inter);
			buffer.stroke(c);
			buffer.line(x, i, x + w, i);
		}
	} else if (axis === X_AXIS) {
		// Left to right gradient
		for (let i = x; i <= x + w; i++) {
			let inter = map(i, x, x + w, 0, 1);
			let c = lerpColor(c1, c2, inter);
			buffer.stroke(c);
			buffer.line(i, y, i, y + h);
		}
	}
}
