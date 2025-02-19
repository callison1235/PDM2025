let spriteSheet;
let character = [];
let count = 40;
let timer = 30;
let speed = 1;
let killCount = 0;
let bugsLeft = count;

function preload() {
  spriteSheet = loadImage("media/bug.png", 200, 200);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  imageMode(CENTER);

  for(i = 0; i < count; i++) {
    character[i] = new Character(spriteSheet, random(100, 1300), random(200, 600), speed, random([-1, 1]));
  }

}

function mousePressed() {
  for(i = 0; i < count; i++) {
    character[i].squish();
  }
}

function draw() {
  background(200, 200, 200);
  for(i = 0; i < count; i++) {
    character[i].draw();
  }

  textSize(50);
  text("Time Left: " + timer, 200, 100);

  if(killCount > 0) {
    if(frameCount % 60 == 0 && timer > 0) {
      timer--;
    }
  }

  if(timer == 0 || bugsLeft == 0) {
    background(225, 225, 225);
    if(bugsLeft == 0) {
      textSize(100);
      text("GAME OVER, YOU WIN!!!", 150, 350);
    } else {
      textSize(100);
      text("GAME OVER, YOU LOSE!!!", 150, 350);
    }
  }

  textSize(50);
  text("Kill Count: " + killCount, 900, 100);

}

class Character {
  constructor(spriteSheet, x, y, speed, move) {
  this.spriteSheet = spriteSheet;
  this.sx = 2;
  this.sy = 2;
  this.x = x;
  this.y = y;
  this.move = 0;
  this.speed = speed;
  this.move = move;
  this.facing = move;
  this.squished = false;
  this.dead = false;
  }

  draw() {
    push();
    translate(this.x, this.y);
    scale(this.facing, 1);
    rotate(PI / 2);

    if(this.move == 0) {
      image(this.spriteSheet, 0, 0, 80, 80, 0, 320, 80, 80);
    } else {
      image(this.spriteSheet, 0, 0, 80, 80, 80 * (this.sx), 80*(this.sy), 80, 80);
    }
    
    if(frameCount % 7 == 0) {
      this.sx = (this.sx + 1) % 4;
    }
    if (this.sx === 3){
      this.sx = 0;
    }

    this.x += speed * this.move;

    if(this.x < 50) {
      this.move = 1;
      this.facing = 1;
    } else if(this.x > 1450) {
      this.move = -1;
      this.facing = -1;
    }

    pop();
  }

  squish(){
    if(mouseX > this.x - 40 && mouseX < this.x + 40 && 
      mouseY > this.y - 40 && mouseY < this.y + 40) {

        if(!this.dead) {
          killCount += 1;
          bugsLeft -= 1;
        }

        if(!this.dead) {
          speed += 0.3;
          console.log(speed);
        }

        this.stop();
        this.squished = true;
        this.dead = true;
    }
  }

  go(direction) {
    this.move = direction;
    this.facing = direction;
    this.sx = 1;
  }

  stop() {
    this.move = 0;
  }


}