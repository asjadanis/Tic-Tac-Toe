import React, { Component } from 'react';
import Check from '@material-ui/icons/Done';
import Cross from '@material-ui/icons/Close';
import {boxStyles, iconStyles} from './styles'
import '../App.css'

class Box extends Component{
  constructor(props){
    super(props);
    this.state = {
      clicked: false
    }
    this.handleMouseOver = this.handleMouseOver.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.handleMouseClick = this.handleMouseClick.bind(this);
  }

  handleMouseOver(e){
    if (!this.props.terminated){
      let styles = this.box.style;
      styles.cursor = 'pointer';
      styles.boxShadow = '3px 3px 15px 5px #262626';
      styles.transform = 'scale(1.1, 1.1)';
      styles.zIndex = 1;
      if (this.props.value){
        styles.borderColor = 'red';
      }
      else{
        styles.borderColor = 'dodgerblue';
      }
    }
    else{
      this.box.style.cursor = 'not-allowed'
    }
  }

  handleMouseLeave(e){
    if (!this.props.terminated){
      let styles = this.box.style;
      styles.transform = 'scale(1, 1)';
      styles.boxShadow = 'none';
      styles.zIndex = 0;
      styles.borderColor = 'black'
    }
  }

  handleMouseClick(e){
    if (!this.props.terminated){
      let styles = this.box.style;
      styles.transform = 'scale(1, 1)';
      styles.boxShadow = 'none';
      styles.zIndex = 0;
      styles.borderColor = 'black'
      
      let playerChoices = ['Yes', 'ThumbsUp', 'No'];
      let computerChoices = ['Threaten', 'back'];
      let playerChoice = Math.floor(Math.random() * (3 - 1) + 1);
      playerChoice = playerChoices[playerChoice]
      let computerChoice = Math.floor(Math.random() * (2 - 1) + 1);
      computerChoice = computerChoices[computerChoice];
      let playerTurn = this.props.playerTurn;
      if (playerTurn){
        playerChoice = 'ThumbsUp';
        computerChoice = 'back';
      }
      else{
        playerChoice = 'Dance';
        computerChoice = 'Threaten'
      }
      if (!this.props.value){
        this.props.changeAnimation(playerChoice, computerChoice);
        this.props.updateGameBoard(this.props.row, this.props.col);
      }
      else{
        styles.borderColor = 'red';
      }
    }
  }

  render(){
    const {row, col} = this.props;
    return(
      <div >
        <div 
          ref={(box) => { this.box = box }}
          key={col} 
          style={boxStyles(row,col)} 
          onMouseOver={this.handleMouseOver } 
          onMouseLeave={this.handleMouseLeave} 
          onClick={this.handleMouseClick}
        >
        </div>
        {this.props.value === 'H' && 
          <Check
            style={iconStyles(row, col, this.props.value)} 
            onMouseOver={this.handleMouseOver } 
            onMouseLeave={this.handleMouseLeave} 
            onClick={this.handleMouseClick}
          />
        }
        {this.props.value === 'C' &&
          <Cross 
            style={iconStyles(row, col, this.props.value)} 
            onMouseOver={this.handleMouseOver } 
            onMouseLeave={this.handleMouseLeave} 
            onClick={this.handleMouseClick}
          />
        }
      </div>
    )
  }
}

export default Box;