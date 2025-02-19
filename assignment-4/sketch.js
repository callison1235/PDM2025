let character;
let bug;

function preload(){
  bug = loadImage('media/bug.png');
}

function setup() {
  createCanvas(600, 600);
}

function draw() {
  background('lightblue');
}

class Character{
  constructor(x,y){
    this.x = x;
    this.y = y;
    this.currentAnimation = null;
    this.animations = {};
  }

  addAnimation(key, animation){
    this.animations[key] = animation;
  }

  draw(){
    let animation = this.animations[this.currentAnimation];
    if (animation){
      switch(this.currentAnimation){
        case "up":
          this.y += 2;
          break
        case "down":
          this.y -= 2;
          break
      }
      push();
      translate(this.x, this.y);
      animation.draw();
      pop();
    }
  }
}
