let synth;
let filter;
let filterFreq = 1000;
let bassFilter;
let bassFreq = 200;
let filterSlider;
let bassSlider;

function setup() {
  createCanvas(400, 250);
  synth = new p5.PolySynth();
  
  
  filter = new p5.Filter('lowpass');
  filter.freq(filterFreq);
  filter.res(5);
  
  bassFilter = new p5.Filter('lowpass');
  bassFilter.freq(bassFreq);
  bassFilter.res(5);
  
  
  synth.disconnect();  
  synth.connect(filter);
  filter.connect(bassFilter);
  bassFilter.connect(); 
  
  
  filterSlider = createSlider(200, 5000, filterFreq);
  filterSlider.position(100, 180);
  filterSlider.style('width', '200px');
  
  bassSlider = createSlider(50, 500, bassFreq);
  bassSlider.position(100, 210);
  bassSlider.style('width', '200px');
}

function draw() {
  background(220);
  textAlign(CENTER, CENTER);
  textSize(16);
  text('Press A - K to play notes', width / 2, height / 3);
  text('Filter Frequency: ' + filterFreq + ' Hz', width / 2, height / 2);
  text('Bass Filter Frequency: ' + bassFreq + ' Hz', width / 2, height / 2 + 30);
  
  // Update filter frequencies
  filterFreq = filterSlider.value();
  bassFreq = bassSlider.value();
  filter.freq(filterFreq);
  bassFilter.freq(bassFreq);
}

let keyMap = {
  'A': 'C4',
  'S': 'D4',
  'D': 'E4',
  'F': 'F4',
  'G': 'G4',
  'H': 'A4',
  'J': 'B4',
  'K': 'C5'
};

function keyPressed() {
  let note = keyMap[key.toUpperCase()];
  if (note) {
    synth.play(note, 0.5, 0, 0.5);
  }
}

function keyReleased() {
  let note = keyMap[key.toUpperCase()];
  if (note) {
    synth.noteRelease(note);
  }
}

