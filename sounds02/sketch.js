let synth1, filt, rev, polySynth;
let activeKey = null;
let keyNotes = { 'a': 'A4', 's': 'B4', 'd': 'C5', 'f': 'D5' };
let keyNotes1 = { 'q': 'D4', 'w': 'F4', 'e': 'A4' };
let filterSlider;

function setup() {
  createCanvas(600, 300);
  filt = new Tone.Filter(1500, "lowpass").toDestination();
  rev = new Tone.Reverb(2).connect(filt);
  synth1 = new Tone.Synth({
    envelope: { attack: 0.1, decay: 0.2, sustain: 0.9, release: 0.3 }
  }).connect(rev);
  polySynth = new Tone.PolySynth(Tone.Synth).connect(rev);
  polySynth.set({
    envelope: { attack: 0.1, decay: 0.1, sustain: 1, release: 0.1 },
    oscillator: { type: 'sawtooth' }
  });
  polySynth.volume.value = -6;
  
  filterSlider = createSlider(200, 5000, 1500, 1);
  filterSlider.position(20, height - 30);
  filterSlider.style('width', '200px');
}

function draw() {
  background(220);
  drawKeyboard();
  filt.frequency.value = filterSlider.value();
  text("Adjust Filter Frequency", 20, height - 40);
}

function drawKeyboard() {
  let keys = ['a', 's', 'd', 'f', 'q', 'w', 'e'];
  let keyWidth = width / keys.length;
  for (let i = 0; i < keys.length; i++) {
    fill(activeKey === keys[i] ? 'blue' : 'white');
    rect(i * keyWidth, height / 2, keyWidth - 2, 80, 5);
    fill(0);
    textAlign(CENTER, CENTER);
    text(keys[i].toUpperCase(), i * keyWidth + keyWidth / 2, height / 2 + 40);
  }
}

function keyPressed() {
  let pitch = keyNotes[key];
  let pitch1 = keyNotes1[key];
  if (pitch && key !== activeKey) {
    synth1.triggerRelease();
    activeKey = key;
    synth1.triggerAttack(pitch);
  } else if (pitch1) {
    activeKey = key;
    polySynth.triggerAttack(pitch1);
  }
}

function keyReleased() {
  let pitch1 = keyNotes1[key];
  if (key === activeKey) {
    synth1.triggerRelease();
    polySynth.triggerRelease(pitch1);
    activeKey = null;
  }
}