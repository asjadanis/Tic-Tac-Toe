import React, { Component } from 'react';
import Box from './Box';
import Button from '@material-ui/core/Button';
import GameTree from './GameTree';
class GameBoard extends Component{
  constructor(props){
    super(props);
    this.state = {
      board: [],
      boardSize: props.boardSize,
      row: -1,
      col: -1,
      human: 'H',
      computer: 'C', 
      terminated: false,
      showGameTree: false,
    }
    this.initializeBoard = this.initializeBoard.bind(this);
    this.updateGameBoard = this.updateGameBoard.bind(this);
    this.isMovesRemaining = this.isMovesRemaining.bind(this);
    this.evaluateGameBoard = this.evaluateGameBoard.bind(this);
    this.calculateBestMove = this.calculateBestMove.bind(this);
    this.miniMax = this.miniMax.bind(this);
    this.reset = this.reset.bind(this);
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
    if (this.isMovesRemaining(this.state.board)){
      if (this.props.playerTurn){
        if (!this.state.showGameTree){
          this.state.showGameTree = true;
        }
        this.state.board[row][col] = this.state.human;
      }
      else{
        this.state.board[row][col] = this.state.computer;
      }
      let gameScore = this.evaluateGameBoard(this.state.board);
      if (gameScore === 10){
        this.setState({terminated: true})
        this.props.changeAnimation('Death', 'Run_L');
        this.props.updateComputerScore();
      }
      else if (gameScore === -10){
        this.setState({terminated: true})
        this.props.changeAnimation('Jump', 'back');
        this.props.updatePlayerScore();
      }
      if (gameScore === 0 && this.isMovesRemaining(this.state.board)){
        this.props.switchTurn();
      }
      if (!this.isMovesRemaining(this.state.board)){
        this.props.changeAnimation('Jump', 'back')
      }
    }
    else{
      this.setState({terminated: true})
    }
  }

  isMovesRemaining(board){
    let boardSize = this.props.boardSize;
    for (let i = 0; i < boardSize; i++){
      for (let j = 0; j < boardSize; j++){
        if (!board[i][j]){
          return true;
        }
      }
    }
    return false;
  }

  evaluateGameBoard(board){
    let boardSize = this.props.boardSize
    let i = 0;
    for (i = 0; i < boardSize; i++){
      if ( (board[i][0] === board[i][1]) && (board[i][1] === board[i][2]) && (board[i][0]) ){
        if (board[i][0] === this.state.computer){
          return +10;
        }
        else if (board[i][0] === this.state.human){
          return -10;
        }
      }
    }
    for (i = 0; i < boardSize; i++){
      if ( (board[0][i] === board[1][i]) && (board[1][i] === board[2][i]) && (board[0][i]) ){
        if (board[0][i] === this.state.computer){
          return +10;
        }
        else if (board[0][i] === this.state.human){
          return -10;
        }
      }
    }
    if ( (board[0][0] === board[1][1]) && (board[1][1] === board[2][2]) && (board[0][0]) ){
      if (board[0][0] === this.state.computer){
        return +10;
      }
      if (board[0][0] === this.state.human){
        return -10;
      }
    }
    if ( (board[0][2] === board[1][1]) && (board[1][1] === board[2][0]) && (board[2][0]) ){
      if (board[2][0] === this.state.computer){
        return +10;
      }
      if (board[2][0] === this.state.human){
        return -10;
      }
    }
    return 0
  }

  miniMax(board, depth, isMaximizer){
    let gameScore = this.evaluateGameBoard(board);
    // smarter AI by ensuring to choose its own winnning move first rather then blocking player
    if (gameScore === 10){ 
      return gameScore - depth;
    }
    else if (gameScore === -10){
      return gameScore + depth
    }
    // AI Always attempts to make user not win even if it is winning
    // if (gameScore === 10 || gameScore === -10){
    //   return gameScore;
    // }
    if (!this.isMovesRemaining(board)){
      return 0;
    }
    if (isMaximizer){
      let bestMove = -1000;
      for (let i = 0; i < this.props.boardSize; i++){
        for (let j = 0; j < this.props.boardSize; j++){
          if (!board[i][j]){
            board[i][j] = this.state.computer;
            bestMove = Math.max(bestMove, this.miniMax(board, depth+1, !isMaximizer));
            board[i][j] = false;
          }
        }
      }
      return bestMove;
    }
    else{
      let bestMove = 1000;
      for (let i = 0; i < this.props.boardSize; i++){
        for (let j = 0; j < this.props.boardSize; j++){
          if (!board[i][j]){
            board[i][j] = this.state.human;
            bestMove = Math.min(bestMove, this.miniMax(board, depth+1, !isMaximizer));
            board[i][j] = false;
          }
        }
      }
      return bestMove;
    }
  }

  calculateBestMove(board){
    let bestMove = -1000;
    let row, col = -1;
    for (let i = 0; i < this.props.boardSize; i++){
      for (let j = 0; j < this.props.boardSize; j++){
        if (!board[i][j]){
          board[i][j] = this.state.computer;
          let move = this.miniMax(board, 0, false);
          board[i][j] = false
          if (move > bestMove){
            row = i;
            col = j;
            bestMove = move;
          }
        }
      }
    }
    return [ row , col];
  }

  initializeBoard(boardSize){
    let board = new Array(boardSize);
    for (let i = 0; i < boardSize; i++){
      board[i] = new Array(boardSize)
    }
    for (let i = 0; i < boardSize; i++){
      for (let j = 0; j < boardSize; j++){
        board[i][j] = false;
      }
    }
    this.setState({board, terminated: false, showGameTree: false})
  }

  reset(){
    this.initializeBoard(this.props.boardSize);
    this.props.reset()
  }


  render(){
    const {board, terminated, showGameTree} = this.state;
    const {boardSize} = this.props;
    let computerMove = null;
    if (!this.props.playerTurn && !terminated){
      computerMove = this.calculateBestMove(board);
      this.updateGameBoard(computerMove[0], computerMove[1]);
    }
    return(
      <div style={{ width: boardSize*9+'rem', height: boardSize*9+'rem', display: 'flex', justifyContent: 'center'}}>
        { board.map((rows,rowIndex) => {
          return(
            <div key={rowIndex} style={{position: 'absolute', width: '100%'}}> 
              {rows.map((val, colIndex) => {
                return(
                  <Box 
                    ref={(box) => { this.box = box }}
                    row={rowIndex}
                    col={colIndex}
                    changeAnimation={this.props.changeAnimation}
                    switchTurn={this.props.switchTurn}
                    playerTurn={this.props.playerTurn}
                    value={val}
                    updateGameBoard={this.updateGameBoard}
                    computerMove={computerMove}
                    terminated={terminated}
                  />
                )
              })}
            </div>
          )
        }) }
        <div style={{ position: 'absolute', left: '40%'}}>
          <Button variant="contained" color="primary" onClick={this.reset}>
            Play Again
          </Button>
        </div>
        {/* {board && board.length > 0 && showGameTree &&
          <GameTree 
            gameBoard={board}
            evaluateGameBoard={this.evaluateGameBoard}
            isMovesRemaining={this.isMovesRemaining}
          />
        } */}
      </div>
    )
  }
}

export default GameBoard;