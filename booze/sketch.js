let port, connectButton;

let startImg, overImg, roadImg, playerImg;
let crashSnd, roadSnd, revSnd, startMus, loserSnd;
let enemyImgs = [];

let gameState       = 'start';
let startDelayStart = 0;
const START_DELAY   = 3000;

// player
const playerW = 50, playerH = 100;
let playerX, playerY;

//joysticks sens
const JOY_SENS = 0.02;
let joystickX  = 0;

// speed and difficulty
let speedLevel  = 1;
const BASE_SPAWN = 120;
let spawnTimer  = BASE_SPAWN;
let timer       = 0;


let roadOffset = 0;


const ROAD_MARGIN = 60;
let roadLeft, roadRight, laneWidth;

let loserPlayed = false;

function preload() {
  startImg   = loadImage('media/start.png');
  overImg    = loadImage('media/over.png');
  roadImg    = loadImage('media/road.png');
  playerImg  = loadImage('media/player.png');
  crashSnd   = loadSound('media/crash.wav');
  roadSnd    = loadSound('media/road.mp3');
  revSnd     = loadSound('media/rev.wav');
  startMus   = loadSound('media/startMus.wav');
  loserSnd   = loadSound('media/loser.wav');
  for (let i = 1; i <= 6; i++) {
    enemyImgs.push(loadImage(`media/car${i}.png`));
  }
}

function setup() {
  const cnv = createCanvas(400, 600);
  textFont('Arial');
  imageMode(CORNER);
  rectMode(CENTER);

  cnv.mousePressed(handleCanvasClick);

  roadLeft   = ROAD_MARGIN;
  roadRight  = width - ROAD_MARGIN;
  laneWidth  = (roadRight - roadLeft) / 3;

  port = createSerial();
  connectButton = createButton('Connect Arduino');
  connectButton.position(10, height - 30);
  connectButton.mousePressed(() => port.open('Arduino', 9600));

  resetGame();
}

function resetGame() {
  enemies       = [];
  playerX       = width/2 - playerW/2;
  playerY       = height - playerH - 20;
  spawnTimer    = BASE_SPAWN;
  roadOffset    = 0;
  timer         = 0;
  speedLevel    = 1;
  gameState     = 'start';
  loserPlayed   = false;
}

function draw() {
  background(0);
  drainSerial();

  if (gameState === 'start') {
    if (!startMus.isPlaying()) startMus.loop();
    roadSnd.stop();
    image(startImg, 0, 0, width, height);

  } else {
    if (startMus.isPlaying()) startMus.stop();

    if (gameState === 'delay') {
      image(roadImg, 0, 0, width, height);
      image(playerImg, playerX, playerY, playerW, playerH);
      fill(0, 150);
      rect(width/2, height/2, width, height);
      let elapsed = millis() - startDelayStart;
      let rem     = max(0, ceil((START_DELAY - elapsed) / 1000));
      textSize(64);
      fill(255);
      textAlign(CENTER, CENTER);
      text(rem, width/2, height/2);
      if (elapsed >= START_DELAY) {
        gameState = 'play';
        roadSnd.loop();
      }

    } else if (gameState === 'play') {
      timer += (deltaTime / 1000) * speedLevel;

      //increase difficulty
      let difficulty = 1 + Math.floor(timer / 10) * 0.1;

      //moving
      roadOffset = (roadOffset + (2 + speedLevel) * 2 * difficulty) % height;
      image(roadImg, 0, roadOffset - height, width, height);
      image(roadImg, 0, roadOffset, width, height);

      //start
      if (--spawnTimer <= 0) {
        spawnTimer = BASE_SPAWN / (speedLevel * difficulty);
        let lane = floor(random(3));
        let ex   = roadLeft + lane * laneWidth + (laneWidth - playerW) / 2;
        enemies.push({ x: ex, y: -120, img: random(enemyImgs) });
      }

      //cars
      for (let e of enemies) {
        e.y += (3 + speedLevel) * 2 * difficulty;
        push();
          translate(e.x + playerW/2, e.y + playerH/2);
          rotate(PI);
          image(e.img, -playerW/2, -playerH/2, playerW, playerH);
        pop();
      }
      enemies = enemies.filter(e => e.y < height + 100);

      // player control
      playerX = constrain(
        playerX + joystickX * JOY_SENS,
        roadLeft,
        roadRight - playerW
      );
      image(playerImg, playerX, playerY, playerW, playerH);

      // collision
      for (let e of enemies) {
        if (
          playerX < e.x + playerW &&
          playerX + playerW > e.x &&
          playerY < e.y + playerH &&
          playerY + playerH > e.y
        ) {
          crashSnd.play();
          port.write('crash\n');
          gameState = 'over';
        }
      }

      // hud
      textSize(18);
      textStyle(BOLD);
      textAlign(RIGHT, TOP);
      stroke(0);
      strokeWeight(3);
      fill(255);
      text(`${floor(timer)}s`, width - 10, 10);
      text(`Speed ${speedLevel}`, width - 10, 35);
      noStroke();
      textStyle(NORMAL);

    } else if (gameState === 'over') {
      if (!loserPlayed) {
        loserSnd.play();
        loserPlayed = true;
      }
      roadSnd.stop();
      image(overImg, 0, 0, width, height);

      textSize(20);
      textStyle(BOLD);
      textAlign(CENTER, TOP);
      stroke(0);
      strokeWeight(3);
      fill(255);
      text(`Your Time: ${floor(timer)}s`, width/2, height * 0.9);
      noStroke();
      textStyle(NORMAL);
    }
  }
}

function handleCanvasClick() {
  if (gameState === 'start' || gameState === 'over') {
    port.write('retry\n');
    resetGame();
    gameState = 'delay';
    startDelayStart = millis();
  }
}

function drainSerial() {
  let str;
  while ((str = port.readUntil('\n'))) {
    let [xStr, lvlStr] = str.trim().split(',');
    if (lvlStr !== undefined) {
      let lvl = Number(lvlStr);
      if (lvl !== speedLevel) revSnd.play();
      speedLevel = lvl;
    }
    joystickX = Number(xStr);
  }
}
