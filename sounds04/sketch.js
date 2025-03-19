let bugs = [];
let squishedCount = 0;
let timer = 30;
let spriteSheet, squishedImage;
let frameSpeed = 10; 
let totalFrames = 2; 
let frameWidth = 64, frameHeight = 64; 
let spawnInterval = 300; 
let baseSpeed = 2;


let gameState = "start";
let gameOverTriggered = false;


let startSound, ingameSound, gameOverSound, deathSound, walkingSound;


let startButton;

function preload() {
  spriteSheet = loadImage('media/walking.png');
  squishedImage = loadImage('media/squished.png');
  
  
  startSound = loadSound('media/startMenu.mp3');
  ingameSound = loadSound('media/ingame.mp3');
  gameOverSound = loadSound('media/gameOver.mp3');
  deathSound = loadSound('media/death.mp3');
  walkingSound = loadSound('media/walking.mp3');
}

function setup() {
  createCanvas(800, 600);
  textFont('Arial');
  
  
  startButton = createButton('Start Game');
  startButton.position(width / 2 - 50, height / 2 + 40);
  startButton.mousePressed(startGame);
}

function draw() {
  if (gameState === "start") {
    drawStartMenu();
    return;
  }
  
  background(220);
  
  if (gameState === "playing") {
    
    for (let i = bugs.length - 1; i >= 0; i--) {
      bugs[i].update();
      bugs[i].display();
      
      if (bugs[i].isOffScreen()) {
        bugs.splice(i, 1);
      }
    }
    
    fill(0);
    textSize(24);
    textAlign(LEFT, TOP);
    text(`Squished: ${squishedCount}`, 10, 10);
    text(`Time: ${timer}`, 10, 40);
    
    
    let speedMultiplier = 1 + squishedCount * 0.01;
    ingameSound.rate(speedMultiplier);
    walkingSound.rate(speedMultiplier);
    
    if (timer <= 0) {
      gameState = "gameOver";
    }
  }
  
  if (gameState === "gameOver") {
    
    if (ingameSound.isPlaying()) ingameSound.stop();
    if (walkingSound.isPlaying()) walkingSound.stop();
    
    
    if (!gameOverTriggered) {
      gameOverSound.play();
      gameOverTriggered = true;
    }
    
    fill(255, 0, 0);
    textSize(32);
    textAlign(CENTER, CENTER);
    text("Game Over!", width / 2, height / 2);
  }
}

function drawStartMenu() {
  background(50);
  fill(255);
  textSize(32);
  textAlign(CENTER, CENTER);
  text("Welcome to Bug Squish!", width / 2, height / 2 - 40);
  text("Press 'Start Game' to begin", width / 2, height / 2);
}

function mousePressed() {
  
  if (gameState === "start" && !startSound.isPlaying()) {
    if (getAudioContext().state !== 'running') {
      userStartAudio();
    }
    startSound.loop();
  }
  
  
  if (gameState === "playing") {
    let bugSquished = false;
    
    for (let bug of bugs) {
      if (!bug.squished && bug.isClicked(mouseX, mouseY)) {
        bug.squish();
        squishedCount++;
        bugSquished = true;
        
        
        deathSound.play();
        
        
        for (let otherBug of bugs) {
          otherBug.speedUp();
        }
        
        
        bugs.push(new Bug(random(width), random(height)));
        
        if (spawnInterval > 500) {
          spawnInterval *= 0.9;
        }
      }
    }
    
  }
}

function startGame() {
  if (getAudioContext().state !== 'running') {
    userStartAudio();
  }
  
  startSound.stop();
  startButton.hide();
  
  gameState = "playing";
  ingameSound.loop();
  walkingSound.loop();
  
  for (let i = 0; i < 10; i++) {
    bugs.push(new Bug(random(width), random(height)));
  }
  
  setInterval(() => {
    if (gameState === "playing" && timer > 0) timer--;
  }, 1000);
  
  setInterval(() => {
    if (gameState === "playing" && timer > 0) {
      bugs.push(new Bug(random(width), random(height)));
    }
  }, spawnInterval);
}

class Bug {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.squished = false;
    this.speed = baseSpeed + squishedCount * 0.2;
    this.dir = p5.Vector.fromAngle(random(TWO_PI));
    this.angle = this.dir.heading();
    this.frameIndex = 0;
    this.frameCounter = 0;
  }
  
  update() {
    if (!this.squished) {
      this.x += this.dir.x * this.speed;
      this.y += this.dir.y * this.speed;
      
      this.frameCounter++;
      if (this.frameCounter >= frameSpeed) {
        this.frameIndex = (this.frameIndex + 1) % totalFrames;
        this.frameCounter = 0;
      }
    }
  }
  
  display() {
    push();
    translate(this.x, this.y);
    rotate(this.angle + PI / 2);
    if (this.squished) {
      image(squishedImage, -frameWidth / 2, -frameHeight / 2, frameWidth, frameHeight);
    } else {
      image(spriteSheet, -frameWidth / 2, -frameHeight / 2, frameWidth, frameHeight, 
            this.frameIndex * frameWidth, 0, frameWidth, frameHeight);
    }
    pop();
  }
  
  isClicked(mx, my) {
    return dist(mx, my, this.x, this.y) < frameWidth / 2;
  }
  
  squish() {
    this.squished = true;
  }
  
  speedUp() {
    this.speed += 0.2;
  }
  
  isOffScreen() {
    return this.x < -frameWidth || this.x > width + frameWidth || 
           this.y < -frameHeight || this.y > height + frameHeight;
  }
}
