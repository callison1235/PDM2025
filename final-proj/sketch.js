let port;
let connectButton;
let zeroButton;
let xVal;
let speed = 0.03;

let cup;
let balls = [];
let remainingBalls = 50;
let score = 0;
let gameTime = 0;
let gameSpeed = 1;
let spawnCounter = 0; 
let gameOver = false;
let spawnRate = 0.8;
let gameStarted = false;

let synth, kick, melodyPart, drumPart, noise, filter, lfo, catchSound;
let isPlaying = false;

let lastFrameTime = 0;
const frameDelay = 16;

function setup() {
  createCanvas(600, 600);

  port = createSerial();
  connectButton = createButton("Connect to Arduino");
  connectButton.mousePressed(connectToSerial);

  zeroButton = createButton('Zero Joystick');
  zeroButton.mousePressed(zero);

  xVal = width/2;

  cup = new Cup();

  balls.push(new Ball());
  remainingBalls --;

  lastFrameTime = millis();
}

function connectToSerial(){
  port.open('Arduino', 9600);
}

function zero(){
  port.write('zero\n');
}

function draw() {
  let currentTime = millis();
  let elapsedTime = currentTime - lastFrameTime;

  let str = port.readUntil('\n');
  if (str != ""){
    const vals = str.split(',');
    if (vals.length == 3){
      let xInput = Number(vals[0]);

      xVal += xInput * speed;
      
      console.log("X Input: " + xVal);
    }
  }

  if(elapsedTime > frameDelay){
    background(240);
    if (!gameOver) {
      port.write('P\n');
      if(!isPlaying && !gameOver){
        startMusic();
      }
      if (gameStarted) {
        gameTime += elapsedTime / 1000;

        gameSpeed = 1 + (gameTime / 30)*3;
            
        if (gameTime >= 30 || (remainingBalls <= 0 && balls.length === 0)) {
          gameOver = true;
          stopMusic()
        }

        spawnCounter += elapsedTime / 1000 * 60;
        if (remainingBalls > 0 && spawnCounter >= 35) {
          balls.push(new Ball());
          remainingBalls--;
          spawnCounter = 0;
        }
      }     

      cup.update();
      cup.draw();
                      
      for (let i = balls.length - 1; i >= 0; i--) {
        let deltaMove = ((balls[i].baseSpeed * gameSpeed) * (elapsedTime / 1000 * 60));
        balls[i].update(deltaMove);
        balls[i].draw();

        if (cup.catches(balls[i])) {
          score++;
          if(!gameStarted){
            gameStarted = true;
            gameTime = 0;
            spawnCounter = 0;
          }
          catchSound.triggerAttackRelease("8n");
          balls.splice(i, 1);
          continue;
        }

        if (balls[i].y > height + balls[i].radius) {
          balls.splice(i, 1);
            
          if(!gameStarted && balls.length === 0){
            balls.push(new Ball());
          }
        }
      }
    }
  }
  drawUI();

  lastFrameTime = currentTime;
}

function drawUI() {
  fill(0);
  textSize(24);
  textAlign(LEFT);
  let timeLeft = Math.max(0,30 - gameTime);
  text(`Time: ${Math.max(0, timeLeft.toFixed(1))}s`, 20, 30);
  

  textAlign(RIGHT);
  text(`Score: ${score}/${35}`, width - 20, 30);
  

  textAlign(CENTER);
  text(`Balls Left: ${remainingBalls}`, width/2, 30);

  if (gameOver) {
    stopMusic();

    background(150);

    fill(0, 0, 0, 180);
    rect(0, 0, width, height);
      
    fill(255);
    textSize(48);
    textAlign(CENTER, CENTER);
    text("GAME OVER", width/2, height/2 - 50);
      
    textSize(32);
    text(`Final Score: ${score}/35`, width/2, height/2 + 20);

    if(score >= 35){
      port.write('W\n');
    }
    else{
      port.write('L\n');
    }
      
    textSize(24);
    text("Refresh to play again", width/2, height/2 + 80);
  }
}

class Cup {
  constructor() {
      this.width = 100;
      this.height = 70;
      this.y = height - 50;
      this.x = width/2 - this.width/2;
      
      console.log("Cup position:", this.y);
  }

  update(){
    this.x = xVal - this.width/2;
    this.x = constrain(this.x, 0, width - this.width);
  }
  
  draw() {
    push();
      

    fill(70, 130, 180);
    stroke(0);
    strokeWeight(2);
    rect(this.x, this.y, this.width, this.height);
      
    fill(100, 160, 210);
    rect(this.x - 10, this.y, this.width + 20, 15);
      
    pop();

    return this.x;
  }
  
  catches(ball) {
    return (
      ball.y >= this.y - ball.radius && 
      ball.y <= this.y + 30 &&
      ball.x >= this.x && 
      ball.x <= this.x + this.width
    );
  }
}

class Ball {
  constructor() {
      this.radius = random(15, 25);
      this.x = random(this.radius, width - this.radius);
      this.y = -this.radius;
      this.baseSpeed = random(2, 4);
      this.color = color(
          random(50, 255),
          random(50, 255),
          random(50, 255)
      );
  }
  
  update(delta) {
      this.y += delta;
  }
  
  draw() {
      fill(this.color);
      noStroke();
      circle(this.x, this.y, this.radius * 2);
  }
}

function startMusic() {
  if (typeof Tone !== 'undefined') {
    try {
      Tone.start();
      console.log("Audio started");

      synth = new Tone.Synth({
        oscillator: { type: 'triangle' },
        envelope: { attack: 0.1, decay: 0.2, sustain: 0.4, release: 1 }
      }).toDestination();

      synth.volume.value = -20;

      kick = new Tone.MembraneSynth().toDestination();
      kick.volume.value = -20;

      const melody = ['C4', 'E4', 'G4', 'C5', 'B4', 'A4', 'G4', 'E4'];

      melodyPart = new Tone.Sequence((time, note) => {
        synth.triggerAttackRelease(note, '8n', time);
      }, melody, '8n').start(0);

      drumPart = new Tone.Loop((time) => {
        kick.triggerAttackRelease('C2', '8n', time);
      }, '2n').start(0);

      catchSound = new Tone.NoiseSynth({
        noise: { type: "pink" },
        envelope: { attack: 0.01, decay: .2, sustain: 0, release: .01 }
      }).toDestination();

      catchSound.volume.value = -15;

      Tone.Transport.bpm.value = 120;
      Tone.Transport.start();

      isPlaying = true;
    } catch (e) {
      console.error("Error starting music:", e);
    }
  } else {
    console.error("Tone.js is not available");
  }
}

function stopMusic() {
  if(isPlaying &&typeof Tone !== 'undefined'){
    try{
      melodyPart.stop();
      drumPart.stop();
      Tone.Transport.stop();

      isPlaying = false;
    } catch(e){
      console.error("Error Stopping Music:", e);
    }
  }
}
