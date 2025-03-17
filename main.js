function hello() {
	alert("hello")
}


/**
 * 
 * @returns CanvasRenderingContext2D
 */
function getCanvasCtx() {
	const canvas = document.getElementById("game_canvas")
	if (canvas.getContext) {
		const ctx = canvas.getContext("2d")
		return ctx
	} else {
		console.error("Could not get canvas context.")
	}
}

/**
 * 
 * @param {number} pixelSize 
 * @param {Array.Array} items 
 */
function drawGrid(pixelSize, items) {
	ctx = getCanvasCtx()
	ctx.strokeStyle = 'lightgrey'
	ctx.lineWidth = 1
	ctx.fillStye = 'white'
	canvas = document.getElementById('game_canvas')
	ctx.clearRect(0,0,canvas.width, canvas.height)
	for (let i = 0; i < items.length; i++) {
		for (let j = 0; j < items[i].length; j++) {
			if (items[i][j]) {
				ctx.fillStye = 'black'
				ctx.fillRect(j*pixelSize, i*pixelSize, pixelSize, pixelSize)
			} else {
				ctx.fillStye = 'white'
				//ctx.fillRect(j*pixelSize, i*pixelSize, pixelSize, pixelSize)
			}
			ctx.strokeRect(j*pixelSize, i*pixelSize, pixelSize, pixelSize)
		}
	}
}

/**
 * 
 * @param {Array.Array} items 
 * @returns Array.Array
 */
function calculateNextState(items) {
	let newState = []
	for (let i = 0; i < items.length; i++) {
		let row = []
		for (let j = 0; j < items[i].length; j++) {
			row.push(nextPixelState(items, i, j))
		}
		newState.push(row)
	}
	return newState
}

/**
 * 
 * @param {Array.Array} items 
 * @param {number} i 
 * @param {number} j 
 */
function nextPixelState(items, i, j) {
	neighbours = countNeighbours(items, i, j)
	if (items[i][j]) {
		if (neighbours < 2) {
			return false
		}
		if (neighbours < 4) {
			return true
		}
		return false
	} else {
		if (neighbours == 3) {
			return true
		}
	}
	return false
}

/**
 * 
 * @param {Array.Array} items 
 * @param {number} i 
 * @param {number} j 
 */
function countNeighbours(items, i, j) {
	let neighbours = 0
	for (let x = -1; x < 2; x++){
		for (let y = -1; y < 2; y++) {
			if (x == 0 && y == 0) {
				continue
			} else {
				if (isInside(items, i+x, j+y) && items[i+x][j+y]) {
					neighbours++
				}
			}
		}
	}
	return neighbours
}

/**
 * 
 * @param {Array.Array} grid 
 * @param {number} i 
 * @param {number} j 
 * @returns 
 */
function isInside(grid, i, j) {
	const height= grid.length
	const width = grid[0].length
	if (i < 0) return false
	if (j < 0) return false
	if (i >= height) return false
	if (j >= width) return false
	return true
}

/**
 * 
 * @param {Array.Array} grid 
 * @param {Array} alive 
 */
function buildSeed(grid, alive) {
	alive.forEach(element => {
		grid[element.i][element.j] = true
	});
}

function setup() {
	console.debug("running setup")
	const height = 20
	const width = 40
	grid = []
	for (let i = 0; i < height; i++) {
		row = []
		for (let j = 0 ; j < width; j++) {
			row.push(false)
		}
		grid.push(row)
	}

	alive = [
	
		{i: 5, j: 3},
		/*{i: 13, j: 7},
		{i: 12, j: 7},
		{i: 11, j: 7},
		{i: 12, j: 9},
		{i: 11, j: 9},
		{i: 10, j: 9},
		{i: 11, j: 10},*/
	]

	buildSeed(grid, alive)
	drawGrid(20, grid)
	console.debug("setup complete")
	return grid
}

/**
 * 
 * @param {Array.Array} grid 
 */
async function run(grid) {
	while (true) {
		newGrid = calculateNextState(grid)
		drawGrid(20, newGrid)
		grid = newGrid
		await new Promise(r => setTimeout(r,100000))
	}
}

function update(){
	newGrid = calculateNextState(globalgrid)
	drawGrid(20,newGrid)
	globalgrid = newGrid
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function main() {
	grid = setup()
	drawGrid(20, grid)
	run(grid)
}
globalgrid = setup()
main()
