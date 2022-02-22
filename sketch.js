//Variáveis

var trex, trex_running, trex_collided,trex_down;
var edges;
var ground, groundImage;
var InvisibleGround;
var cloud, cloudImage;
var obstaculo1, obstaculo2, obstaculo3, obstaculo4, obstaculo5, obstaculo6;
var Score = 0;
var PLAY = 1;
var END = 0;
var gameState = PLAY;
var gameOver,gameOverImg,restart,restartImg;
var jumpSoundTrex,dieSoudTrex,scoreSoundTrex;

//Pre carregamento de imagens para criar uma animação em sprites
function preload() {
  //trex
  trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  trex_down = loadAnimation("trex_low1.png","trex_low2.png");
  //trexSound
  jumpSoundTrex = loadSound("jump.mp3");
  dieSoundTrex = loadSound("die.mp3");
  scoreSoundTrex = loadSound("checkPoint.mp3");
  //chão
  groundImage = loadImage("ground2.png");

  //nuvem
  cloudImage = loadImage("cloud.png");

  //obstaculos
  obstaculo1 = loadImage("obstacle1.png");
  obstaculo2 = loadImage("obstacle2.png");
  obstaculo3 = loadImage("obstacle3.png");
  obstaculo4 = loadImage("obstacle4.png");
  obstaculo5 = loadImage("obstacle5.png");
  obstaculo6 = loadImage("obstacle6.png");

  //elementos de fim de jogo
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
}


//Configuração
function setup() {
  //variaveis locais
  //var mensagem = "Esta é uma mensagem";
  //console.log(mensagem);
  //Criando a área do jogo
  createCanvas(windowWidth,windowHeight);

  //chão invisivel 
  InvisibleGround = createSprite(width/2, height-10, width, 10);
  InvisibleGround.visible = false;

  //criando grupos de obstáculos e nuvens
  obstaculoG = new Group();
  nuvemG = new Group();

  //console.log("olá" + 5);



  // Score = 0;
  
  //criando o trex
  trex = createSprite(50, height-40, 20, 50);
  trex.addAnimation("running", trex_running);
  trex.scale = 0.5;
  trex.setCollider("circle",0,0,50);
  trex.debug = false;
  trex.addAnimation("died",trex_collided);
  trex.addAnimation("down",trex_down);

  //Criando as bordas para a área do jogo
  edges = createEdgeSprites();

  //CRIANDO UM SOLO
  ground = createSprite(width/2, height-20, width, 20);
  ground.addImage("ground", groundImage);
  ground.x = ground.width / 2;

  //elementos de fim de jogo
  restart = createSprite(width/2,height/2+30);
  restart.addImage(restartImg);
  restart.scale = 0.5;
  restart.visible = false;
  gameOver = createSprite(width/2,height/2);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 0.5;
  gameOver.visible = false;

  //números aleatórios
  //var teste = Math.round(random(1, 100));
  //console.log(teste);

}


function draw() {

  background("white");

  text("pontuação: " + Score, width-100, 50);
  console.log("isto é",gameState);
  if (gameState === PLAY) {
    //mover o solo
    ground.velocityX = -4;
    //pontuação
    Score = Score + Math.round(getFrameRate()/60);
    if (Score > 0&&Score%100===0) {
      scoreSoundTrex.play();
    
    }
    //Recarregando o chão
    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }
    //Fazer o trex pular e voltar (resolução do bug)
  if (touches.length > 0 || keyDown("space")) {
  
    if(trex.y >= height-40) {
      trex.velocityY = -10;
      jumpSoundTrex.play();
    }
  }
    if (keyIsDown(DOWN_ARROW)) {
      trex.changeAnimation("down",trex_down);
      trex.y = trex.y +20;
   }else{
      trex.changeAnimation("running",trex_running);
    }
    //Gravidade
    trex.velocityY = trex.velocityY + 0.5;

    criarNuvem();
    criarobstaculos();

    if (obstaculoG.isTouching(trex)) {
      gameState = END;
      dieSoundTrex.play();
      //trex.velocityY = -10;
      //trex.velocityY = trex.velocityY + 0.5;
      //jumpSoundTrex.play();
    }
  }

  else if (gameState === END) {
    restart.visible = true;
    gameOver.visible = true;
    //parar o solo
    ground.velocityX = 0;
    trex.velocityY = 0;
    trex.changeAnimation("died",trex_collided);
    obstaculoG.setVelocityXEach(0);
    nuvemG.setVelocityXEach(0);
    obstaculoG.setLifetimeEach(-1);
    nuvemG.setLifetimeEach(-1);

    if (mousePressedOver(restart)||touches.length>0) {
      touches=[];
      reset();
    }


  }
  trex.collide(InvisibleGround);

  drawSprites();
  //console.log(mensagem);
}

function reset() {
  gameState=PLAY;
  obstaculoG.destroyEach();
  nuvemG.destroyEach();
  restart.visible = false;
    gameOver.visible = false;

  Score = 0;
}

function criarobstaculos() {
  if (frameCount % 60 == 0) {
    var obstaculo = createSprite(width+10, height-35, 10, 40);
    obstaculo.velocityX = - (6+Score/1000);
    
    //gerar obstáculos aleatórios
    var rand = Math.round(random(1, 6));

    switch (rand) {
      case 1: obstaculo.addImage(obstaculo1);
        break;

      case 2: obstaculo.addImage(obstaculo2);
        break;

      case 3: obstaculo.addImage(obstaculo3);
        break;

      case 4: obstaculo.addImage(obstaculo4);
        break;

      case 5: obstaculo.addImage(obstaculo5);
        break;

      case 6: obstaculo.addImage(obstaculo6);
        break;

      default: break;
    }
    //atribuir dimensão e tempo de vida ao obstáculo
    obstaculo.scale = 0.5;
    obstaculo.lifetime = 300;

    //adicione cada obstáculo ao grupo
    obstaculoG.add(obstaculo);
  }
}

function criarNuvem() {

  if (frameCount % 60 == 0) {
    cloud = createSprite(width+10, height-100, 10, 10);
    cloud.y = Math.round(random(height-150,height-100));
    cloud.addImage("nuvem", cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;

    //tempo de vida 
    cloud.lifetime = 250;

    //profundidade
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    // console.log(cloud.depth);
    // console.log(trex.depth);

    //adicionar nuvem ao grupo
    nuvemG.add(cloud);

  }
}
