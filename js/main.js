
//Canvas
const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
canvas.style.backgroundColor = "black";
//canvas.style.backgroundImage = "url('https://i.pinimg.com/564x/46/8e/52/468e52c0e3727972ce6e224f5e052029.jpg')"
canvas.style.backgroundSize = "cover";
canvas.width = 1024;
canvas.height = 576;
c.fillRect(0,0,canvas.width,canvas.height);


const gravity = 0.5;//gia tốc rơi
const x_speed = 5;// tốc độ di chuyển x
let damage = 5; //Thiệt hại


//Create character
class Sprite{
	constructor({position,velocity,color,offset}){
		this.position = position//vi tri
		this.velocity = velocity
		this.height = 150
		this.width = 50
		this.lastKey
		this.attackBox = {
			position:{
				x:this.position.x,
				y:this.position.y
			},
			offset,
			width:150,
			height:50
		}
		this.color = color
		this.isAttacking
		this.health = 100
	}
	//vi tri nhan vat, chieu cao, chieu rong
	draw(){
		c.fillStyle=this.color;
		c.fillRect(this.position.x,this.position.y,this.width,this.height);
		//c.drawImage(img,this.position.x,this.position.y,50,150);
		//ve nhan vat tai vi tri x y;
		//attackbox
		if(this.isAttacking){ 
			c.fillStyle="red";
			c.fillRect(
			this.attackBox.position.x,
			this.attackBox.position.y,
			this.attackBox.width,
			this.attackBox.height)
			
		}
		
	}
	update(){
		this.draw();
		this.attackBox.position.x = this.position.x - this.attackBox.offset.x;
		this.attackBox.position.y = this.position.y; 
		//this.velocity.y += gravity;
		if(this.position.x + this.width +  this.velocity.x < canvas.width && this.position.x + this.velocity.x > 0){
			this.position.x += this.velocity.x;
		}
		else{
			this.velocity.x =0;
		}
		this.position.y += this.velocity.y;
		if(this.position.y + this.height + this.velocity.y >= 576){
			//this.height = Sprite.height = 150
			this.velocity.y = 0;
			
		}else{
			this.velocity.y += gravity;
		}
	}
	attack(){
		this.isAttacking = true
		setTimeout(() => {
			this.isAttacking = false
		},100)
		
	}
}


const player = new Sprite({
	position:{
		x:70,
		y:0
	},
	velocity:{
		x:0,
		y:0
	},
	color:'green',
	offset:{
		x:0,
		y:0
	}
});
player.draw();


const enemy = new Sprite({
	position:{
	x:904,
	y:0
	},
	velocity:{
		x:0,
		y:0
	},
	color:'blue',
	offset:{
		x:100,
		y:0
	}
});
enemy.draw();
const keys = {
	a:{
		perssed:false
	},
	d:{
		pressed:false
	},
	ArrowLeft:{
		pressed:false
	},
	ArrowRight:{
		pressed:false
	}
}
//Collision
function rectangularCollision({ rectangle1 , rectangle2 }){
	return (
		rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x &&
		rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width &&
		rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y &&
		rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
	)
}
//display result
function determineWiner({player,enemy, timeId}){
	clearTimeout(timeId);
	result.style.display = 'block';
	if(player.health === enemy.health){
		result.innerHTML = 'Tie';
	}else if(player.health > enemy.health){
		result.innerHTML = 'Player 1 win';
	}else{
		result.innerHTML = 'Player 2 win';
	}
}
//Timer
let timer = 180;
let timeId;
let result = document.querySelector('#result');
function decreaseTimer(){
	if(timer > 0){
		timeId = setTimeout(decreaseTimer,1000);
		timer--;
		document.querySelector("#timer").innerHTML = timer;
	}
	if(timer === 0 ){
		determineWiner({player,enemy})
	}
}
decreaseTimer();
//Animate
function animate(){
	window.requestAnimationFrame(animate)
	c.clearRect(0,0,canvas.width, canvas.height);
	player.update();
	enemy.update();

	enemy.velocity.x = 0;
	player.velocity.x = 0;

	if(keys.a.pressed && player.lastKey === 'a'){
		player.velocity.x = -x_speed;
	}else if(keys.d.pressed && player.lastKey === 'd'){
		player.velocity.x = x_speed;
	}
	//
	if(keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft'){
		enemy.velocity.x = -x_speed;
	}else if(keys.ArrowRight.pressed && enemy.lastKey ==='ArrowRight'){
		enemy.velocity.x = x_speed;
	}
	//detect for collision
	if(rectangularCollision({
		rectangle1:player,
		rectangle2:enemy}) && player.isAttacking){
		console.log('player attack');
		player.isAttacking = false
		enemy.health -= damage;
		document.querySelector("#enemyHealth").style.width = enemy.health +'%';

		//Nếu hp không chia hết cho thiệt hại
		if(enemy.health < 0){
			document.querySelector("#enemyHealth").style.width = '0';
		}
	}
	if(rectangularCollision({
		rectangle1:enemy,
		rectangle2:player}) && enemy.isAttacking){
		console.log('enemy attack');
		enemy.isAttacking = false
		player.health -= damage;
		document.querySelector("#playerHealth").style.width = player.health +'%';
		if(player.health < 0){
			document.querySelector("#playerHealth").style.width = '0';
		}
	}


	//end game
	if(enemy.health <= 0 || player.health <= 0 ){
		determineWiner({player,enemy,timeId})
	}
}
animate();


//Mover character
window.addEventListener('keydown', (event) => {
	switch(event.key){
		case 'd':
			keys.d.pressed = true;
			player.lastKey = 'd';
			player.attackBox.offset.x = 0;
			break;
		case 'a':
			keys.a.pressed = true;
			player.lastKey = 'a';
			player.attackBox.offset.x = 100;
			break;
		case 'w':
			player.velocity.y = -15;
			//Độ cao nhảy lên
			break;
		case ' ':
			player.attack();
			break;
		case 'ArrowRight':
			keys.ArrowRight.pressed = true;
			enemy.lastKey = 'ArrowRight';
			enemy.attackBox.offset.x = 0;
			break;
		case 'ArrowLeft':
			keys.ArrowLeft.pressed = true;
			enemy.lastKey = 'ArrowLeft';
			enemy.attackBox.offset.x = 100;
			break;
		case 'ArrowUp':
			enemy.velocity.y = -15;
			//Độ cao nhảy lên
			break;
		case 'm':
			enemy.attack();
			break;

	}
});
window.addEventListener('keyup', (event) => {
	switch(event.key){
		case 'd':
			keys.d.pressed = false;
			break;
		case 'a':
			keys.a.pressed = false;
			break;
		case 'ArrowRight':
			keys.ArrowRight.pressed = false;
			break;
		case 'ArrowLeft':
			keys.ArrowLeft.pressed = false;
			break;
	}
	
});
