let startContext, samples, sampler, button1, button2, button3, button4, delTimeSlider, feedbackSlider, distSlider, wetSlider;

let rev = new Tone.Reverb(2.5).toDestination();
let dist = new Tone.Distortion(0.5).connect(rev);
let del = new Tone.FeedbackDelay(0, 0.2).connect(dist);
del.wet.value = 0.3;

function preload() {
  samples = new Tone.Players({
    cat: "media/cat.mp3",
    bruh: "media/bruh.mp3",
    haha: "media/haha.mp3",
    bell: "media/bell.mp3"
  }).connect(del);
}

function setup() {
  createCanvas(400, 400);
  startContext = createButton("Start Audio Context");
  startContext.position(0, 0);
  startContext.mousePressed(startAudioContext);

  button1 = createButton("Play Cat Sample");
  button1.position(10, 30);
  button1.mousePressed(() => { samples.player("cat").start(); });

  button2 = createButton("Play Bruh Sample");
  button2.position(200, 30);
  button2.mousePressed(() => { samples.player("bruh").start(); });

  button3 = createButton("Play Haha Sample");
  button3.position(10, 60);
  button3.mousePressed(() => { samples.player("haha").start(); });

  button4 = createButton("Play Bell Sample");
  button4.position(200, 60);
  button4.mousePressed(() => { samples.player("bell").start(); });

  distSlider = createSlider(0, 10, 0, 0.01);
  distSlider.position(10, 215);
  distSlider.input(() => { dist.distortion = distSlider.value(); });


}

function draw() {
  background(220);

  text("Distortion Amount: " + distSlider.value(), 15, 205);
 
}

function startAudioContext() {
  if (Tone.context.state !== 'running') {
    Tone.start();
    console.log("Audio Context Started");
  } else {
    console.log("Audio Context is already running");
  }
}
