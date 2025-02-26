let samples, button1, button2, button3, button4, delTime, feedBack

let delay = new Tone.FeedbackDelay(0.5,0.5).toDestination()

function preload(){
  samples = new Tone.Players({
    dog: "media/dog.mp3",
    mouse: "media/mouseClick.mp3",
    horse: "media/horse.mp3",
    piano: "media/piano.mp3"
  }).connect(delay)
}

function setup() {
  createCanvas(400, 400);
  button1 = createButton("Click to play Dog Bark");
  button1.position(10, 30);
  button2 = createButton("Click to play Mouse Click");
  button2.position(10, 60);
  button3= createButton("Click to play Horse Neigh");
  button3.position(10, 90);
  button4 = createButton("Click to play Piano Tune");
  button4.position(10, 120);
  button1.mousePressed(() => {samples.player("dog").start()});
  button2.mousePressed(() => {samples.player("mouse").start()});
  button3.mousePressed(() => {samples.player("horse").start()});
  button4.mousePressed(() => {samples.player("piano").start()});

  delTime = createSlider(0, 1, 0, 0.01);
  delTime.position(10,170);
  delTime.input(() => {delay.delayTime.value = delTime.value()});
  feedBack = createSlider(0, 0.99, 0, 0.01);
  feedBack.position(10,220);
  feedBack.input(() => {delay.feedback.value = feedBack.value()});
}

function draw() {
  background(220);
  text("Delay Time: " + delTime.value(), 60, 160);
  text("Feedback: " + feedBack.value(), 60, 210);
}
