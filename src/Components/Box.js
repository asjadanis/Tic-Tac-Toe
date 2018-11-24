import React, { Component } from 'react';
import {boxStyles} from './styles'
import '../App.css'

class Box extends Component{
  constructor(props){
    super(props);
    this.handleMouseOver = this.handleMouseOver.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.handleMouseClick = this.handleMouseClick.bind(this);
  }

  handleMouseOver(e){
    let styles = e.target.style;
    styles.boxShadow = '3px 3px 15px 5px #262626';
    styles.transform = 'scale(1.1, 1.1)';
    styles.zIndex = 1;

    styles.borderColor = 'dodgerblue';
  }

  handleMouseLeave(e){
    let styles = e.target.style;
    styles.transform = 'scale(1, 1)';
    styles.boxShadow = 'none';
    styles.zIndex = 0;
    styles.borderColor = 'black'
  }

  handleMouseClick(e){
    let styles = e.target.style;
    styles.transform = 'scale(1, 1)';
    styles.boxShadow = 'none';
    styles.zIndex = 0;
    styles.borderColor = 'black'
  }

  render(){
    const {row, col} = this.props;
    return(
      <div 
        key={col} 
        style={boxStyles(row,col)} 
        onMouseOver={this.handleMouseOver} 
        onMouseLeave={this.handleMouseLeave} 
        onClick={this.handleMouseClick}
      >
      
      </div>
    )
  }
}

export default Box;