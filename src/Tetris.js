import React from 'react'

import pieces from './pieces'


const GAME_GRID_WIDTH = 10
const GAME_GRID_HEIGHT = 20

class Tetris extends React.Component {

  constructor(props) {
    super(props)
    this.initiatePieces()
    this.start()
    this.onKeyPress = this.onKeyPress.bind(this)
  }

  copyStruct(grid) {
    return JSON.parse(JSON.stringify(grid))
  }

  initiatePieces() {
    this.piece = pieces
  }

  componentDidMount() {
    document.onkeypress = this.onKeyPress
    this.gameInterval = setInterval(() => {
      this.update()
    }, 300)
  }

  togglePause() {
    const {paused, fallingPiece, gameOver} = this.state
    if (gameOver) return
    if (paused) {
      this.setState({paused: false})
      this.props.setNextPiece(fallingPiece)
    } else {
      this.setState({paused: true})
      this.props.setNextPiece('Paused')
    }
  }

  start() {
    this.state = {
      gameGrid: this.generateEmptyGameGrid(),
      gameGridRender: null,
      fallingPiece: null,
      fallingPiecePos: null,
      fallingPieceRotation: 0,
      nextPiece: this.piece[Math.floor(Math.random() * this.piece.length)],
      score: 0,
      gameOver: false,
      paused: false
    }
    this.props.setScore(0)
  }

  generateEmptyGameGrid() {
    // var row = new Array(GAME_GRID_WIDTH).fill(0)
    // return new Array(GAME_GRID_HEIGHT).fill(row)
    // Why does this make every row the same? (reference?)

    var gameGrid = []
    gameGrid.push([-1, -1, -1, -1, -1, -1, -1 , -1, -1, -1, -1, -1])
    for (var i = 0; i < GAME_GRID_HEIGHT; i++) {
      var row = []
      for (var j = 0; j < GAME_GRID_WIDTH; j++) {
        row.push(0)
      }
      gameGrid.push([-1, ...row, -1])
    }
    gameGrid.push([-1, -1, -1, -1, -1, -1, -1 , -1, -1, -1, -1, -1])
    return gameGrid
  }

  update() {
    const {fallingPiece, gameOver, paused} = this.state
    if (gameOver || paused) return
    if (!fallingPiece) {
      this.createNewPiece()
    } else {
      this.moveFallingPiece('down')
    }

  }

  createNewPiece() {
    var newPiece = this.state.nextPiece
    const nextPiece = this.piece[Math.floor(Math.random() * this.piece.length)]
    this.setState({
      fallingPiece: newPiece,
      fallingPiecePos: {x: 5, y: 0},
      fallingPieceRotation: 0,
      nextPiece: nextPiece
    })
    this.props.setNextPiece(nextPiece)
    this.update()
  }

  removeEmptyRows(matrix) {
    return matrix.filter((row) => {
      return row.reduce((a, b) => a + b, 0) > 0
    })
  }

  moveFallingPiece(dir) {
    var {fallingPiece, fallingPieceRotation} = this.state
    var fallingPiecePos = this.copyStruct(this.state.fallingPiecePos)
    if (!fallingPiece) return
    switch (dir) {
      case 'down': fallingPiecePos.y++; break
      case 'left': fallingPiecePos.x--; break
      case 'right': fallingPiecePos.x++; break
      case 'rotate':
        fallingPieceRotation = (fallingPieceRotation + 1) % fallingPiece.length
        break
    }
    this.validateGridUpdate(fallingPiecePos, fallingPieceRotation, dir)
  }

  validateGridUpdate(fallingPiecePos, fallingPieceRotation, dir) {
    var {
      gameGrid,
      gameGridRender,
      fallingPiece
    } = this.state
    gameGrid = this.copyStruct(gameGrid)
    fallingPiece = this.removeEmptyRows(fallingPiece[fallingPieceRotation])

    for (var y = 0; y < fallingPiece.length; y++) {
      for (var x = 0; x < fallingPiece[y].length; x++) {
        var pieceTile = fallingPiece[y][x]
        var gridTile = gameGrid[y + fallingPiecePos.y][x + fallingPiecePos.x]
        if (pieceTile != 0) {
          if (gridTile == 0) {
            gameGrid[y + fallingPiecePos.y][x + fallingPiecePos.x] = pieceTile
          } else {
            if (fallingPiecePos.y == 1) {
              this.setState({gameOver: true})
              this.props.setNextPiece('Game Over')
              return
            }
            this.handleMoveValidationFail(dir)
            return
          }
        }
      }
    }
    this.handleMoveValidationSuccess(
      gameGrid,
      fallingPiecePos,
      fallingPieceRotation
    )

  }

  handleMoveValidationSuccess(gameGrid, fallingPiecePos, fallingPieceRotation) {
    this.setState({
      gameGridRender: gameGrid,
      fallingPiecePos: fallingPiecePos,
      fallingPieceRotation: fallingPieceRotation
    })
  }

  handleMoveValidationFail(dir) {
    const {gameGridRender} = this.state
    switch(dir) {
      case 'down':
        this.setState({
          fallingPiece: null
        })
        this.updateRows(this.copyStruct(gameGridRender))
        break
    }
  }

  updateRows(gameGrid) {
    var updatedGrid = gameGrid.filter((row, index, gameGrid) => {
      return row.indexOf(0) != -1 || index == 0 || index == gameGrid.length - 1
    })
    var rowsDeleted = gameGrid.length - updatedGrid.length
    for (var i = 0; i < rowsDeleted; i++) {
      updatedGrid.splice(1, 0, [-1,0,0,0,0,0,0,0,0,0,0,-1])
    }
    this.updateScore(rowsDeleted)
    this.setState({gameGrid: updatedGrid})
  }

  updateScore(rows) {
    var {score} = this.state
    switch (rows) {
      case 1: score+= 100; break
      case 2: score+= 300; break
      case 3: score+= 500; break
      case 4: score+= 800; break
    }
    this.setState({score: score})
    this.props.setScore(score)
  }


  renderGameGrid() {
    const {gameGridRender} = this.state
    if (!gameGridRender) return
    return gameGridRender.map((row) => {
      return row.map((tile) => {
        if (tile == -1) return null
        return (
          <div className={"tile t" + tile}/>
        )
      })
    })
  }

  onKeyPress(e) {
    switch (e.key) {
      case 'w':
      case 'ArrowUp':
        this.moveFallingPiece('rotate')
        break
      case 'a':
      case 'ArrowLeft':
        this.moveFallingPiece('left')
        break
      case 's':
      case 'ArrowDown':
        this.moveFallingPiece('down')
        break
      case 'd':
      case 'ArrowRight':
        this.moveFallingPiece('right')
        break
      case 'r':
        this.start()
        break
      case 'p':
        this.togglePause()
        break
    }
  }

  render() {
    return (
      <div className='tetris-game'>
        {this.renderGameGrid()}
      </div>
    )
  }
}

export default Tetris
