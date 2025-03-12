let closedDoor, noDoor;
let doorState = "closed";
let noiseSynth, osc, filter, fmOsc;
let resetTimer;

function preload() {
  closedDoor = loadImage('door.png');  
  noDoor = loadImage('no.png');    
}

function setup() {
  createCanvas(400, 400);
  imageMode(CENTER);

  filter = new Tone.Filter({
    frequency: 1200,
    type: "lowpass",
    Q: 5
  }).toDestination();

  noiseSynth = new Tone.NoiseSynth({
    noise: { type: "white" },
    envelope: { attack: 0.005, decay: 0.2, sustain: 0, release: 0.1 }
  }).connect(filter);

  osc = new Tone.Oscillator({
    type: "sine",
    frequency: 80,
    volume: -10
  }).connect(filter);

  fmOsc = new Tone.FMOscillator({
    frequency: 100,
    type: "square",
    modulationType: "sawtooth",
    harmonicity: 2,
    modulationIndex: 10
  }).connect(filter);
}

function draw() {
  background(220);
  
  if (doorState === "closed") {
    image(closedDoor, width / 2, height / 2, 220, 220);
  } else {
    image(noDoor, width / 2, height / 2, 220, 220);
  }
}

function mousePressed() {
  let d = dist(mouseX, mouseY, width / 2, height / 2);
  if (doorState === "closed" && d < 110) { 
    doorState = "open";  

    noiseSynth.triggerAttackRelease("8n");

    fmOsc.start();
    fmOsc.stop("+0.15");

    osc.start();
    osc.frequency.setValueAtTime(80, Tone.now());
    osc.frequency.exponentialRampToValueAtTime(40, Tone.now() + 0.2);
    osc.stop("+0.2");

   
    clearTimeout(resetTimer);
    resetTimer = setTimeout(() => {
      doorState = "closed";
    }, 3000);
  }
}
