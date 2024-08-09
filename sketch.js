let song;
let size;
let num;
let offset;
let grid = [];
let fft;
let spectrum = [];
let distanceFromCenter = [];
let totalCubes;
let min = 150;
let angle = 0;

function preload() {
  song = loadSound("busted-51452.mp3");
}
function setup() {
  createCanvas(400, 400, WEBGL);
  angleMode(DEGREES);
  size = 15;
  num = 15;
  fft = new p5.FFT();

  // mic = new p5.AudioIn();
  // userStartAudio().then(function () {
  //   mic.start();
  // });

  userStartAudio().then(function () {
    song.play();
  });

  for (let i = 0; i < num; i++) {
    grid[i] = [];
    for (let j = 0; j < num; j++) {
      grid[i][j] = [];
      for (let k = 0; k < num; k++) {
        grid[i][j][k] = floor(random(2));

        let offset = size / 2 - (num / 2) * size;
        let x = i * size + offset;
        let y = j * size + offset;
        let z = k * size + offset;
        let distance = dist(x, y, z, 0, 0, 0);

        distanceFromCenter.push({ i, j, k, distance });
      }
    }
  }
  distanceFromCenter.sort(compareDistances);
}
function compareDistances(a, b) {
  return a.distance - b.distance;
}

function draw() {
  background(233);
  orbitControl();
  spectrum = fft.analyze();
  let vol = fft.getEnergy(20, 140);

  if (vol > 160) {
    stroke(255, 255, 0, 20);
  } else {
    stroke(0, 20);
  }
  totalCubes = num * num * num;
  for (let i = 0; i < totalCubes; i++) {
    let pos = distanceFromCenter[i];
    let c = map(spectrum[i], 0, 255, min, 255);
    grid[pos.i][pos.j][pos.k] = c;
  }

  offset = size / 2 - (num / 2) * size;
  translate(offset, offset, offset);
  for (let i = 0; i < num; i++) {
    for (let j = 0; j < num; j++) {
      for (let k = 0; k < num; k++) {
        if (grid[i][j][k] > min) {
          fill(grid[i][j][k], 0, 200);
        } else {
          noFill();
        }

        push();
        translate(i * size, j * size, k * size);
        rotateY(15);
        rotateX(-15);
        box(size - size / 4);
        pop();
      }
    }
  }
}

function windowResized() {
  resizeCanvas(400, 400);
}
