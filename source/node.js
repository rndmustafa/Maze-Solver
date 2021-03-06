class Node {
	constructor(x, y, color, id = undefined) {
		this.x = x;
		this.y = y;
		this.radius = 20;
		this.color = color;
		this.id = id;
		this.edges = [];
	}

	draw(showId = false) {
		ctx.beginPath();
		ctx.fillStyle = this.color;
		ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
		ctx.fill();
		ctx.strokeStyle = "black";
		ctx.lineWidth = 1;
		ctx.stroke();

		if (showId && this.id >= 2) {
			ctx.fillStyle = "black";
			ctx.font = '20px serif';

			let adjustX = 5;
			if (this.id >= 100) { adjustX += 10; }
			else if (this.id >= 10) { adjustX += 5; }
			ctx.fillText(this.id, this.x - adjustX, this.y + 5);
		}
	}

	containsPoint(x, y) {
		return x >= this.x - this.radius && x <= this.x + this.radius
			&& y >= this.y - this.radius && y <= this.y + this.radius;
	}

	onWall(wall) {
		let upperLeftX = this.x - this.radius;
		let upperLeftY = this.y - this.radius;

		if (upperLeftX < wall.x + wall.width && upperLeftX + this.radius * 2 > wall.x &&
			upperLeftY < wall.y + wall.height && upperLeftY + this.radius * 2 > wall.y) {
			return true;
		}

		return false;
	}

	onAnyWall(walls) {
		for (let wall of walls) {
			if (this.onWall(wall)) {
				return true;
			}
		}
		return false;
	}

	inSphere(x, y, radius) {
		return this.x - this.radius < x + radius && this.x + this.radius > x - radius &&
			this.y - this.radius < y + radius && this.y + this.radius > y - radius;
	}
}