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
		return true;
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
	},

	resetColors: function() {
		for(let i = 2; i < this.nodes.length; i++) {
			this.nodes[i].color = "yellow";
		}
	}

}