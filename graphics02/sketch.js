let brushColor;
let brushSize = 10;
let colors; 
paletteWidth = 50;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(255);
  brushColor = color(0);

  colors = [
    {name: 'red', color: color(255,0,0)},
    {name: 'blue', color: color(0,0,255)},
    {name: 'green', color: color(0,255,0)},
    {name: 'yellow', color: color(255,255,0)},
    {name: 'orange', color: color(255,165,0)},
    {name: 'purple', color: color(128,0,128)},
    {name: 'pink', color: color(255,192,203)},
    {name: 'black', color: color(0,0,0)},
    {name: 'white', color: color(255,255,255)}
  ]; 
  drawColorPalette();
}

function draw() {
  if(mouseIsPressed && mouseX > 100){
    stroke(brushColor);
    strokeWeight(brushSize);
    line(pmouseX,pmouseY,mouseX,mouseY);
  } 
}

function drawColorPalette(){
  for (let i=0; i < colors.length; i++){
    fill(colors[i].color);
    rect(10,i * 40 + 10, 30,30);
  }
}

function mousePressed (){
  for (let i=0; i < colors.length; i++){
    if (mouseX > 10 && mouseX < 40 && mouseY > i * 40 + 10 && mouseY < i * 40+40){
      brushColor = colors[i].color;
    }
  }
}