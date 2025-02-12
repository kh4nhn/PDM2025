let characters = [];
let spriteSheets = [];
let frameCounts = 6; 

function preload() {
  spriteSheets.push(loadImage('SpelunkyGuy.png'));
  spriteSheets.push(loadImage('Green.png'));
}

function setup() {
  createCanvas(800, 400);
  let x1 = random(width / 2);
  let y1 = height - 100;
  let x2 = random(width / 2, width);
  let y2 = height - 100;
  characters.push(new Character(x1, y1, spriteSheets[0])); 
  characters.push(new Character(x2, y2, spriteSheets[1])); 
}

function draw() {
  background(220);
  for (let character of characters) {
    character.update();
    character.display();
  }
}

class Character {
  constructor(x, y, spriteSheet) {
    this.x = x;
    this.y = y;
    this.spriteSheet = spriteSheet;
    this.frame = 0;
    this.direction = 1; 
    this.speed = 2;
  }

  update() {
    if (keyIsDown(LEFT_ARROW)) {
      this.x -= this.speed;
      this.direction = -1;
      this.frame = (this.frame + 0.1) % frameCounts;
    } else if (keyIsDown(RIGHT_ARROW)) {
      this.x += this.speed;
      this.direction = 1;
      this.frame = (this.frame + 0.1) % frameCounts;
    } else if (keyIsDown(UP_ARROW)) {
      this.y -= this.speed;
      this.frame = (this.frame + 0.1) % frameCounts;
    } else if (keyIsDown(DOWN_ARROW)) {
      this.y += this.speed;
      this.frame = (this.frame + 0.1) % frameCounts;
    } else {
      this.frame = 0;
    }
  }

  display() {
    let frameX = int(this.frame) * 80;
    let img = this.spriteSheet.get(frameX, 0, 80, 80);
    push();
    translate(this.x, this.y);
    scale(this.direction, 1);
    image(img, this.direction === -1 ? -40 : 0, -40);
    pop();
  }
}
