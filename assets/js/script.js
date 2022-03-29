const canvas = document.querySelector('canvas');
const scoreSpan = document.querySelector('#score');
const ctx = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

const ship = new Ship();
const projectiles = [];
const grids = [];
const invaderProjectiles = [];
const particles = [];

const keys = {
	arrowLeft: {
		pressed: false,
	},
	arrowRight: {
		pressed: false,
	},
	space: {
		pressed: false,
	},
};

let frames = 0;
let randomInterval = Math.floor(Math.random() * 500 + 500);
let game = {
	over: false,
	active: true,
};
let score = 0;

for (let i = 0; i < 250; i++) {
	particles.push(
		new Particle({
			position: {
				x: Math.random() * canvas.width,
				y: Math.random() * canvas.height,
			},
			velocity: {
				x: 0,
				y: 0.3,
			},
			radius: Math.random() * 3,
			color: 'white',
		})
	);
}

const createParticles = ({ object, color, fades }) => {
	for (let i = 0; i < 15; i++) {
		particles.push(
			new Particle({
				position: {
					x: object.position.x + object.width / 2,
					y: object.position.y + object.height / 2,
				},
				velocity: {
					x: (Math.random() - 0.5) * 2,
					y: (Math.random() - 0.5) * 2,
				},
				radius: Math.random() * 3,
				color: color || '#BAA0DE',
				fades: true,
			})
		);
	}
};

const animate = () => {
	if (!game.active) return;
	requestAnimationFrame(animate);

	ctx.fillStyle = 'black';
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ship.update();
	particles.forEach((particle, i) => {
		if (particle.position.y - particle.radius >= canvas.height) {
			particle.position.x = Math.random() * canvas.width;
			particle.position.y = -particle.radius;
		}

		if (particle.opacity <= 0) {
			setTimeout(() => {
				particles.splice(i, 1);
			}, 0);
		} else {
			particle.update();
		}
	});
	invaderProjectiles.forEach((invaderProjectile, index) => {
		if (invaderProjectile.position.y + invaderProjectile.height >= canvas.height) {
			setTimeout(() => {
				invaderProjectiles.splice(index, 1);
			}, 0);
		} else {
			invaderProjectile.update();
		}

		if (invaderProjectile.position.y + invaderProjectile.height >= ship.position.y && invaderProjectile.position.x + invaderProjectile.width >= ship.position.x && invaderProjectile.position.x <= ship.position.x + ship.width) {
			setTimeout(() => {
				invaderProjectiles.splice(index, 1);
				ship.opacity = 0;
				game.over = true;
			}, 0);
			setTimeout(() => {
				game.active = false;
			}, 2000);
			createParticles({
				object: ship,
				color: 'white',
				fades: true,
			});
		}
	});
	projectiles.forEach((projectile, index) => {
		if (projectile.position.y + projectile.radius <= 0) {
			setTimeout(() => {
				projectiles.splice(index, 1);
			}, 0);
		}
		projectile.update();
	});

	grids.forEach((grid, gridIndex) => {
		grid.update();

		if (frames % 100 === 0 && grid.invaders.length > 0) {
			grid.invaders[Math.floor(Math.random() * grid.invaders.length)].shoot(invaderProjectiles);
		}

		grid.invaders.forEach((invader, i) => {
			invader.update({ velocity: grid.velocity });

			projectiles.forEach((projectile, j) => {
				if (projectile.position.y - projectile.radius <= invader.position.y + invader.height && projectile.position.x + projectile.radius >= invader.position.x && projectile.position.x - projectile.radius <= invader.position.x + invader.width && projectile.position.y + projectile.radius >= invader.position.y) {
					setTimeout(() => {
						const invaderFound = grid.invaders.find((invader2) => {
							return invader2 === invader;
						});
						const projectileFound = projectiles.find((projectile2) => projectile2 === projectile);
						if (invaderFound && projectileFound) {
							score += 100;
							scoreSpan.innerHTML = score;
							createParticles({
								object: invader,
								fades: true,
							});
							grid.invaders.splice(i, 1);
							projectiles.splice(j, 1);

							if (grid.invaders.length > 0) {
								const firstInvader = grid.invaders[0];
								const lastInvader = grid.invaders[grid.invaders.length - 1];

								grid.width = lastInvader.position.x - firstInvader.position.x + lastInvader.width;
								grid.position.x = firstInvader.position.x;
							} else {
								grids.splice(gridIndex, 1);
							}
						}
					}, 0);
				}
			});
		});
	});

	if (keys.arrowLeft.pressed && ship.position.x >= 0) {
		ship.velocity.x = -7;
		ship.rotation = -0.15;
	} else if (keys.arrowRight.pressed && ship.position.x <= canvas.width - ship.width) {
		ship.velocity.x = 7;
		ship.rotation = 0.15;
	} else {
		ship.velocity.x = 0;
		ship.rotation = 0;
	}

	if (frames % randomInterval === 0) {
		grids.push(new Grid());
		randomInterval = Math.floor(Math.random() * 500 + 500);
	}

	frames++;
};

animate();

addEventListener('keydown', ({ key }) => {
	if (game.over) return;

	switch (key) {
		case 'ArrowLeft':
			keys.arrowLeft.pressed = true;
			break;
		case 'ArrowRight':
			keys.arrowRight.pressed = true;
			break;
		case ' ':
			projectiles.push(
				new Projectile({
					position: {
						x: ship.position.x + ship.width / 2,
						y: ship.position.y,
					},
					velocity: {
						x: 0,
						y: -15,
					},
				})
			);

			break;
	}
});

addEventListener('keyup', ({ key }) => {
	switch (key) {
		case 'ArrowLeft':
			keys.arrowLeft.pressed = false;
			break;
		case 'ArrowRight':
			keys.arrowRight.pressed = false;
			break;
		case ' ':
			break;
	}
});
