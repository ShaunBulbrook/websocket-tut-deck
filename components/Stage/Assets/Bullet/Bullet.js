class Bullet {
	constructor(props) {
		this.x = props.x;
		this.y = props.y;
		this.angle = props.angle;
		this.speed = 5;
		this.velocityX = Math.cos(this.angle) * this.speed;
		this.velocityY = Math.sin(this.angle) * this.speed;

		this.color = props.color ? props.color : 'red';
		this.width = 50;
		this.height = 8;
		this.offsetX = this.width * 0.5;
		this.offsetY = this.height * 0.5;
	}

	move() {
		this.x += this.velocityX;
		this.y += this.velocityY;
	}

}

export default Bullet;
