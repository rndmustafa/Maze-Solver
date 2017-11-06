function breadthFirstSearch(start, end, graph) {
  let frontier = []; //used as a queue
  let discovered = [];
  let cameFrom = new Map();

  cameFrom.set(start, null);
  frontier.push(start);

  while(frontier.length) {
    let current = frontier.shift();

    if(current == end) {
      let path = getPath(current, cameFrom);
      return {discovered, path};
    }

    for(let child of current.edges) {
      if(discovered.includes(child)) {
        continue;
      }

      if(!frontier.includes(child)) {
        cameFrom.set(child, current);
        frontier.push(child);
      }
    }

    discovered.push(current);
  }

  return {discovered, path:[]};
}

function depthFirstSearch(start,end, graph) {
  let frontier = []; //used as a stack
  let discovered = [];
  let cameFrom = new Map();

  cameFrom.set(start, null);
  frontier.push(start);

  while(frontier.length) {
    let current = frontier.pop();

    if(current == end) {
      let path = getPath(current, cameFrom);
      return {discovered, path};
    }

    for(let child of current.edges) {
      if(discovered.includes(child)) {
        continue;
      }

      if(!frontier.includes(child)) {
        cameFrom.set(child, current);
        frontier.push(child);
      }
    }

    discovered.push(current);
  }

  return {discovered, path:[]};  
}

function aStarSearch(start, end, graph) {
  let discovered = [];
  let frontier = [start];
  let cameFrom = new Map();
  cameFrom.set(start,null);

  let gScore = new Map();
  gScore.set(start,0);
  let fScore = new Map();
  fScore.set(start, distance(start,end));

  while(frontier.length) {
    let current = getLowestScore(frontier, fScore);
    frontier.splice(frontier.indexOf(current), 1);

    if(current == end) {
      let path = getPath(current, cameFrom);
      return {discovered, path};
    }

    discovered.push(current);

    for(let child of current.edges) {
      if(discovered.includes(child)) {
        continue;
      }

      if(!frontier.includes(child)) {
        frontier.push(child);
      }

      let maybeGScore = gScore.get(current) + distance(current,child);
      if(maybeGScore >= gScore.get(child)) {
        continue;
      }

      cameFrom.set(child,current);
      gScore.set(child, maybeGScore);
      fScore.set(child, gScore.get(child) + distance(child, end));
    }
  }

  return {discovered, path:[]};

}

function getLowestScore(frontier, score) {
  let min;
  for(let node of frontier) {
    if(min === undefined || score.get(node) < score.get(min)) {
      min = node;
    }
  }
  return min;
}

function getPath(node, cameFrom) {
  let path = [];
  path.push(node);

  let current = node;
  while(true) {
    let parent = cameFrom.get(current);

    if(parent == null) {
      break;
    }

    path.push(parent);
    current = parent;
  }

  path.reverse();
  return path;
}

function distance(node1,node2) {
  return Math.sqrt( (node1.x-node2.x)**2 + (node1.y-node2.y)**2 );
}