function setup() {
  createCanvas(400, 1000);
}

function draw() {
  //ex 1
  noStroke();
  fill(119,242,59);
  rect(0,0,400,200);
  stroke('black');
  fill('white');
  circle(100,100,170);
  square(220,20,160);

  //ex 2
  noStroke();
  fill(255,170,169,70);
  circle(200,275,100);
  fill(170,168,255,70);
  circle(165,320,100);
  fill(167,255,167,70);
  circle(235,320,100);

  //ex 3
  fill('black');
  rect(0,400,400,200);
  fill('yellow');
  circle(100,500,170);
  fill('black')
  triangle(0,425,0,575,100,500);
  fill('red');
  rect(220,500,160,82);
  arc(300,500,160,160,0,TWO_PI);
  fill('white');
  circle(260,500,50);
  circle(340,500,50);
  fill('blue');
  circle(260,500,30);
  circle(340,500,30);

  //ex 4
  fill('blue')
  square(0,600,400);
  strokeWeight(4);
  stroke('white',);
  fill('green');
  circle(200,800,200);
  fill('red');
  star(200,800,5,100,40);
}
function star(x,y,n,r1,r2){
  let theta = TAU / n;
  beginShape();
  for (let i=0; i<n; i++){
    vertex(x+cos((i-.25)*theta) * r1, y+ sin((i-.25)*theta)*r1);
    vertex(x+cos((i+.25)*theta)*r2,y+sin((i+.25)*theta)*r2);
  }
  endShape(CLOSE);
}