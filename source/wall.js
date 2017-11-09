function Wall(x, y, width, height) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
}

Wall.prototype = {
	draw: function () {
		ctx.fillStyle = "#5CD9EF";
		ctx.lineWidth = 2;
		ctx.fillRect(this.x, this.y, this.width, this.height);
		ctx.fillStyle = "black";
		ctx.strokeStyle = "black";
		ctx.strokeRect(this.x, this.y, this.width, this.height);
	},

	containsPoint: function(x,y) {
		return x >= this.x && x <= this.x+this.width 
		&& y >= this.y && y <= this.y+this.height;
	},

	fixCoords: function() {
		if(this.width < 0) {
				this.x += this.width;
				this.width *= -1;
		}
		if(this.height < 0) {
			this.y += this.height;
			this.height *= -1;
		}
	}
}