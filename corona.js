var can= document.getElementById("can").getContext("2d");
can.font = "30px Arial";
can.fillStyle = 'black';
var frameCount =0;
var WIDTH=800;
var HEIGHT=600;
var starttime= Date.now();
var score = 0;
var Vk = 0;
var bulletSpray = 0;

GameOver = false; 
Rp=false;

var up = false;
var down = false;
var left = false;
var right = false;

var upm = false;
var downm = false;
var leftm = false;
var rightm = false;

var ts =0;

var Img= {};

Img.player = new Image();
Img.player.src = "IMG/player.png";

Img.enemy = new Image();
Img.enemy.src = "IMG/corona.png";

Img.upgrade1 = new Image();
Img.upgrade1.src = "IMG/sanitizer.png";

Img.upgrade2 = new Image();
Img.upgrade2.src = "IMG/Vaccine.png";

Img.bullet = new Image();
Img.bullet.src = "IMG/spray.png";

Img.generate = new Image();
Img.generate.src = "IMG/sick.png";


hp= new Audio("Audio/hp.wav");
Gos= new Audio("Audio/Go.wav");
enemyCol= new Audio("Audio/enemyCol.mp3");
walk= new Audio("Audio/walk2.wav");


var player ={
x:500,
y:500,
spdX:2,
spdY:50,
name:"P",
hp:20,
width:80,
height:100,
img:Img.player,
aimAngle:0,
MovingCounter:0,

pressigRight : false,
pressigLeft : false,
pressigUp : false,
pressigDown : false,
};

var GenrateList = {};
var enemyList = {};
var upgradeList = {};
var bulletList = {};


Generate = function(name,x,y){
var generator = {
x:x,
y:y,
name:name,
width:150,
height:170,
spdX:0,
spdY:0,
img:Img.generate,
aimAngle:0,
};
GenrateList[name]=generator;
}

Enemy= function(name,x,y,spdX,spdY,width,height,aimAngle) {
var enemy={
x:x,
y:y,
spdX:spdX,
spdY:spdY,
name:name,
width:width,
height:height,
img:Img.enemy,
aimAngle:aimAngle,
};
enemyList[name]=enemy;
}

Upgrade= function(name,x,y,category,img) {
var upgrade={
x:x,
y:y,
spdX:0,
spdY:0,
name:name,
width:30,
height:40,
img:img,
category:category,
};
upgradeList[name]=upgrade;
}

bullet= function(name,x,y,spdX,spdY,width,height,category) {
var bullet={
x:x,
y:y,
spdX:spdX,
spdY:spdY,
name:name,
width:width,
height:height,
img:Img.bullet,
timer:0,
category:category,
};
bulletList[name]=bullet;
}

getDistance = function(entity1, entity2){
var vx = entity1.x-entity2.x;
var vy = entity1.y-entity2.y;
return Math.sqrt(vx*vx+vy*vy)
}

collidesornot = function(entity1,entity2){
   var rect1= {
        x:entity1.x-entity1.width/2,
        y:entity1.y-entity1.height/2,
        width:entity1.width,
        height:entity1.height,
	}
	var rect2= {
	    x:entity2.x-entity2.width/2,
        y:entity2.y-entity2.height/2,
        width:entity2.width,
        height:entity2.height,
	}
	return testCollisionRect(rect1,rect2);
}

testCollisionRect = function(rect1,rect2){
   return rect1.x <= rect2.x+rect2.width
         && rect2.x <= rect1.x+rect1.width
         && rect1.y <= rect2.y+rect2.height
         && rect2.y <= rect1.y+rect1.height;
}


UpdateEnemy = function(){
  for (var i in GenrateList){
    randomlyGenerateEnemy(GenrateList[i].x,GenrateList[i].y);
  }

}


Movement= function(x){   
  if (x=="Up"){
    
	upm = true;
    downm = false;
    leftm = false;
    rightm = false;
	
	up = true;
	down = false;
	left = false;
	right = false;
  }
  
  if (x=="Down"){
  
    upm = false;
    downm = true;
    leftm = false;
    rightm = false;

    down = true;
	up = false;
	left = false;
	right = false;
  }
  
  if (x=="Left"){
	
	upm = false;
    downm = false;
    leftm = true;
    rightm = false;

    left = true;
	up = false;
	down = false;
	right = false;
  }
  
   if (x=="Right"){
	
	upm = false;
    downm = false;
    leftm = false;
    rightm = true;

	right = true;
	up = false;
	down = false;
	left = false;
  }
  
  if(x=="attack1"){ 
  
    if (bulletSpray > 0){
       for (var angle =0; angle<360; angle++){
	      randomlyGenerateBullet(player,angle,'A'); 
        }
	    bulletSpray--;
     }
	} 
  
  
  if (x=="Play"){
    location.reload();
  }
  

}

document.onkeydown = function(event){
   if (event.keyCode ===68){
       player.pressigRight =true;
	   right = true;}
    else if (event.keyCode ===83){
       player.pressigDown =true;
	   down = true;}
	else if (event.keyCode ===65){
       player.pressigLeft =true;
	   left = true;}
	else if (event.keyCode ===87){
	   up = true;
       player.pressigUp =true;}
	   
	else if (GameOver == true &&event.keyCode ===32){
       Rp = false;}
} 

document.onkeyup = function(event){
   if (event.keyCode ===68){
       player.pressigRight =false;
	   right = false;}
    else if (event.keyCode ===83){
       player.pressigDown =false;
	   down = false;}
	else if (event.keyCode ===65){
       player.pressigLeft =false;
	   left = false;}
	else if (event.keyCode ===87){
       player.pressigUp =false;
	   up = false;}
} 

updatePlayerPosition = function() {
    if (player.pressigRight)
      player.x +=10;
	if (player.pressigLeft)
      player.x -=10;
	if (player.pressigDown)
      player.y +=10;
	if (player.pressigUp)
      player.y -=10;
	  
	if (rightm == true)
        player.x +=10;
	if (leftm == true)
        player.x -=10;
	if (downm == true)
        player.y +=10;
	if (upm == true)
        player.y -=10;
	
	  
	if (player.x < player.width/2)
       player.x=player.width;
    if (player.x > currentMap.width-player.width/2 ) 
       player.x= currentMap.width -player.width/2;
    if (player.y < player.height/2)
	    player.y = player.height/2;
    if (player.y > currentMap.height-player.height/2) 
        player.y = currentMap.height-player.width/2;
		
	if (player.pressigDown || player.pressigLeft || player.pressigRight || player.pressigUp ){
		  player.MovingCounter+=0.5;
		  walk.play();
	}
	 
	if (rightm || leftm || downm || upm ){
        player.MovingCounter+=0.5;
		walk.play();
    }
}

updateEntity = function(something){
updateSomething(something);
drawEntity(something);
}

updateSomething=function(something){
    something.x += something.spdX;
	something.y += something.spdY;	
	if (something.x<0 || something.x>currentMap.width){
	   something.spdX = -something.spdX;
	}
	if (something.y<0 || something.y>currentMap.height){
	   something.spdY =-something.spdY;
	}
} 



drawEntity = function(something){
 can.save();

 var x = something.x - player.x;
 var y = something.y - player.y;

 x+= WIDTH/2
 y+= HEIGHT/2

 x -= something.width/2;
 y -= something.height/2;

 can.drawImage(something.img,0,0,something.img.width,something.img.height,x,y,something.width,something.height); 
 can.restore();
}

drawEntityPlayer = function(entity){
    can.save();
     
    var x = entity.x - player.x;	 
    var y  = entity.y - player.y;
	
	x += WIDTH/2;
	y += HEIGHT/2;
	
	x -= entity.width/2;
	y -= entity.height/2;
	
	var frameWidth = entity.img.width/5;
	var frameHeight = entity.img.height/4;
	
	
	var directionMod =0;
	
	if (right==true)
	    directionMod = 1;
	else if (left==true)
	    directionMod = 2;
    else if (up==true)
	    directionMod =3;
    else if (down==true)
	    directionMod =0;
		
		
	var movingMod = Math.floor(entity.MovingCounter) %5;
	
	can.drawImage(entity.img,
	    movingMod*frameWidth,directionMod*frameHeight,frameWidth, frameHeight,
		x,y, entity.width,entity.height
	);
	can.restore();
}




document.oncontextmenu = function(mouse) {  
    if (bulletSpray >= 1){
       for (var angle =0; angle<360; angle++){
	     randomlyGenerateBullet(player,angle,'A'); 
	    }
	  
       bulletSpray--;
    }
 	mouse.preventDefault();
}

update = function(){
  if (GameOver == true){
	can.fillStyle = 'red';
	can.fillRect(100,100,600,380);
	can.fillStyle = 'white';
    can.font = "80px Arial";
    can.fillText('Game Over',200, 200);
	can.font = "40px Arial";
    can.fillText('Score: '+score,340,250);
    can.fillText('Vaccine: '+bulletSpray,320, 300);
	can.fillText("People Cured: " +Vk,300,350);
	can.font = "20px Arial";
	can.fillText('Survival Time: '+ts+' sec',330,450);
	can.fillText("Press space to play again or click Re-load",230,400);

	
    if (Rp){
	 return;
	}
	else{
	 GameOver = false;
     startNewGame();
	}
  }
  
  can.clearRect(0,0,WIDTH,HEIGHT);
  currentMap.draw();
  frameCount++;

  if (frameCount%250 == 0){randomlyGenerateGenarator();}
  if (frameCount%125 == 0){UpdateEnemy();}
  if (frameCount%150 == 0){randomlyGenerateUpgrade();}
  
   for (var i in bulletList) {
      updateEntity(bulletList[i]);
	  
	  bulletList[i].timer++;
	  
	  if (bulletList[i].timer>50){
	     delete bulletList[i];
		 continue;
	  }
	  
	  for (var k in GenrateList) {
	    var iscolliding= collidesornot(bulletList[i],GenrateList[k]);
	    if (iscolliding && bulletList[i].category == 'A'){
		  delete GenrateList[k];
		  Vk++;
		  break;
	    }
      }
	  
	  for (var j in enemyList) {
	  	var iscolliding= collidesornot(bulletList[i],enemyList[j]);
	    if (iscolliding){
		  delete bulletList[i];
		  delete enemyList[j];
		  break;
	    }
      }
	}
	
	for (var i in upgradeList) {
       updateEntity (upgradeList[i]);
	   
	   var iscolliding= collidesornot(player,upgradeList[i]);
	    if (iscolliding){
		    if (upgradeList[i].category === "sanitizer"){
		      score++;
			  bulletSpray++;
			  hp.play();
			  }
			 
			delete upgradeList[i];
	    }
    }
  
  for (var i in GenrateList) {
    updateEntity(GenrateList[i]);
	
	
	var iscolliding= collidesornot(player,GenrateList[i]);
	if (iscolliding){
	    player.hp=player.hp-1;
		enemyCol.play();
	}
  }
  
  for (var i in enemyList){
    updateEntity(enemyList[i]);
	
	var iscolliding= collidesornot(player,enemyList[i]);
	if (iscolliding){
	    player.hp=player.hp-1;
		enemyCol.play();
	}
  }
  
    if (player.hp<=0){
		var Totalscore= parseInt((Date.now() - starttime)/1000);
        Rp = true;		
		GameOver = true;
		ts= Totalscore;
		Gos.play();
	}
	
	updatePlayerPosition();
    drawEntityPlayer(player);
	can.fillStyle = 'white';
	can.fillRect(0,0,800,40);
	can.fillStyle = 'black';
	can.fillText(player.hp+ "Hp",0,30)
	can.fillText("score: " +score,200,30)
	can.fillText("Vaccine: " +bulletSpray,420,30)
	can.fillText("People cured: " +Vk,620,30)
}

startNewGame =function() {
can.font = "30px Arial";
player.hp=20
starttime= Date.now();
frameCount=0;
score=0;
Vk = 0;
bulletSpray = 0;
enemyList={};
upgradeList={};
bulletList={};
GenrateList={};
ts=0;
randomlyGenerateGenarator();
}

randomlyGenerateGenarator = function(){
Math.random();
var x= Math.random()*currentMap.width;
var y= Math.random()*currentMap.height;
var name = Math.random();

Generate(name,x,y);
}


randomlyGenerateEnemy =function(x,y){
Math.random();
   var height= 30;
   var width= 40;
   var name= Math.random();
   var spdX= 5 + Math.random()*5;
   var spdY= 5 + Math.random()*5;
   
   Enemy(name,x,y,spdX,spdY,width,height);
}

randomlyGenerateUpgrade =function(){
Math.random()
   var x= Math.random()*currentMap.width;
   var y= Math.random()*currentMap.height;
   var name= Math.random();
   var category = 'sanitizer';
   var img = Img.upgrade2;

   
   Upgrade(name,x,y,category,img);
}


randomlyGenerateBullet =function(actor,overwriteAngle,category){
Math.random()
   var x= actor.x;
   var y= actor.y;
   var height= 40;
   var width= 30;
   var name= Math.random();
   var angle= actor.aimAngle;
   
   if (overwriteAngle !== undefined){
    angle = overwriteAngle;
   }
   var spdX=Math.cos(angle/180*Math.PI)*5;
   var spdY=Math.sin(angle/180*Math.PI)*5;

   
   bullet(name,x,y,spdX,spdY,width,height,category);
}


Maps = function(name,imgSrc, width, height){
   var entity = {
      name:name,
      image: new Image(),
      width:width,
      height:height,
   }
   entity.image.src = imgSrc;
   
   entity.draw = function() {
      var x = WIDTH/2 - player.x;
      var y = HEIGHT/2 - player.y;
      can.drawImage(entity.image,25,0,entity.image.width,entity.image.height,x,y,entity.image.width*2,entity.image.height*2)
   }
   return entity;
}

currentMap = Maps('feild','img/bg.jpg',2500,1750);

startNewGame();
setInterval (update,40);
