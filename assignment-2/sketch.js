let colors = ['red', 'orange', 'yellow', 'green', 'cyan', 'blue', 'magenta', 'brown', 'white', 'black'];
let selectedColor = 'black';
let paletteWidth = 50; 
let prevX, prevY; 

function setup() {
  createCanvas(1200, 600);
  background(255); 
  makePal(); 
}

function draw() {
  if (mouseIsPressed && mouseX > paletteWidth) {
    stroke(selectedColor);
    strokeWeight(4);
    line(prevX, prevY, mouseX, mouseY);
  }
  prevX = mouseX;
  prevY = mouseY;
}

function mousePressed() {
  if (mouseX < paletteWidth) {
    let i = floor(mouseY / (height / colors.length));
    if (i >= 0 && i < colors.length) {
      selectedColor = colors[i];
    }
  }
}

function makePal() {
  for (let i = 0; i < colors.length; i++) {
    fill(colors[i]);
    stroke(0);
    rect(0, (height / colors.length) * i, paletteWidth, height / colors.length);
  }
}


