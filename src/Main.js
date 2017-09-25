import React from 'react'

import Tetris from './Tetris'

class Main extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      score: 0,
      nextPiece: null
    }
    this.setScore = this.setScore.bind(this)
    this.setNextPiece = this.setNextPiece.bind(this)
  }

  setNextPiece(tetrimino) {
    this.setState({nextPiece: tetrimino})
  }

  setScore(score) {
    this.setState({score: score})
  }

  renderNextPiece() {
    const {nextPiece} = this.state
    if (!nextPiece) return
    if (nextPiece == 'Game Over' || nextPiece == 'Paused') {
      return(
        <div className='game-over'>
          {nextPiece}
        </div>
      )
    }
    return nextPiece[0].map((row, y) => {
      var startCol = row.length > 3 ? 2 : 3
      return row.map((tile, x) => {
        return (
          <div
            className={"tile t" + tile}
            style={{
              gridColumn: startCol + x,
              gridRow: 2 + y
            }}
          />
        )
      })
    })
  }


  render() {
    return (
      <div className='main-container'>
        <div className='tetris-game-container'>
          <Tetris
            setScore={this.setScore}
            setNextPiece={this.setNextPiece}
          />
        </div>
        <div className='tetris-score'>
          <span className='score-text'>
            {this.state.score}
          </span>
        </div>
        <div className='shortcuts'>
          P - Pause
          <br/>
          R - Restart
        </div>
        <div className='tetris-nextpiece'>
          {this.renderNextPiece()}
        </div>
      </div>
    )
  }
}

export default Main
