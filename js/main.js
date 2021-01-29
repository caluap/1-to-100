const Y_AXIS = 1,
	X_AXIS = 2;
let c0, c1, buffer, original, img;

let zip = new JSZip();
let capturedImg = zip.folder("images");

let canvas;

function captureImg() {
	canvas.toBlob(
		function (blob) {
			let fn = `${frameCount}`.padStart(3, "0");
			capturedImg.file(`${fn}.jpg`, blob);
			console.log(`saved img ${fn}...`);
			buffer.filter(BLUR, 3 + (frameCount / 100) * 6);
			if (frameCount == 100) {
				saveZip();
			} else {
				redraw();
			}
		},
		"image/jpeg",
		0.6
	);
}

function saveZip() {
	zip.generateAsync({ type: "blob" }).then(function (content) {
		saveAs(content, "images.zip");
	});
}

function preload() {
	img = loadImage("pic.png");
}

function setup() {
	createCanvas(500, 500);
	noLoop();
	canvas = document.getElementById("defaultCanvas0");
	c0 = color(20);
	c1 = color(235);
	buffer = createGraphics(500, 500);
	original = createGraphics(500, 500);
	original.image(img, 0, 0, width, height);
	buffer.image(img, 0, 0, width, height);
	redraw();
}

function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffleAndPrintImage(n, buffer, grid = true) {
	let swaps = n,
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
	buffer.fill(0, 16);
	buffer.rect(0, 0, width, height);
	shuffleAndPrintImage(frameCount, buffer, false);
	captureImg();
}
