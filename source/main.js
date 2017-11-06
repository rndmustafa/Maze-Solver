function loop() {
	ctx.fillStyle = 'grey';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

	for(let wall of walls) {
		wall.draw();
	}

	graph.draw();

	requestAnimationFrame(loop);
}

function reset(){
	if(state == "create"){
		walls = [];
	}
	else if(state == "searching") {
		state = "create";
		graph.nodes = [startNode, endNode];
		startNode.edges = [];
		endNode.edges = [];
	}
}

function startSearch() {
	if (state == "create") {
		//graph.maxDistance = parseInt(prompt("Max Distance"));
		state = "searching";
		graph.createNodes(startNode.x, startNode.y,
			endNode.x, endNode.y, walls);
		graph.linkNodes(walls);
	}
	else if (state == "searching") {
		graph.resetColors();
	}

	let algo = document.getElementById("dropdown").value;
	let searchInfo;
	switch (algo) {
		case "Breadth First Search":
			searchInfo = breadthFirstSearch(startNode, endNode, graph);
			break;

		case "Depth First Search":
			searchInfo = depthFirstSearch(startNode, endNode, graph);
			break;
	}

	if (searchInfo != undefined && searchInfo.discovered.length > 1) {
		colorNodes(searchInfo.discovered, "rgba(50,205,50,0.8)", 1);
		setTimeout(function () { colorNodes(searchInfo.path, "grey", 1); }, (animationSpeed + 20) * searchInfo.discovered.length);
	}

}

function colorNodes(nodeList, color, index) {
	if(nodeList[index] != endNode) nodeList[index].color = color;
	if(index < nodeList.length-1) {
		setTimeout(function(){
			colorNodes(nodeList, color, index+1);
		}, animationSpeed);
	}
}


let canvas = document.querySelector('canvas');
let ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

canvas.onmousedown = function (event) {
	switch (state) {
		case "create":
			if (event.button == 0) {
				for (let wall of walls) {
					if (wall.containsPoint(event.clientX, event.clientY)) {
						dragging = { entity: wall, oldX: event.clientX, oldY: event.clientY };
						return true;
					}
				}

				if(startNode.containsPoint(event.clientX, event.clientY)){
					dragging = {entity: startNode, oldX: event.clientX, oldY: event.clientY };
					return true;
				}
				if(endNode.containsPoint(event.clientX, event.clientY)){
					dragging = {entity: endNode, oldX: event.clientX, oldY: event.clientY };
					return true;
				}

				creatingWall = new Wall(event.clientX, event.clientY, 0, 0);
				walls.push(creatingWall);
			}
			else if(event.button == 2) {
				for (let wall of walls) {
					if (wall.containsPoint(event.clientX, event.clientY)) {
						walls.splice(walls.indexOf(wall), 1);
						return true;
					}
				}
			}
			break;
	}
}

canvas.onmousemove = function (event) {
	switch (state) {
		case "create":
			if(creatingWall) {
				creatingWall.width = event.clientX - creatingWall.x;
				creatingWall.height = event.clientY - creatingWall.y;
			}
			else if(dragging) {
				dragging.entity.x += event.clientX - dragging.oldX;
				dragging.entity.y += event.clientY - dragging.oldY;
				dragging.oldX = event.clientX;
				dragging.oldY = event.clientY;
			}
			break;


	}
}

canvas.onmouseup = function(event) {
	switch(state){
		case "create":
			if(creatingWall) {
				creatingWall.fixCoords();
				creatingWall = null;
			}
			dragging = null;
			break;
	}
}

let state = "create";

let creatingWall = null;
let dragging = null;
let walls = [];

let graph = new Graph();
let startNode = new Node(canvas.width/2, canvas.height/2, "green", 0);
let endNode = new Node(canvas.width/2, canvas.height/2-60, "red", 1);
graph.addNode(startNode);
graph.addNode(endNode);

const animationSpeed = 50;

loop();