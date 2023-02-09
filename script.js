var canvas = document.getElementById('canvas').getContext("2d");
canvas.imageSmoothingEnabled = false;

document.addEventListener("click", function(e){
  if (currentScene.click) {
    currentScene.click();
  }
});

document.addEventListener("mousemove", function(e){
  if (currentScene.moveShip) {
    currentScene.moveShip(e);
  }
});

var currentScene = {};
function changeScene(scene){
  currentScene = scene;
};

var groupShoot = [];
var shoots = {
  draw(){
    groupShoot.forEach((shoot) => {
      shoot.draw();
    });
  },
  update(){
    groupShoot.forEach((shoot) => {
      shoot.move();

      if (shoot.y <= -100) {
        groupShoot.splice(shoot[0], 1)
      }

    });
  },
};

var groupMeteors = [];
var meteors = {
  time: 0,
  spawMeteors(){
    this.time += 1;

    size = Math.random() * (80 - 50) + 50;
    posx = Math.random() * (450 - 10) + 10;

    if (this.time >= 60) {
      this.time = 0;
      groupMeteors.push(new Meteors(posx, -100,size,size,"assets/meteoro.png"));
    }
  },

  destroyMeteors(){
    groupShoot.forEach((shoot) => {
      groupMeteors.forEach((meteors) => {
        if (shoot.collide(meteors)) {
          groupShoot.splice(groupShoot.indexOf(shoot), 1);
          groupMeteors.splice(groupMeteors.indexOf(meteors), 1);
        }
      });

    });

  },

  draw(){
    groupMeteors.forEach((m) => {
      m.draw();
    });

  },

  update(){
    this.spawMeteors();
    this.destroyMeteors();
    groupMeteors.forEach((m) => {
      m.move();
      if (m.y > 1000) {
        groupMeteors.splice(groupMeteors.indexOf(m), 1);
      }
    });
  },
}

var infityBg = {
  bg : new Obj(0,0,500,900,"assets/fundo.png"),
  bg2 : new Obj(0,-900,500,900,"assets/fundo.png"),

  draw(){
    this.bg.draw();
    this.bg2.draw();
  },

  moveBg(){
    this.bg.y += 1;
    this.bg2.y += 1;

    if (this.bg.y >= 900) {
      this.bg.y = 0;
    }
    if (this.bg2.y >= 0) {
      this.bg2.y = -900;
    }
  },
};

var menu = {

  title: new Text("SpaceShip"),
  label: new Text("Click to Play"),
  ship : new Obj(220, 800, 60, 50,"assets/nave.png"),

  click(){
    changeScene(game);
  },

  draw(){
    infityBg.draw();
    this.title.draw_text(60, "Arial", 90, 300, "white");
    this.label.draw_text(20, "Arial", 180, 400, "white");
    this.ship.draw();

  },
  update(){
    infityBg.moveBg();
  },
};

var game = {
  score : new Text("0"),
  ship : new Obj(220, 800, 60, 50,"assets/nave.png"),

  click(){
    groupShoot.push(new Shoot(this.ship.x + this.ship.widht / 2,this.ship.y,2,10,"assets/tiro.png"));
  },

  moveShip(event){
    this.ship.x = event.offsetX  - this.ship.width / 2;
    this.ship.y = event.offsetY - 30;
  },

  draw(){
    infityBg.draw();
    this.score.draw_text(30,"arial", 40, 40, "white");
    this.ship.draw();
    shoots.draw();
    meteors.draw();
  },

  update(){
    infityBg.moveBg();
    shoots.update();
    meteors.update();
  },
};

var gameover = {

  score : new Text("0"),

  draw(){
    infityBg.draw();
    this.score.draw_text(30,"arial", 40, 40, "white");
  },
  update(){
    infityBg.moveBg();
  },
};

function main(){
  canvas.clearRect(0,0,500,900);
  currentScene.draw();
  currentScene.update();
  requestAnimationFrame(main);
}

changeScene(menu);
main();
