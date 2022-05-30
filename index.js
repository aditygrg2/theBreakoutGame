var paddleHeight = 10;
var paddleWidth = 150;
var paddleX = (window.innerWidth-paddleWidth)/2;
var right = false;
var left = false;
var canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');
var ballRadius = 10;
var score = 0;
var speed = 1;
var brickWidth =100;
var brickHeight = 20;
var brickPadding = 30;
var brickOffsetTop = 30;
var brickRowCount = parseInt((window.innerHeight)/(brickHeight+brickOffsetTop))-5;
var brickColumnCount = parseInt((window.innerWidth)/(brickWidth+brickPadding));
var totalBricks = brickRowCount*brickColumnCount;
console.log(totalBricks);
var color = '#' + (Math.random().toString(16) + "000000").substring(2,8);
var brickOffsetLeft = 40;
var x = paddleX;
var y = window.innerHeight-paddleHeight-100;
var dx = speed;
var dy = speed;
var lives = 3;
var click = false;
var inter;

var bricks = [];
for(var c=0;c<brickColumnCount;c++){
    bricks[c] = [];
    for(var r=0;r<brickRowCount;r++){
        bricks[c][r] = {x:0,y:0,color:"#ADD8E6",hitStatus : false};
    }
}

function drawBricks(){
    for(var c=0;c<brickColumnCount;c++){
        for(var r=0;r<brickRowCount;r++){
            if(bricks[c][r].hitStatus == false){
            var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
            var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
            bricks[c][r].x = brickX;
            bricks[c][r].y = brickY;
            ctx.beginPath();
            ctx.rect(brickX, brickY, brickWidth, brickHeight);
            ctx.fillStyle = bricks[c][r].color;
            ctx.fill();
            ctx.closePath();
            }
        }
    }
}

addEventListener('load',()=>{
    /** @type {HTMLCanvasElement} */ 
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    inter = setInterval(function(){
        ctx.clearRect(0,0,canvas.height+700,canvas.width+700);//clear complete canvas
        paddle();
        if(right && paddleX < canvas.width-paddleWidth) {
            paddleX += 40;
            right = false;
        }
        else if(left && paddleX > 0) {
            paddleX -= 40;
            left = false;
        }
        x = paddleX;
        y = window.innerHeight-paddleHeight-100;
        if(click == true){
            main();
        }
    },10)
    ctx.arc(x,y,ballRadius,0,Math.PI*2);
    addEventListener('keypress',function(event){
        if(event.keyCode = 32){
            main();
        }
    },{once:true})
    
    
})

function paddle(){
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.fillStyle = "blue";
    ctx.fillRect(paddleX,window.innerHeight-paddleHeight-100,paddleWidth,paddleHeight);
    ctx.closePath();
}

function showScore(){
    document.getElementById('score').innerText = score;
}

function gameOver(){
    if(lives==0){
    document.getElementById('textUser').innerText = "Game Over!";
    document.getElementById('beware').innerText = "Reloading in 2 seconds...";
    document.getElementById('score').style.color = "red";
    setTimeout(function(){
        location.reload();
    },2000);
    }

    else{
        lives--;
        document.getElementById('textUser').innerText = "Hitting on same colour rod gives bonus points!";
        document.getElementById('beware').innerText = "You have only "+lives+" lives left.";
        document.getElementById('lives').innerText = lives;
        paddleHeight = 10;
        paddleWidth = 150;
        paddleX = (window.innerWidth-paddleWidth)/2;
        dx = 2;
        dy = -2;
    }
}

document.addEventListener('keydown',keyDownHandler,false);
document.addEventListener('keyup',keyUpHandler,false);
document.addEventListener("mousemove", mouseMoveHandler, false);
document.addEventListener("touchstart",function(){
    click = true;
})

function mouseMoveHandler(event) {
    var relativeX = event.clientX - canvas.offsetLeft;
    if(relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth/2;
    }
}

function collission(){
    for(var c=0;c<brickColumnCount;c++){
        for(var r=0;r<brickRowCount;r++){
            var b = bricks[c][r];
            if(b.hitStatus == false){
            if(x>=b.x && x <= b.x + brickWidth && y>=b.y && y<= b.y+brickHeight){
                dy=-dy;
                b.hitStatus = true;
                score+=10;
                totalBricks--;
                if(totalBricks == 0){
                    gameWin();
                }
                showScore();
            }
        }
        }
    }
}

function gameWin(){
    document.getElementsByTagName('canvas')[0].classList.add('hidden');
    document.getElementById('HelpMessage1').innerText = "Congratulations for winning the game. Your score is "+score;
    document.getElementById('HelpMessage1').classList.toggle('hidden');
    document.getElementById('HelpMessage2').innerText = "Congratulations for winning the game. Your score is "+score;
    document.getElementById('HelpMessage2').classList.toggle('hidden');
    document.getElementById('textUser').innerText = "Thanks for playing!";
    document.getElementById('beware').innerText = "Reloading in 2 seconds...";
    setTimeout(function(){
        location.reload(true);
    },2000);
}

function keyDownHandler(event){
   if(event.code == "ArrowRight" || event.code == "Right"){
        right = true;
   }

   else if(event.code == "ArrowLeft" || event.code == "Left"){
        left = true;
   }
}
function keyUpHandler(event) {
    if(event.code  == "ArrowRight" || event.code == "Right") {
        rightPressed = false;
    }
    else if(event.code == 'ArrowLeft' || event.code == "Left") {
        leftPressed = false;
    }
}

addEventListener('resize',function(){
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
})

function main(){
    this.document.getElementById('HelpMessage1').classList.add('hidden');
    this.document.getElementById('HelpMessage2').classList.add('hidden');
            setInterval(function(){
                clearInterval(inter);
                ctx.beginPath();
                ctx.clearRect(0,0,canvas.height+700,canvas.width+700);//clear complete canvas
                drawBricks();
                collission();
                ctx.arc(x,y,ballRadius,0,Math.PI*2);
                ctx.fillStyle = color;
                ctx.fill();
                ctx.closePath();
                paddle();
                x += dx;
                y += dy;
                if(x+dx<0 || x + dx > window.innerWidth){
                    dx = -dx;
                    color = '#' + (Math.random().toString(16) + "000000").substring(2,8);
                }
                if(y + dy < 0) {
                    dy = -dy;
                    color = '#' + (Math.random().toString(16) + "000000").substring(2,8);
                }
                if(y + dy > window.innerHeight ) {
                    gameOver();
                }
                if(x+dx<=paddleX+paddleWidth && x+dx>paddleX && y+dy>=window.innerHeight-paddleHeight-100 && y+dy<=window.innerHeight-100){
                    dy = -dy;
                    color = '#' + (Math.random().toString(16) + "000000").substring(2,8);
                    score += speed*2;
                    showScore();
                }
                if(right && paddleX < canvas.width-paddleWidth) {
                    paddleX += 40;
                    right = false;
                }
                else if(left && paddleX > 0) {
                    paddleX -= 40;
                    left = false;
                }
                speed = 2 +  parseInt(score/10);
        },10);
}
