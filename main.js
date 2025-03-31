class Conway {
	canvas
	ctx
	items
	constructor() {
		this.populationSize = 0
		this.iterations = 0
		this.isActive = false
		this.pixelSize = 10
		this.width = 80
		this.height = 40
		this.getCanvasCtx()
	}

	getCanvasCtx() {
		/** @type {HTMLCanvasElement} */
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
			for (let j = 0; j < this.items[i].length; j++) {
				row.push(this.nextPixelState(i, j))	
			}
			newState.push(row)
		}
		this.items = newState
		this.iterations++
		this.updateCounters()
	}

	updateCounters() {
		this.updatePopulationCounter()
		this.updateIterationCounter()
	}

	updatePopulationCounter() {
		const element = document.getElementById("population-counter")
		element.textContent= this.populationSize
	}

	updateIterationCounter() {
		const element = document.getElementById("iteration-counter")
		element.textContent= this.iterations
	}

	nextPixelState(i,j) {
		let neighbours = this.countNeighbours(i, j)
		if (this.items[i][j]) {
			// less than two neighbours, kill the cell
			if (neighbours < 2) {
				this.populationSize--
				return false
			}
			// 2 or 3 neighbours, keep the cell
			if (neighbours < 4) {
				return true
			}
			// more than 3 neughbours, kill the cell
			this.populationSize--
			return false
		} else {
			// three cells surrounding an empty space, create cell
			if (neighbours == 3) {
				this.populationSize++
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
			this.populationSize++
		})
	}

	setup(seed) {
		console.debug("running setup")
		this.setupControlButtons("btn-pause",'btn-unpause','btn-step')
		this.setupCanvasHandler()
		this.buildEmptyGrid()
		if (seed) {
			this.buildSeed(seed)
		}
		this.drawGrid()
		this.updateCounters()
		console.debug("setup complete")
	}

	setupCanvasHandler() {
		this.canvas.addEventListener('click', event => {
			const bounds = this.canvas.getBoundingClientRect()
			const scaleX = this.canvas.width/bounds.width
			const scaleY = this.canvas.height/bounds.height
			const x = Math.floor((event.clientX - bounds.left)*scaleX/this.pixelSize)
			const y = Math.floor((event.clientY - bounds.top)*scaleY/this.pixelSize)
			console.log(`(${x}, ${y})`)
			this.items[y][x] = !this.items[y][x]
			this.populationSize++
			this.drawGrid()
		})
		
	}

	/**
	 * Set the control buttons. Take the ids of the buttons
	 * @param {string} pause 
	 * @param {string} unpause 
	 * @param {string} step 
	 */
	setupControlButtons(pause, unpause, step) {
		document.getElementById(pause)
			.addEventListener('click', (e) => {this.pause()});
		
		document.getElementById(unpause)
			.addEventListener('click', (e) => {this.unpause()});
		
		document.getElementById(step)
			.addEventListener('click', (e) => {this.step()});


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
		console.log("Pausing")
		this.isActive = false
	}

	unpause() {
		console.log("Unpausing")
		this.isActive = true
	}


	step() {
		if (!this.isActive) {
			console.log("Stepping")
			this.calculateNextState()
			this.drawGrid()
		} else {
			console.log("Can't step while game is active!")
		}
	}

	async run() {
		while (true) {
			if (this.isActive) {
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

game = new Conway()
main()
