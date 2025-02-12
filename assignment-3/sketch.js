let guy;
let guyFlip;
let character;

function preload() {
    guy = loadImage('media/guy.png');
    guyFlip = loadImage('media/guyFlip.png');
    sloth = loadImage('media/sloth.png');
    slothFlip = loadImage('media/slothFlip.png');
    goldy = loadImage('media/goldy.png');
    goldyFlip = loadImage('media/goldyFlip.png');
}

function setup() {
    createCanvas(600, 600);

    character = new Character(0,0);
    character.addAnimation("right", new SpriteAnimation(guy,1,0,8));
    character.addAnimation("left", new SpriteAnimation(guyFlip,14,0,8));
    character.addAnimation("faceRight", new SpriteAnimation(guy,0,0,1));
    character.addAnimation("faceLeft", new SpriteAnimation(guyFlip,15,0,1));
    character.currentAnimation = "faceRight";

    character2 = new Character(200,200);
    character2.addAnimation("right", new SpriteAnimation(sloth,1,0,8));
    character2.addAnimation("left", new SpriteAnimation(slothFlip,14,0,8));
    character2.addAnimation("faceRight", new SpriteAnimation(sloth,0,0,1));
    character2.addAnimation("faceLeft", new SpriteAnimation(slothFlip,15,0,1));
    character2.currentAnimation = "faceRight";

    character3 = new Character(400,400);
    character3.addAnimation("right", new SpriteAnimation(goldy,1,0,8));
    character3.addAnimation("left", new SpriteAnimation(goldyFlip,14,0,8));
    character3.addAnimation("faceRight", new SpriteAnimation(goldy,0,0,1));
    character3.addAnimation("faceLeft", new SpriteAnimation(goldyFlip,15,0,1));
    character3.currentAnimation = "faceRight";
}

function draw() {
    background(200);

    character.draw();
    character2.draw();
    character3.draw();
}

function keyPressed(){
  switch(keyCode){
    case RIGHT_ARROW:
      character.currentAnimation = "right";
      character2.currentAnimation = "right";
      character3.currentAnimation = "right";
      break;
    case LEFT_ARROW:
      character.currentAnimation = "left";
      character2.currentAnimation = "left";
      character3.currentAnimation = "left";
      break

  }
}

function keyReleased(){
  if(character.currentAnimation === "right")
    character.currentAnimation = "faceRight";
  if(character.currentAnimation === "left")
    character.currentAnimation = "faceLeft";
  if(character2.currentAnimation === "right")
    character2.currentAnimation = "faceRight";
  if(character2.currentAnimation === "left")
    character2.currentAnimation = "faceLeft";
  if(character3.currentAnimation === "right")
    character3.currentAnimation = "faceRight";
  if(character3.currentAnimation === "left")
    character3.currentAnimation = "faceLeft";
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
        case "right":
          this.x += 2;
          break
        case "left":
          this.x -= 2;
          break
      }
      push();
      translate(this.x, this.y);
      animation.draw();
      pop();
    }
  }
}

class SpriteAnimation {
  constructor(spritesheet, startU, startV, duration){
    this.spritesheet = spritesheet;
    this.u = startU;
    this.v = startV;
    this.duration = duration;
    this.startU = startU;
    this.frameCount = 0;
  }

  draw(){
    image(this.spritesheet,0,0,80,80,this.u*128,this.v*128,120,120);

    this.frameCount++;
    if (this.spritesheet === guy || this.spritesheet === sloth || this.spritesheet === goldy){
      if(this.frameCount % 7 === 0){
        this.u++;
      }
      if(this.u === this.startU + this.duration){
        this.u = this.startU;
      }
    }
    if (this.spritesheet === guyFlip || this.spritesheet === slothFlip || this.spritesheet === goldyFlip){
      if(this.frameCount % 7 === 0){
        this.u--;
      }
      if(this.u === this.startU - this.duration){
        this.u = this.startU;
      }
    }
  }
}
