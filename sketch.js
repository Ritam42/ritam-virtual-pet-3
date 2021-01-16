//Create variables here
var dog, happyDog, database, foodS, foodStock, dogImg;
var feedDog, addFood, fedTime, lastFed, foodObj;
var changeState, readState;
var bedroom, garden, washroom, sadDog;

function preload()
{
  //load images here
  dogImg = loadImage("images/dogImg.png");
  happyDog = loadImage("images/dogImg1.png");
  bedroom = loadImage("image/Bed Room.png");
  garden = loadImage("image/Garden.png");
  washroom = loadImage("image/Wash Room.png");
  sadDog = loadImage("image/Lazy.png");
}

function setup() {

  feed = createButton("Feed the dog");
  feed.position(450, 70);
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(550, 70);
  addFood.mousePressed(addFoods);

  readState = database.ref('gameState');
  readState.on("value", function(data){
    gameState = data.val();
  });

  createCanvas(570, 500);
  
  dog = createSprite(300, 370, 20, 20);
  dog.addImage(dogImg);
  dog.scale = 0.2;

  database = firebase.database();

  foodStock = database.ref('Food');
  foodStock.on("value", readStock);

  foodObj = new Food();
  
}

function draw() {  

 background("green"); 

 fedTime = database.ref('FeedTime');
 fedTime.on("value", function(data){
   lastFed = data.val();
 });
  
 fill (255, 255, 254);
 textSize(15);
 if(lastFed>=12){
 ("Last Feed : "+ lastFed%12 + "PM", 350, 30);
 }
 else if(lastFed==0){
 ("Last Feed : 12 AM", 350, 30);
 }
 else{
   text ("Last Feed : "+ lastFed + "AM", 350, 30);
 }

 currentTime = hour();
 if(currentTime == (lastFed + 1)){
   update("Playing");
   foodObj.garden();
 }else if(currentTime == (lastFed + 2)){
   update("sleeping");
   foodObj.bedroom();
 }else if(currentTime>(lastFed + 2) && currentTime<=(lastFed+4)){
   update("Bathing");
 }else{
   update("Hungry")
   foodObj.display();
 }
 
 if(gameState!= "Hungry"){
   feed.hide();
   addFood.hide();
   dog.remove();
 }else{
   feed.show();
   addFood.show();
   dog.addImage(sadDog);
 }

 drawSprites();
 
}

function readStock(data){
  foodS = data.val();
}

function writeStock(x){

  if(x<=0){
    x=0;
  }else{
    x=x-1;
  }

  database.ref('/').update({
    Food:x
  })
}

function feedDog(){
  dog.addImage(happyDog);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
  Food:foodObj.getFoodStock(),
  FeedTime:hour()
  })
}

function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}

function update(state){
  database.ref('/').update({
    gameState:state
  });
}