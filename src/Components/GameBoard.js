import React, { Component } from 'react';
import Box from './Box'

class GameBoard extends Component{
  constructor(props){
    super(props);
    this.state = {
      board: []
    }
    this.initializeBoard = this.initializeBoard.bind(this);
    this.updateGameBoard = this.updateGameBoard.bind(this);
  }

  componentDidMount(){
    this.initializeBoard(this.props.boardSize)
  }

  componentWillReceiveProps(nextProps){
    if (this.props.boardSize !== nextProps.boardSize){
      this.initializeBoard(nextProps.boardSize)
    }
  }

  updateGameBoard(row, col){
    let {board} = this.state;
    if (this.props.activeTurn){
      board[row][col] = 'H'
    }
    else{
      board[row][col] = 'C'
    } 
    this.setState({board})
  }

  initializeBoard(boardSize){
    let board = new Array(boardSize);
    let count = 1;
    for (var i = 0; i < boardSize; i++){
      board[i] = new Array(boardSize)
    }
    for (var i = 0; i < boardSize; i++){
      for (var j = 0; j < boardSize; j++){
        board[i][j] = false;
        count ++;
      }
    }
    this.setState({board})

  }

  render(){
    const {board} = this.state;
    const {boardSize} = this.props;
    return(
      <div style={{ width: boardSize*9+'rem', height: boardSize*9+'rem', display: 'flex', justifyContent: 'center'}}>
        { board.map((rows,rowIndex) => {
          return(
            <div key={rowIndex} style={{position: 'absolute', width: '100%'}}> 
              {rows.map((val, colIndex) => {
                return(
                  <Box 
                    row={rowIndex}
                    col={colIndex}
                    changeAnimation={this.props.changeAnimation}
                    switchTurn={this.props.switchTurn}
                    activeTurn={this.props.activeTurn}
                    value={val}
                    updateGameBoard={this.updateGameBoard}
                  />
                )
              })}
            </div>
          )
        }) }
      </div>
    )
  }
}

export default GameBoard;