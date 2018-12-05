import React, { Component } from 'react';
import GameBoard from './Components/GameBoard';
import Avatar from './Components/Avatar';
import Check from '@material-ui/icons/Done';
import Cross from '@material-ui/icons/Close';

class App extends Component {
  constructor(props){
    super(props);
    this.state={
      boardSize: 3,
      sizes: [3,4,5],
      currentAnimation: 'Wave',
      playerTurn: true,
      computerScore: 0,
      playerScore: 0
    }
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.changeAnimation = this.changeAnimation.bind(this);
    this.switchTurn = this.switchTurn.bind(this);
    this.updatePlayerScore = this.updatePlayerScore.bind(this);
    this.updateComputerScore = this.updateComputerScore.bind(this);
    this.reset = this.reset.bind(this);
  }

  handleSelectChange(e){
    this.setState({boardSize: e.target.value})
  }

  switchTurn(){
    this.setState({playerTurn: !this.state.playerTurn});
  }

  updatePlayerScore(){
    let {playerScore} = this.state;
    playerScore++;
    this.setState({playerScore})
  }

  updateComputerScore(){
    let {computerScore} = this.state;
    computerScore++;
    this.setState({computerScore});
  }

  changeAnimation(playerAnimation, computerAnimation){
    this.setState({playerAnimation, computerAnimation})
  }

  reset(){
    this.changeAnimation('Wave', 'Threaten')
    this.setState({currentAnimation: 'Wave', playerTurn: true })
  }

  render() {
    const {boardSize, sizes, playerAnimation, computerAnimation, playerTurn} = this.state;

    return (
      <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', position: 'absolute' }}>
        <div style={{position: 'absolute', top: '2rem', left: '10px'}}>
          <Avatar 
            currentAnimation={playerAnimation}
            model='Robot/RobotExpressive.glb'
            player='human'
            playerTurn={playerTurn}
          />
          {this.state.playerTurn &&
            <span style={{borderBottom: '2px solid dodgerblue', width: '10rem', position: 'absolute', top: '24rem', left: '11rem'}}></span>
          }
          <div style={{ position: 'absolute', left: '41%', fontSize: '30px', color: 'white'}}>
            Player <Check style={{position: 'absolute', left: '90px', top: '7px', width: '2rem', height: '2rem'}} />
            <span style={{display: 'block', position: 'absolute', left: '50%', top: '3rem'}} >{this.state.playerScore}</span>
          </div>
        </div>
        <div style={{position: 'absolute', top: '2rem', left: '50'}}>
          <div style={{position: 'absolute', width: boardSize*9+'rem', height: boardSize*9+'rem', left: '-15rem', marginTop: '2rem'}}>
            <GameBoard 
              boardSize={boardSize}
              changeAnimation={this.changeAnimation}
              playerTurn={playerTurn}
              updateComputerScore={this.updateComputerScore}
              updatePlayerScore={this.updatePlayerScore}
              switchTurn={this.switchTurn}
              reset={this.reset}
            />
          </div>
        </div>
        <div style={{position: 'absolute', top: '2rem', right: '10px'}}>
          <Avatar 
            currentAnimation={computerAnimation}
            model='iclone_7_raptoid_mascot_-_free_download/scene.gltf'
            player='computer'
            playerTurn={playerTurn}
          />
          {!this.state.playerTurn &&
            <span style={{borderBottom: '2px solid red', width: '10rem', position: 'absolute', top: '24rem', left: '13rem'}}></span>
          }
          <div style={{ position: 'absolute', left: '35%', fontSize: '30px', color: 'white'}}>
            Computer <Cross style={{position: 'absolute', left: '142px', top: '7px', width: '2rem', height: '2rem'}} />
            <span style={{display: 'block', position: 'absolute', left: '50%', top: '3rem'}} > {this.state.computerScore}</span>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
