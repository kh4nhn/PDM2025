function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(0,0,200,255);
  
  fill(255,255,255,255);
  noStroke();
  circle(200,200,220);

  fill(0,150,0,255);
  noStroke();
  circle(200,200,200);


  fill(255,0,0,255);
  beginShape;
  stroke('white');
  strokeWeight(5);
  vertex(330,183);
  vertex(250,180);
  vertex(220,95);
  vertex(180,180);
  vertex(100,180);
  vertex(165,235);
  vertex(140,305);
  vertex(215,265);
  vertex(290,305);
  vertex(265,235);
  endShape(CLOSE);

  
  

  

}
