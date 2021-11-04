// Title Variables
let the_img, last_img, of_img, us_img;
let theX, theY, lastX, lastY, ofX, ofY, usX, usY;
var titleSpeed = 4;
var showThe = false;
var showLast = false;
var showOf = false;
var showUs = false;

// Player Input Variables
var start = false;
let input, inputButton;
let inputText = 'Enter a word:';
const textArray = new Array(0);
let wordFont, music;
let speech;

class Word {
  constructor(word, x, y){
    this.word = word;
    this.x = x;
    this.y = y;
    this.xSpd = getRandomInt(-5,5);
    this.ySpd = getRandomInt(-5,5);
    this.fs = getRandomInt(20, 80);
    this.bbox = wordFont.textBounds(this.word, this.x, this.y, this.fs);
  }
  
  get word(){
    return this._word;
  }
  
  get x(){
    return this._x;
  }
  
  get y(){
    return this._y;
  }
  
  set word(value){
    this._word = value;
  }
  
  set x(value){
    this._x = value;
  }
  
  set y(value){
    this._y = value;
  }
  
  updateWord(){
    textFont(wordFont);
    textSize(this.fs);
    textAlign(CENTER, CENTER);
    
    this.bbox = wordFont.textBounds(this.word, this.x, this.y, this.fs);
    text(this.word, this.x, this.y);
    this.x += this.xSpd;
    this.y += this.ySpd;
    
    if (this.x > width || this.x < 0){
      this.xSpd = -this.xSpd;
    }
    if (this.y > height || this.y < 0){
      this.ySpd = -this.ySpd;
    }
  }
  
  leftClick(){
    if (mouseX > this.bbox.x && mouseX < (this.bbox.y + this.bbox.w) && mouseY > this.bbox.y && mouseY < (this.bbox.y + this.bbox.h)){
      speech.speak(this.word);
      this.randomX();
      this.randomY();
    }
  }
  
  rightClick(){
    if (mouseX > this.x && mouseX < this.x + this.msgWidth && mouseY > this.msgTop && mouseY < this.msgBot){
      this.remove();
    }
  }
  
  randomX(){
    this.xSpd = getRandomInt(-5, 5);
    this.xSpd = -this.xSpd;
  }
  
  randomY(){
    this.ySpd = getRandomInt(-5, 5);
    this.ySpd = -this.ySpd;
  }
}

function preload(){
  the_img = loadImage('the.png');
  last_img = loadImage('last.png');
  of_img = loadImage('of.png');
  us_img = loadImage('us.png');
  
  input = createInput();
  input.position(30, 550);
  input.hide();
  
  inputButton = createButton('Enter');
  inputButton.position(input.x + input.width + 5, input.y);
  inputButton.hide();
  inputButton.mousePressed(inputPressed);
  
  wordFont = loadFont('SubtleCurves.ttf');
  music = createAudio('BobBeat6.mp3');
}

function setup() {
  createCanvas(800, 600);
  
  setupTitle();
  setTimeout(showTitle, 1000);
  
  speech = new p5.Speech();
  music.volume(0.1)
  music.play();
}

function setupTitle(){
  theX = 180;
  theY = -150;
  lastX = -400;
  lastY = 176;
  ofX = 150;
  ofY = 700;
  usX = 850;
  usY = 650;
}

function showTitle(){
  showThe = true;
}

function draw() {
  background(220, 230, 255);
  
  handleWords();
  handleInput();
  handleTitle();
}

function handleTitle(){
  if (showThe){
    theY = theY + titleSpeed;
    image(the_img, theX, theY, 198, 128);
    if (theY >= 72){
      theY = 72;
      showThe = false;
      showLast = true;
      speech.setVoice('SpeechSynthesisVoice');
      speech.speak('the');
    }
  } else{
    image(the_img, theX, theY, 198, 128);
  }
  
  if (showLast){
    lastX = lastX + titleSpeed + 7;
    image(last_img, lastX, lastY, 248, 134);
    if (lastX >= 254){
      lastX = 254;
      showLast = false;
      showOf = true;
      speech.setVoice('SpeechSynthesisVoice');
      speech.speak('last');
    }
  } else{
    image(last_img, lastX, lastY, 248, 134);
  }
  
  if (showOf){
    if (ofX >= 390){
      ofX = 390;
    } else{
      ofX = ofX + titleSpeed;
    }
    
    if (ofY <= 290){
      ofY = 290;
    } else{
      ofY = ofY - titleSpeed;
    }
    image(of_img, ofX, ofY, 126, 122);
    
    if (ofX == 390 && ofY == 290){
      showOf = false;
      showUs = true;
      speech.setVoice('SpeechSynthesisVoice');
      speech.speak('of');
    }
  } else{
    image(of_img, ofX, ofY, 126, 122);
  }
  
  if (showUs){
    if (usX <= 469){
      usX = 469;
    } else{
      usX = usX - titleSpeed;
    }
    
    if (usY <= 399){
      usY = 399;
    } else{
      usY = usY - titleSpeed;
    }
    image(us_img, usX, usY, 144, 122);
    
    if (usX == 469 && usY == 399){
      showUs = false;
      start = true;
      speech.setVoice('SpeechSynthesisVoice');
      speech.speak('us');
    }
  } else{
    image(us_img, usX, usY, 144, 122);
  }
}

function handleInput(){
  if (start){
    rect(input.x - 10, input.y - 25, input.width + 75, input.height + 35);
    input.show();
    inputButton.show();
    textFont('Georgia');
    textAlign(LEFT, TOP);
    textSize(18);
    text(inputText, input.x, input.y - 20);
  }
}

function handleWords(){
  for (const w of textArray){
    w.updateWord();
  }
}

function inputPressed(){
  tempX = getRandomInt(1, 800);
  tempY = getRandomInt(1, 600);
  temp = new Word(input.value(), tempX, tempY);
  textArray.push(temp);
  speech.setVoice('SpeechSynthesisVoice');
  speech.speak(input.value());
}

function keyPressed(){
  if (keyCode === ENTER && start){
    inputPressed();
  }
}

function mouseClicked(){
  for (const w of textArray){
    if (mouseButton === LEFT){
      //print('left');
      w.leftClick();
    }
    if (mouseButton === RIGHT){
      //print('right');
      w.RightClick();
    }
  }
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

