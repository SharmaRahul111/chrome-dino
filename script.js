const canvas = document.querySelector("canvas")
const scoreBoard = document.querySelector("span.score")
const frame = {
	width:innerWidth,
	height:innerHeight<350?innerHeight:350
}
canvas.width = frame.width
canvas.height = frame.height
const c = canvas.getContext("2d")	
let SCORE = 0
let HIGHSCORE = localStorage.getItem("highScore")!=null?localStorage.getItem("highScore"):0
let GROUND = frame.height-30
const INITIALSPEED = 7.2
let SPEED = INITIALSPEED+0.05
const DINO = [new Image(), new Image(), new Image()]
const CACTUS = [new Image(),new Image()]
let BASE = ".img"
CACTUS[0].src = BASE+"/cactus-1.png"
CACTUS[1].src = BASE+"/cactus-2.png"
DINO[0].src = BASE+"/dino.png"
DINO[1].src = BASE+"/dino-1.png"
DINO[2].src = BASE+"/dino-2.png"
addEventListener("keydown",e => e.key=="E"?stop():false)
addEventListener("keydown",e => e.key=="S"?start():false)
c.beginPath()
c.moveTo(0,GROUND)
c.lineTo(frame.width,GROUND)
c.stroke()
c.font = "bold 17px Monospace"
c.fillStyle = "#777"
c.fillText("CHROME DINO GAME! by Rahul Sharma",5,GROUND-5)
function randInt(from, to){
	return Math.floor(Math.random()*(to-from))+from
}
class Dino {
	constructor(x,y,width,height){
		this.x = x
		this.y = GROUND-(y+height)
		this.Yvelocity = 0
		this.width = DINO[1].naturalWidth
		this.height = DINO[1].naturalHeight
		this.jumpLimit = GROUND-(this.height*3)
		this.imgIndex = 1
		this.inair = false
	}
	draw(){
		c.drawImage(DINO[this.imgIndex],this.x,this.y,this.width,this.height)
	}
	update(){
		this.y += this.Yvelocity
		this.draw()
		//Gravity code
		if(this.y+this.height >= GROUND){
			//Make the dino fall down
			this.Yvelocity = 0
			this.inair = false
		}else if(this.y <= this.jumpLimit){
			this.Yvelocity = 5
		}
	}
	jump(){
		if(this.y+this.height >= GROUND){
			this.Yvelocity = -9
			this.inair = true
		}
	}
}
class Enemy {
	constructor(height, i, imgIndex){
		this.width = CACTUS[imgIndex].naturalWidth
		this.height = height
		this.x = frame.width+(i*this.width)
		this.y = GROUND-height
		this.color = "red"
		this.imgIndex = imgIndex
	}
	draw(){
		c.drawImage(CACTUS[this.imgIndex],this.x,this.y,this.width,this.height)
	}
	update(){
		this.x -= SPEED
		this.draw()
	}
}
class MotionLine {
	constructor(marginGround, length){
		this.x = frame.width
		this.y = GROUND+marginGround
		this.width = length
	}
	draw(){
		c.beginPath()
		c.moveTo(this.x,this.y)
		c.lineTo(this.x+this.width,this.y)
		c.stroke()
	}
	update(){
		this.x -= SPEED
		this.draw()
	}
}
let dino, enemies = [], motionLines = [], frameId, toggleDinoTimer, createEnemiesFrameId, createMotionLinesFrameId
function init(){
	let width = 25
	let height = 50
	let x = 20
	let y = 0
	dino = new Dino(x,y,20,50)	
	addEventListener("keydown",e => e.keyCode==32 || e.keyCode == 38?dino.jump():false)
	addEventListener("touchstart",() => dino.jump())
	
}
function createEnemies(){
	let num = randInt(1,4)
	for(let i=0;i<num;i++){
		let height = Math.floor((Math.random()*20)+30) //30-50
		enemies.push(new Enemy(height,i,randInt(0,2)))
	}
	createEnemiesFrameId = setTimeout(createEnemies,randInt(1000-(SPEED-INITIALSPEED)*15,1500-(SPEED-INITIALSPEED)*15))
}
function createMotionLine(){
	let marginGround = Math.random()*10+10
	let length = Math.random()*20+10
	motionLines.push(new MotionLine(marginGround,length))
	createMotionLinesFrameId = setTimeout(createMotionLine,randInt(100,200))
}
function stop(){
	dino.imgIndex=0
	//console.log(3)
	HIGHSCORE = HIGHSCORE>SCORE?HIGHSCORE:SCORE
	localStorage.setItem("highScore", HIGHSCORE)
	SCORE=0
	cancelAnimationFrame(frameId)
	clearInterval(toggleDinoTimer)
	clearTimeout(createEnemiesFrameId)
	clearTimeout(createMotionLinesFrameId)
	//setTimeout(start,1000)
	document.getElementById("startBtn").disabled = false
}
function animate(){
	frameId = requestAnimationFrame(animate)
	scoreBoard.innerHTML = `HI ${HIGHSCORE} | ${SCORE}`
	c.clearRect(0 ,0 ,innerWidth ,innerHeight);
	dino.update()
	let spliceIndex = []
	enemies.forEach((enemy,i)=> {
		enemy.update()
		if(enemy.x+enemy.width <= -enemy.width){
			spliceIndex.push(i)
		}else {
			if(enemy.x+enemy.width > dino.x && enemy.x < dino.x+dino.width-30){
				if(enemy.y < dino.y+dino.height){
					stop()
				}
			}else if(enemy.x+enemy.width > dino.x && enemy.x < dino.x+dino.width-18){
				if(enemy.y < dino.y+dino.height*0.75){
					stop()
				}
			}else if(enemy.x+enemy.width > dino.x && enemy.x < dino.x+dino.width-7){
				if(enemy.y < dino.y+dino.height*0.25){
					stop()
				}
			}
			
		}
	})
	spliceIndex.forEach(i => enemies.splice(i,1))
	motionLines.forEach((motionLine, i)=> {
		motionLine.update()
		if(motionLine.x+motionLine.width <= -motionLine.width*2){
			motionLines.splice(i,1)
		}
		
	})
	SCORE++
	SPEED += 0.003
	//helpers
	
	c.beginPath()
	c.moveTo(0,GROUND)
	c.lineTo(frame.width,GROUND)
	c.stroke()
	/*
	c.beginPath()
	c.moveTo(0,dino.jumpLimit)
	c.lineTo(frame.width,dino.jumpLimit)
	c.stroke()
	*/
}

addEventListener("resize", function(){
	canvas.width = frame.width = innerWidth
	canvas.height = frame.height = innerHeight
	GROUND = frame.height-30
	
})
function toggleFullScreen(){
	if(fullscreen){document.exitFullscreen();fullscreen=false}else{document.documentElement.requestFullscreen();fullscreen=true}
}
var fullscreen = false
addEventListener("keydown", e => e.keyCode == 122?toggleFullScreen():false)



//function calls
 setTimeout(()=> {
	//start()
},2000)

function start(){
	dino = undefined
	enemies = []
	motionLines = []
	frameId = undefined
	init()
	animate()
	setTimeout(createEnemies,2000)
	createMotionLine()
	toggleDinoTimer = setInterval(()=> {
		if(!dino.inair){
			dino.imgIndex==1?dino.imgIndex=2:dino.imgIndex=1
		}else{
			dino.imgIndex=1
		}
	},80)
}