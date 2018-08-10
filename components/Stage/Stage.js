import React from 'react';
import PropTypes from 'prop-types';
import io from 'socket.io-client';

import CollisionChecker from './Assets/CollisionChecker/CollisionChecker';

import Bullet from './Assets/Bullet/Bullet';

class Stage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			cursor: {
				x: 0,
				y: 0,
			}
		}
		this.gameState = {
			players: {},
			bullets: [],
		};
	}

	render() {
		return (
			<div className="Stage">
				<canvas ref="canvas" width={this.props.width} height={this.props.height}></canvas>
			</div>
		);
	}
	componentDidMount() {
		this.configureCanvas();
		this.addListeners();
		this.startSockets();
		this.createHero();
		this.animate();
	}
	startSockets() {
		this.socket = io('10.193.176.165:3001');

		this.socket.on('new state', (data) => {
			this.gameState = data;
		})
		this.socket.on('disconnect', (data) => {
			//
		})
	}
	createHero() {
		this.hero = {
			name: this.socket.id,
			x: this.props.width * 0.5,
			y: this.props.height * 0.5,
			width: 100,
			height: 50,
			angle: 0,
			velocityX: 0,
			velocityY: 0,
			terminalVelocity: 5,
			accl: 0.5,
			color: ('#'+Math.floor(Math.random()*16777215).toString(16)),
			bullets: [],
		}
		this.hero.offsetX = this.hero.width * -0.5;
		this.hero.offsetY = this.hero.height * -0.5;
	}
	configureCanvas() {
		this.setState({
			canvas: this.refs.canvas.getBoundingClientRect(),
		});
		this.ctx = this.refs.canvas.getContext('2d');
	}
	addListeners() {
		window.addEventListener('mousemove', (e) => {
			this.setState({
				cursor: {
					x: e.clientX - this.state.canvas.x,
					y: e.clientY - this.state.canvas.y,
				}
			})
		});
		window.addEventListener('keydown', (e) => {
			switch(e.key) {
				case 'w' || 'W':
					if(this.hero.velocityX < this.hero.terminalVelocity) this.hero.velocityX += Math.cos(this.hero.angle) * this.hero.accl;
					if(this.hero.velocityY < this.hero.terminalVelocity) this.hero.velocityY += Math.sin(this.hero.angle) * this.hero.accl;
					break;

				default:
					break;
			}
		});
		window.addEventListener('mousedown', () => {
			if(!this.state.shooting) {
				this.hero.bullets.push(new Bullet({
					x: this.hero.x,
					y: this.hero.y,
					angle: this.hero.angle,
				}))
			}
			this.setState({shooting:true});
		});
		window.addEventListener('mouseup', () => {
			this.setState({shooting: false});
		})
	}

	animate () {
		this.moveHero();
		this.updateBullets();
		this.drawScene();
		this.updateStates();
		window.requestAnimationFrame(this.animate.bind(this));
	}
	moveHero() {

		this.hero.angle = Math.atan2(this.state.cursor.y - this.hero.y, this.state.cursor.x - this.hero.x);
		this.hero.x += this.hero.velocityX;
		this.hero.y += this.hero.velocityY;


		if(this.hero.x < 0) {
			this.hero.x = 0;
			this.hero.velocityX = this.hero.velocityX * -0.5;
		}
		if(this.hero.y < 0) {
			this.hero.y = 0;
			this.hero.velocityY = this.hero.velocityY * -0.5;
		}
		if(this.hero.x > this.props.width) {
			this.hero.x = this.props.width;
			this.hero.velocityX = this.hero.velocityX * -0.5;
		}
		if(this.hero.y > this.props.height) {
			this.hero.y = this.props.height;
			this.hero.velocityY = this.hero.velocityY * -0.5;
		}


		this.gameState.players[this.hero.name] = this.hero;

	}
	updateBullets() {
		this.hero.bullets.forEach((bullet, i) => {
			bullet.move();
			if(bullet.x > this.props.width + bullet.width ||
				bullet.x < 0 - 0 - bullet.width ||
				bullet.y > this.props.height + bullet.width ||
				bullet.y < 0 - bullet.height) {
				this.hero.bullets.splice(i, 1);
			}
		});
	}
	checkForBulletCollisions() {
		let polars = []
		this.gameState.players.forEach((player) => {

			this.herobullets.forEach((bullet) => {
				//lol shittest ever check to disable checks on the same object
				// if(!this.hero.x === player.x) {
				//
				// }
				// console.log(CollisionChecker.doPolygonsIntersect(
				// 	[{bullet.x, y}, {x,y}, {x,y},{x,y}],
				// 	[{x, y}, {x,y}, {x,y},{x,y}],
				// ))
			});
		});
	}
	updateStates() {
		this.socket.emit('update', this.hero);
	}
	drawScene() {
		//separate gamestate for the render

		this.ctx.resetTransform();
		this.ctx.clearRect(0,0,this.props.width, this.props.height);
		this.ctx.fillStyle = 'black';
		this.ctx.fillRect(0,0,this.props.width, this.props.height);

		//drawplayers
		Object.keys(this.gameState.players).forEach((key) => {
			if(!(key === 'undefined')) {

				this.ctx.fillStyle = this.gameState.players[key].color;
				this.ctx.translate(this.gameState.players[key].x, this.gameState.players[key].y);
				this.ctx.rotate(this.gameState.players[key].angle);
				this.ctx.translate(this.gameState.players[key].offsetX, this.gameState.players[key].offsetY);
				this.ctx.fillRect(0,0,this.gameState.players[key].width, this.gameState.players[key].height);
				this.ctx.resetTransform();
				//draw bulletw

				this.gameState.players[key].bullets.forEach((bullet, i) => {
					this.ctx.fillStyle = bullet.color;
					this.ctx.translate(bullet.x, bullet.y);
					this.ctx.rotate(bullet.angle);
					this.ctx.translate(bullet.offsetX, bullet.offsetY);
					this.ctx.fillRect(0,0,bullet.width, bullet.height);
					this.ctx.resetTransform();
				})
			}
		});
	}
}

Stage.propTypes = {
	width: PropTypes.number.isRequired,
	height: PropTypes.number.isRequired,
};

export default Stage;
