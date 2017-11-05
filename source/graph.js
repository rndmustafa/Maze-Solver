function Graph() {
	//Index of node and id are the same 
	//e.g. Node with id 3 is in index 3. 
	this.nodes = [];
	this.maxDistance = 125;
}

Graph.prototype = {
	addNode: function(node) {
		this.nodes.push(node);
	},

	addEdge: function(node1, node2) {
		node1.edges.push(node2);
	},

	createNodes: function(startNodeX, startNodeY, endNodeX, endNodeY, walls) {
		let area = 0;
		for(let wall of walls) {
			area += wall.width*wall.height;
		}
		let wallRatio = area / (canvas.width * canvas.height);
		let distance = this.maxDistance * (1-wallRatio);
		
		for(let i = 25; i < canvas.height; i += distance) {
			for(let j = 30; j < canvas.width; j += distance) {
				let node = new Node(j, i, "yellow", this.nodes.length);
				let fail = false;

				for(let wall of walls) {
					if(node.onWall(wall)) {
						fail = true;
						break;
					}
				}

				if(!fail) {
					this.addNode(node);
				}
			}
		}
	},

	linkNodes: function(walls) {
		for(let node of this.nodes) {
			let neighbors = this.allNodesInSphere(node.x,node.y,this.maxDistance,node.id);

			for(let neighbor of neighbors) {
				if(this.validEdge(node, neighbor, walls)) {
					this.addEdge(node, neighbor);
				}
			}
		}
	},

	validEdge: function(node1, node2, walls) {
		for(let wall of walls) {
			if( wall.x <= Math.max(node1.x,node2.x) && wall.x+wall.width >= Math.min(node1.x,node2.x) 
		     && wall.y <= Math.max(node1.y,node2.y) && wall.y+wall.height >= Math.min(node1.y,node2.y) ) {
					 return false;
				 }
		}

		/*
		let slope = (node2.y - node1.y)/(node2.x - node1.x);
		if(slope == Infinity || slope == -Infinity) {
			slope = 0;
		}
		let b = -node1.x*slope + node1.y;

		let line; 
		if(slope == 0 && node2.x - node1.x == 0) {
			line = {vertical: node1.x};
		}
		else {
			line = {slope, b}; 
		}

		for (let wall of walls) {
			//left side and right sides
			if (this.verticalLineCollision(line, wall.x, wall, node1, node2) ||
				this.verticalLineCollision(line, wall.x + wall.width, wall, node1, node2)) {
				return false;
			}
			//top and bottom
			if (this.horizontalLineCollision(line, wall.y, wall, node1, node2) ||
				this.horizontalLineCollision(line, wall.y + wall.height, wall, node1, node2)) {
				return false;
			}
		}
		*/

		return true;
	},

	horizontalLineCollision: function (line, wallLineY, wall, node1, node2) {
		if (line.vertical === undefined) {
			let point = line.slope * wall.x + line.b;
			if (point <= wall.y + wall.height && point >= wall.y &&
				wallLineY >= Math.min(node1.y, node2.y) && wallLineY <= Math.max(node1.y, node2.y)) {
				return true;
			}
		}
		else {

		}

		return false;
	},

	verticalLineCollision: function(line, wallLineX, wall, node1, node2) {
		if(line.vertical === undefined) {
			let point = line.slope*wallLineX + line.b;
			if(point <= wall.y+wall.height && point >= wall.y && 
				 wallLineX >= Math.min(node1.x,node2.x) && wallLineX <= Math.max(node1.x,node2.x)) {
				return true;
			}
		}
		else {
			if(wallLineX == line.vertical && Math.min(node1.y,node2.y) <= wall.y 
				 && Math.max(node1.y,node2.y) >= wall.y+wall.height) {
				return true;
			}
		}

		return false;
	},

	allNodesInSphere: function(x,y,radius,excludingNodeId) {
		let nodeList = [];
		for(let node of this.nodes) {
			if(node.inSphere(x,y,radius) && node.id != excludingNodeId) {
				nodeList.push(node);
			}
		}
		return nodeList;
	},

	draw: function() {
		for(let i = 0; i < this.nodes.length; i++) {
			for(let neighbor of this.nodes[i].edges) {
				if(neighbor.id > i) {
					this.drawLine(this.nodes[i].x, this.nodes[i].y, neighbor.x, neighbor.y);
				}
			}
		}

		for(let i = this.nodes.length-1; i >= 0; i--) {
			this.nodes[i].draw();
		}
	},

	drawLine: function(x1, y1, x2, y2) {
		ctx.beginPath();
		ctx.strokeStyle = "yellow";
		ctx.moveTo(x1,y1);
		ctx.lineTo(x2,y2);
		ctx.stroke();
	}

}