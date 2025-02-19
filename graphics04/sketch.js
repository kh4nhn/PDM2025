let bugs = [];
let squishedCount = 0;
let timer = 30;
let spriteSheet, squishedImage;
let frameSpeed = 10; 
let totalFrames = 2; 
let frameWidth = 64, frameHeight = 64; 
let spawnInterval = 300; 
let baseSpeed = 2; 

function preload() {
    spriteSheet = loadImage('media/walking.png');
    squishedImage = loadImage('media/squished.png');
}

function setup() {
    createCanvas(800, 600);
    for (let i = 0; i < 10; i++) { 
        bugs.push(new Bug(random(width), random(height)));
    }

    setInterval(() => {
        if (timer > 0) timer--;
    }, 1000);

    
    setInterval(() => {
        if (timer > 0) {
            bugs.push(new Bug(random(width), random(height)));
        }
    }, spawnInterval);
}

function draw() {
    background(220);
    
    for (let i = bugs.length - 1; i >= 0; i--) {
        bugs[i].update();
        bugs[i].display();

        
        if (bugs[i].isOffScreen()) {
            bugs.splice(i, 1);
        }
    }
    
    fill(0);
    textSize(24);
    text(`Squished: ${squishedCount}`, 10, 30);
    text(`Time: ${timer}`, 10, 60);
    
    if (timer <= 0) {
        noLoop();
        textSize(32);
        fill(255,0,0)
        text("Game Over!", width / 2 - 80, height / 2);
    }
}

function mousePressed() {
    for (let bug of bugs) {
        if (!bug.squished && bug.isClicked(mouseX, mouseY)) {
            bug.squish();
            squishedCount++;
            
            
            for (let otherBug of bugs) {
                otherBug.speedUp();
            }

            
            bugs.push(new Bug(random(width), random(height)));

            // Gradually speed up bug spawning
            if (spawnInterval > 500) {
                spawnInterval *= 0.9; 
            }
        }
    }
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