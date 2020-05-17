const grid = document.getElementById("grid")
const gridSize = 10
grid.style.gridTemplateColumns = `repeat(${gridSize}, auto)`;
grid.style.gridTemplatRows = `repeat(${gridSize}, auto)`;
var start
var finish
let brush
var adjacencyMatrix = new Array(gridSize)

const changeBrushSelectionListener = document.querySelectorAll('input[name="brush"]').forEach(function (el) {
  el.addEventListener("change",  function () {
    brush = this.value
  })
})

const startClickListener = document.getElementById("start").addEventListener("click", function() {
  let path;
  path = bfs({x:1, y:0},{x:9, y:4}).then((x) => {
    var i = 1;
    while (i < x.length) {
      moveElement(adjacencyMatrix[x[i - 1].y][x[i-1].x], adjacencyMatrix[x[i].y][x[i].x])
      i++
    }
  })
})

function getPair(x, y) {
  return {x:x, y:y}
}

function equals(p1, p2) {
  if (p1.x == p2.x && p1.y == p2.y) {
    return true
  } else {
    return false
  }
}

function isValidCoord(coordinatePair) {
  let y = coordinatePair.y
  let x = coordinatePair.x

  if (x >= 0 && y >= 0 && x < gridSize && y < gridSize && adjacencyMatrix[y][x].getAttribute("state") != "wall") {
    return true
  }

  return false
}



function computeKey(pair) {
  return pair.x + ", " + pair.y
}

function getPath(lastChild, startCoordinatePair, parentMap) {
  let path = []
  let currPair = lastChild
  console.log("getPath", parentMap);

  while (currPair !== undefined && computeKey(currPair) !==
        computeKey(startCoordinatePair)) {
    path.push(currPair)
    currPair = parentMap[computeKey(currPair)]
    console.log(currPair)
  }

  return path;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function bfs(startCoordinatePair, endCoordinatePair) {
  let colors = ["red", "green", "blue", "orange", "magenta"]
  let c = 0;
  let q = []
  let visited = {}
  let parentMap = {}
  q.push(startCoordinatePair)

  while (q.length != 0) {
    c = (c + 1) % colors.length;
    await sleep(2);
    currPair = q.shift()


    if (computeKey(currPair) == computeKey(endCoordinatePair)) {
      return getPath(currPair, startCoordinatePair, parentMap)
    }

    let pairs = [getPair(currPair.x, currPair.y + 1),
                getPair(currPair.x, currPair.y - 1),
                getPair(currPair.x + 1, currPair.y),
                getPair(currPair.x - 1, currPair.y),
                getPair(currPair.x + 1, currPair.y + 1),
                getPair(currPair.x - 1, currPair.y - 1),
                getPair(currPair.x + 1, currPair.y - 1),
                getPair(currPair.x - 1, currPair.y + 1)]

    for (let i = 0; i < pairs.length; i++) {
      if (isValidCoord(pairs[i]) && visited[computeKey(pairs[i])] === undefined) {
        console.log(pairs[i], !visited[computeKey(pairs[i])])
        visited[computeKey(pairs[i])] = true
        adjacencyMatrix[pairs[i].y][pairs[i].x].style.backgroundColor = colors[c];
        q.push(pairs[i])
        parentMap[computeKey(pairs[i])] = currPair
      }
    }
  }
}

function moveElement(fromElement, toElement) {
  fromElement.style.backgroundColor = "white"
  toElement.style.backgroundImage = 'url(../src/dude.bmp)'
}

for (let y = 0; y < gridSize; y++) {
  adjacencyMatrix[y] = new Array(gridSize)
  for (let x = 0; x < gridSize; x++) {

    let gridElement = document.createElement("div")
    adjacencyMatrix[y][x] = gridElement
    gridElement.style.backgroundColor = "white"
    gridElement.style.cursor = "pointer"

    gridElement.onclick = () => {
      switch (brush) {
        case "wall":
          gridElement.style.backgroundImage = 'url(../src/wall.bmp)'
          gridElement.setAttribute("state", "wall");
          break

        case "begin":
          if (start) {
            start.style.backgroundColor = "white"
          }
          start = gridElement
          gridElement.style.backgroundColor = "blue"
          gridElement.setAttribute("state", "start");
          break
//bug
        case "finish":
          if (finish) {
            finish.style.backgroundColor = "white"
          }
          finish = gridElement
          gridElement.style.backgroundColor = 'red'
          gridElement.setAttribute("state", "finish");
          break
      }
    }

  grid.appendChild(gridElement)
  }
}


