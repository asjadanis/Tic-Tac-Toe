import React, { Component } from 'react';
import GameBoard from './Components/GameBoard';
import Avatar from './Components/Avatar';

class App extends Component {
  constructor(props){
    super(props);
    this.state={
      boardSize: 3,
      sizes: [3,4,5],
      currentAnimation: 'Wave',
      playerTurn: true
    }
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.changeAnimation = this.changeAnimation.bind(this);
    this.switchTurn = this.switchTurn.bind(this);
  }

  handleSelectChange(e){
    this.setState({boardSize: e.target.value})
  }

  switchTurn(){
    this.setState({playerTurn: !this.state.playerTurn});
  }

  changeAnimation(playerAnimation, computerAnimation){
    this.setState({playerAnimation, computerAnimation})
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
            activeTurn={playerTurn}
          />
          {this.state.playerTurn &&
            <span style={{borderBottom: '2px solid dodgerblue', width: '10rem', position: 'absolute', top: '24rem', left: '11rem'}}></span>
          }
        </div>
        <div style={{position: 'absolute', top: '2rem', left: '50'}}>
          <div style={{position: 'absolute', width: boardSize*9+'rem', height: boardSize*9+'rem', left: '-15rem', marginTop: '2rem'}}>
            <GameBoard 
              boardSize={boardSize}
              changeAnimation={this.changeAnimation}
              activeTurn={playerTurn}
              switchTurn={this.switchTurn}
            />
          </div>
        </div>
        <div style={{position: 'absolute', top: '2rem', right: '10px'}}>
          <Avatar 
            currentAnimation={computerAnimation}
            model='iclone_7_raptoid_mascot_-_free_download/scene.gltf'
            player='computer'
            activeTurn={playerTurn}
          />
          {!this.state.playerTurn &&
            <span style={{borderBottom: '2px solid dodgerblue', width: '10rem', position: 'absolute', top: '24rem', left: '13rem'}}></span>
          }
        </div>
        <div>

        </div>
      </div>
    );
  }
}

export default App;
