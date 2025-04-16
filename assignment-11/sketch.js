let port;
let connectButton;
let LEDbutton;
let ledState = false;

function setup() {
  createCanvas(400, 400);

  port = createSerial();
  connectButton = createButton("Connect to Arduino");
  connectButton.position(10, 400);
  connectButton.mousePressed(connectToSerial);
  
  LEDbutton = createButton("Toggle LED");
  LEDbutton.position(400,400);
  LEDbutton.mousePressed(toggleLED);
}

function draw() {
 background(255);
 fill(0,0,0);
 let str = port.read();
 let data = Number(str);
 ellipse(width/2, height/2, map(data, 0, 1023, 10,200));
}

function connectToSerial(){
  port.open('Arduino', 9600);
}

function toggleLED(){
  ledState = !ledState;
  let command = ledState ? '1' : '0';
  port.write(command);
}
