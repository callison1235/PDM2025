let port;
let connectButton;
let startButton;
let xInput, swInput;

let cup, ball;
let balls = [];
let score = 0;
let cupAnimate;
let ballSpeed = 3;
let spawnRate = 20;
let maxBalls = 10;

let gameTime = 30;
let startTime;
let timeLeft;

let screenWidth = 600;
let screenHeight = 600;
let gameStatus = 'S';
let gameOver = false;
let winScore = 30;
let gameStarted;

let synth, kick, melodyPart, drumPart, noise, filter, lfo;
let isPlaying = false;


function preload(){
  cup = loadImage('media/cup.png');
  ball = loadImage('media/ball.png');
}

function setup() {
  createCanvas(600, 600);

  port = createSerial();
  connectButton = createButton("Connect to Arduino");
  connectButton.position(10, 600);
  connectButton.mousePressed(connectToSerial);
 
  cupAnimate = new Character(300,400);
  cupAnimate.addAnimation("left", new SpriteAnimation(cup,1,0,2));
  cupAnimate.addAnimation("right", new SpriteAnimation(cup,3,0,2));
  cupAnimate.addAnimation("neutral", new SpriteAnimation(cup,0,0,1));
  cupAnimate.currentAnimation = "neutral";

  startTime = millis();
}

function draw() {
  background(255);
  let str = port.readUntil('\n');
  if (str !== ""){
    const vals = str.split(',');
    if (vals.length == 2){
      xInput = Number(vals[0]);
      swInput = Number(vals[1]);

      console.log(xInput + "," + swInput);
    }
  }
  cupAnimate.draw();
  switch(xInput){
    case xInput < 0:
      cupAnimate.currentAnimation = "left";
      break;
    case xInput > 0:
      cupAnimate.currentAnimation = "right";
      break;
    case xInput === 0:
    default:
      cupAnimate.currentAnimation = "neutral";
      break;
  }

  for(i = 0; i < maxBalls; i++) {
    balls[i] = new Ball(random(50,500), 15, ballSpeed, 1);
  }

  if(gameStatus === 'S'){
    drawStartScreen();
  }
  else if (!gameOver){
    playGame();
  }
}

function connectToSerial(){
  port.open('Arduino', 9600);
}

function drawStartScreen() {
  background(255, 165, 0);
  
  fill(255);
  textSize(40);
  textAlign(CENTER);
  text("CATCH THE BALLS!", width/2, height/3);
  
  textSize(20);
  text("Use the joystick to move the cup left and right", width/2, height/2);
  text("Catch " + winScore + " balls before time runs out", width/2, height/2 + 30);
  
  let buttonWidth = 120;
  let buttonHeight = 50;
  let buttonX = width/2 - buttonWidth/2;
  let buttonY = height/2 + 100;
  
  fill(50, 200, 50);
  rect(buttonX, buttonY, buttonWidth, buttonHeight, 10);

  fill(255);
  textSize(24);
  text("START", width/2, buttonY + buttonHeight/2 + 8);
  
  if (mouseIsPressed && 
      mouseX > buttonX && mouseX < buttonX + buttonWidth &&
      mouseY > buttonY && mouseY < buttonY + buttonHeight) {
    startGame();
    startMusic();
  }
  
  if (keyIsPressed && (key === ' ' || keyCode === ENTER)) {
    startGame();
    startMusic();
  }
}
function playGame() {
  updateTimer();
  drawGameInfo();
  
  if (score >= winScore) {
    gameStatus = 'W';
    gameOver = true;
    sendGameStatus('W');
  }

  if (timeLeft <= 0) {
    if (score >= winScore) {
      gameStatus = 'W';
    } else {
      gameStatus = 'L';
    }
    gameOver = true;
    sendGameStatus(gameStatus);
  }
}

function startGame() {
  gameStatus = 'P';
  gameStarted = true;
  gameOver = false;
  
  score = 0;
  ballSpeed = 3;
  
  balls.visible = true;
  
  startTime = millis();
  timeLeft = gameTime;
  
  sendGameStatus('P');
}

function updateTimer() {
  timeLeft = gameTime - (millis() - startTime) / 1000;
  timeLeft = max(timeLeft, 0);
  let timeRatio = timeLeft/gameTime;
  ballSpeed += timeRatio;
}

function drawGameInfo() {
  fill(0);
  textSize(16);
  textAlign(LEFT);
  text("Score: " + score, 20, 30);
  text("Time: " + timeLeft.toFixed(1) + "s", 20, 80);
  
  textAlign(RIGHT);
  text("Target: " + winScore, width - 20, 30);
  
  let timeBarWidth = 200;
  let timeRatio = timeLeft / gameTime;
  stroke(0);
  fill(200);
  rect(width - timeBarWidth - 20, 55, timeBarWidth, 20);
  
  let timeColor = lerpColor(
    color(255, 0, 0),
    color(0, 255, 0),
    timeRatio
  );
  fill(timeColor);
  noStroke();
  rect(width - timeBarWidth - 20, 55, timeBarWidth * timeRatio, 20);
  stroke(0);
  
  if (gameOver) {
    textAlign(CENTER);
    textSize(30);
    
    if (gameStatus === 'W') {
      fill(0, 128, 0);
      text("YOU WIN!", width/2, height/2 - 40);
    } else if (gameStatus === 'L') {
      fill(200, 0, 0);
      text("GAME OVER", width/2, height/2 - 40);
    }
    
    textSize(20);
    text("Final Score: " + score + "/" + winScore, width/2, height/2 + 30);
  }
}

function checkGameStatus() {
  if (!gameOver && frameCount % 30 === 0) {
    sendGameStatus('P');
  }
}

function sendGameStatus(status) {
  port.write(status);
}


class Character{
  constructor(xVal,yVal){
    this.x = xVal;
    this.y = yVal;
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

class Ball{
  constructor(xVal,yVal, speed, move){
    this.x = xVal;
    this.y = yVal;
    this.speed = speed;
    this.move = move;
  }
  draw(){
    push();
    translate(this.x,this.y)

    this.y += this.speed * this.move;
    if (this.y > 550){
      this.y = 15;
    }
    pop();
  }

  caught(){
    this.move() = 0;
    score ++;
    this.speed = 0;
    this.visible = 0;
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
    image(this.spritesheet,0,0,80,80,this.u*80,this.v*80,80,80);

    this.frameCount++;
    if (this.spritesheet === cup){
      if(this.frameCount % 8 === 0){
        this.u++;
      }
      if(this.u === this.startU + this.duration){
        this.u = this.startU;
      }
    }
  }
}

function caughtSound(){
  synth = new Tone.Synth({
    oscillator: { type: "triangle" },
    envelope: { attack: 0.01, decay: .2, sustain: 0, release: .01 }
  }).toDestination();

  noise = new Tone.Noise("white").start();
  noise.volume.value = -100;

  filter = new Tone.Filter(1200, "highpass").toDestination();
  noise.connect(filter);

  lfo = new Tone.LFO(8, 800, 1200);
  lfo.connect(filter.frequency);
  lfo.start();

  synth.triggerAttackRelease("C6", "8n");
}

async function startMusic() {
  await Tone.start();
  console.log("Audio started");

  synth = new Tone.Synth({
    oscillator: { type: 'triangle' },
    envelope: { attack: 0.1, decay: 0.2, sustain: 0.4, release: 1 }
  }).toDestination();

  synth.volume.value = -20;

  kick = new Tone.MembraneSynth().toDestination();
  kick.volume.value=-20;

  const melody = ['C4', 'E4', 'G4', 'C5', 'B4', 'A4', 'G4', 'E4'];

  melodyPart = new Tone.Sequence((time, note) => {
    synth.triggerAttackRelease(note, '8n', time);
  }, melody, '8n').start(0);

  drumPart = new Tone.Loop((time) => {
    kick.triggerAttackRelease('C2', '8n', time);
  }, '2n').start(0);

  Tone.Transport.bpm.value = 120;
  Tone.Transport.start();

  isPlaying = true;
}

function stopMusic() {
  melodyPart.stop();
  drumPart.stop();
  Tone.Transport.stop();

  isPlaying = false;
}
