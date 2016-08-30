// create a perfect N*M maze

const inverseDir = { 'n': 's', 's': 'n', 'e': 'w', 'w': 'e' }

const Cell = function(x, y) {
  this.x = x
  this.y = y
  this.name = 'x' + x + 'y' + y
  this.visited = false
  this.symbol = ' '
  this.connections = [] // array of adjacent Cells
  this.connectionIx = [] // array of adjacent cell names i.e. 'x2y1'
  this.walls = [] // array of walled adjacent cell names i.e. 'x2y1'
  this.unblocked = [] // array of directions without walls i.e. ['w','s']

  this.visit = function() {
    this.visited = true
  }

  this.link = function(cell) {
    if (this.connectionIx.indexOf(cell.name) === -1) {
      this.walls.push(cell.name)
      cell.walls.push(this.name)
      this.connectionIx.push(cell.name)
      cell.connectionIx.push(this.name)
      this.connections.push(cell)
      cell.connections.push(this)
    }
  }

  this.unvisited = function() {
    return this.connections.filter(function unvisited(cell) {
      return !cell.visited
    })
  }

  this.randomUnvisited = function() {
    let unvisited = this.unvisited()
    if (unvisited.length === 0) {
      return -1
    }
    return unvisited[Math.floor(Math.random() * unvisited.length)]
  }

  this.tearWall = function(other_cell) {
    let wallIx = this.walls.indexOf(other_cell.name)
    other_cell.symbol = ' '
    if (other_cell.x === this.x + 1) {
      dir = 'e'
    }
    else if (other_cell.x === this.x - 1) {
      dir = 'w'
    }
    else if (other_cell.y === this.y + 1) {
      dir = 's'
    }
    else if (other_cell.y === this.y - 1) {
      dir = 'n'
    }
    this.unblocked.push(dir)
    other_cell.unblocked.push(inverseDir[dir])
  }

  this.knock = function() {
    this.visit()
    let exit_cell = this
    let unvisited_cell = this.randomUnvisited()
    while (unvisited_cell !== -1) {
      this.tearWall(unvisited_cell)
      exit_cell = unvisited_cell.knock()
      unvisited_cell = this.randomUnvisited()
    }
    return exit_cell
  }
}

const Maze = function(X, Y) {
  this.X = X
  this.Y = Y

  cleanBoard = function(X, Y) {
    let cells = []
    for (let x = 0; x <= X+1; x ++) {
      cells[x] = []
      for (let y = 0; y <= Y+1; y ++) {
        cells[x][y] = new Cell(x, y)
        if (x === 0 || y === 0 || x === X+1 || y === Y+1) {
          cells[x][y].visit()
        } else {
          if (x > 1) {
            cells[x][y].link(cells[x-1][y])
          }
          if (y > 1) {
            cells[x][y].link(cells[x][y-1])
          }
        }
      }
    }
    return cells
  }

  this.draw = function() {
    rows = []
    for (y = 0; y <= Y+1; y ++) {
      rows[y * 2] = ''
      rows[y * 2 + 1] = ''
      for (x = 0; x <= X+1; x ++) {
        let cell = this.cells[x][y]
        rows[y * 2] += cell.symbol
        if (cell.unblocked.indexOf('e') === -1) {
          rows[y * 2] += '|'
        } else {
          rows[y * 2] += ' '
        }
        if (cell.unblocked.indexOf('s') === -1) {
          rows[y * 2 + 1] += '-'
        } else {
          rows[y * 2 + 1] += ' '
        }
        rows[y * 2 + 1] += '+'
      }
      rows[y * 2] = rows[y * 2].slice(1, -2) // remove extra
      rows[y * 2 + 1] = rows[y * 2 + 1].slice(1, -2) // remove extra
    }
    rows.shift() // remove extra
    rows.pop() // remove extra
    rows.pop() // remove extra
    return rows.join('\n')
  }

  this.cells = cleanBoard(X, Y)
  let x = Math.ceil(Math.random() * X)
  let y = Math.ceil(Math.random() * Y)
  this.cells[x][y].knock().symbol = '>'
  this.cells[x][y].symbol = '<'
}


module.exports = Maze
// let maze = new Maze(5,5)
