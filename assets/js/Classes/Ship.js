class Ship {
	constructor() {
		this.velocity = {
			x: 0,
			y: 0,
		};

		this.rotation = 0;
		this.opacity = 1;

		const image = new Image();
		image.src = '../../assets/img/spaceship.png';
		image.onload = () => {
			const scale = 0.15;
			this.image = image;
			(this.width = image.width * scale), (this.height = image.height * scale);
			this.position = {
				x: canvas.width / 2 - this.width / 2,
				y: canvas.height - this.height - 20,
			};
		};
	}
	draw() {
		// ctx.fillStyle = 'red';
		// ctx.fillRect(this.position.x, this.position.y, this.width, this.height);

		ctx.save();
		ctx.globalAlpha = this.opacity;
		ctx.translate(ship.position.x + ship.width / 2, ship.position.y + ship.height / 2);
		ctx.rotate(this.rotation);
		ctx.translate(-ship.position.x - ship.width / 2, -ship.position.y - ship.height / 2);
		ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);

		ctx.restore();
	}
	update() {
		if (this.image) {
			this.draw();
			this.position.x += this.velocity.x;
		}
	}
}
