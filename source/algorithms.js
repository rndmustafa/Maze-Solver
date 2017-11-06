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