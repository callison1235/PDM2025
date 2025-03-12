let blockImg, coinImg;
let isCoin = false;
let synth, noise, filter, lfo;

function preload() {
  blockImg = loadImage('media/block.png');
  coinImg = loadImage('media/coin.png');
}

function setup() {
  createCanvas(400, 400);

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
}

function draw() {
  background(220);
  textAlign(CENTER, CENTER);
  textSize(16);
  text("Click the Block!", width / 2, 30);

  let img = isCoin ? coinImg : blockImg;
  image(img, width / 2 - 50, height / 2 - 50, 100, 100);
}

function mousePressed() {
  if (!isCoin) {
    isCoin = true;

    synth.triggerAttackRelease("C6", "8n");
    
    let noiseEnv = new Tone.AmplitudeEnvelope({
      attack: 0.01,
      decay: 0.1,
      sustain: 0,
      release: 0.05
    }).toDestination();

    noise.connect(noiseEnv);
    noiseEnv.triggerAttackRelease("8n");
    switchBackTimer = setTimeout(() => {
      isCoin = false;
    }, 1000);
  }
}
