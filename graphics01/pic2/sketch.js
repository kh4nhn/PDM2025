function setup() {
  createCanvas(400, 400);
  colorMode(HSB);
}

function draw() {
  background(220);
  noStroke();

  fill(10, 50, 100, 0.5);
  circle(200, 180,100);

  fill(120, 50, 100, 0.5);
  circle(240,250,100);

  fill(240, 50, 100, 0.5);
  circle(160,250,100);


}
