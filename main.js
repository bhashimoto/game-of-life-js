class Conway {
	canvas
	ctx
	items
	constructor() {
		this.active = false
		this.pixelSize = 10
		this.width = 80
		this.height = 40
		this.getCanvasCtx()
	}

	getCanvasCtx() {
		this.canvas = document.getElementById("game_canvas")
		if (this.canvas.getContext) {
			this.ctx = this.canvas.getContext("2d")
		} else {
			console.error("Could not get canvas context.")
		}
	}

	/**
	 * 
	 * @param {Array.Array} items 
	 */
	drawGrid() {
		this.ctx.strokeStyle = 'lightgrey'
		this.ctx.lineWidth = 1
		this.ctx.fillStye = 'white'
		// clear screen to redraw
		this.ctx.clearRect(0,0,this.canvas.width, this.canvas.height)
		for (let i = 0; i < this.items.length; i++) {
			for (let j = 0; j < this.items[i].length; j++) {
				if (this.items[i][j]) {
					// paint the square
					this.ctx.fillStye = 'black'
					this.ctx.fillRect(j*this.pixelSize, i*this.pixelSize, this.pixelSize, this.pixelSize)
				} 				
				// paint the borders
				this.ctx.strokeRect(j*this.pixelSize, i*this.pixelSize, this.pixelSize, this.pixelSize)
			}
		}
	}

	calculateNextState() {
		let newState = []
		for (let i = 0; i < this.items.length; i++) {
			let row = []
			for (let j = 0; j < this.items.length; j++) {
				row.push(this.nextPixelState(i, j))	
			}
			newState.push(row)
		}
		this.items = newState
	}

	nextPixelState(i,j) {
		let neighbours = this.countNeighbours(i, j)
		if (this.items[i][j]) {
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

	countNeighbours(i, j) {
		let neighbours = 0
		for (let x = -1; x < 2; x++) {
			for (let y = -1; y < 2; y++) {
				if (x == 0 && y == 0) {
					continue
				} else {
					if (this.isInside(i+x, j+y) && this.items[i+x][j+y]) {
						neighbours++
					}
				}
			}
		}
		return neighbours
	}

	isInside(i, j) {
		if (i < 0) return false
		if (j < 0) return false
		if (i >= this.height) return false
		if (j >= this.width) return false
		return true
	}

	buildSeed(seed) {
		this.buildEmptyGrid()
		seed.forEach(element => {
			this.items[element.y][element.x] = true
		})
	}

	setup(seed) {
		console.debug("running setup")
		this.buildEmptyGrid()
		if (seed) {
			this.buildSeed(seed)
		}
		this.drawGrid()
		console.debug("setup complete")
	}

	buildEmptyGrid() {
		this.items = []
		for (let i = 0; i < this.height; i++) {
			const row = []
			for (let j = 0; j < this.width; j++) {
				row.push(false)
			}
			this.items.push(row)
		}
	}

	pause() {
		this.active = false
	}

	unpause() {
		this.active = true
	}

	async run() {
		while (true) {
			if (this.active) {
				this.calculateNextState()
				this.drawGrid()
			}
			await new Promise(r => setTimeout(r, 100))
		}
	}
}



function main() {
	alive = [
		{y: 15, x: 3},
		{y: 15, x: 5},
		{y: 14, x: 5},
		{y: 13, x: 7},
		{y: 12, x: 7},
		{y: 11, x: 7},
		{y: 12, x: 9},
		{y: 11, x: 9},
		{y: 10, x: 9},
		{y: 11, x: 10},
	]
	game.setup(alive)

	game.run()
}
function pause() {
	console.log("pausing")
	game.pause()
}
function unpause() {
	console.log("unpausing")
	game.unpause()
}

game = new Conway()
main()
