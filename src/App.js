import React, { Component } from 'react';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import Checkbox from '@material-ui/core/Checkbox';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import GameBoard from './Components/GameBoard';
import Avatar from './Components/Avatar';

class App extends Component {
  constructor(props){
    super(props);
    this.state={
      boardSize: 3,
      sizes: [3,4,5]
    }
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.menuItems = this.menuItems.bind(this);
  }

  handleSelectChange(e){
    this.setState({boardSize: e.target.value})
  }

  menuItems(data , values){
    return data.map((item) => (
      <MenuItem 
        key={item}
        value={item}
      >
        <Checkbox checked={Array.isArray(values) ?  values.indexOf(item) > -1 : item === values} color="primary" />
        {/* <Checkbox checked={Array.isArray(values) ?  values.indexOf(item) > -1 : values} color="primary" /> */}
        <ListItemText primary={item} />
      </MenuItem>
    ));
  }

  render() {
    const {boardSize, sizes} = this.state;

    return (
      <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', position: 'absolute' }}>
        <div style={{position: 'absolute'}}>
          {/* Game Board Settings */}
          {/* <FormControl style={{width:'10rem', marginTop: '0.7rem'}}>
            <InputLabel htmlFor={'Board Size'}> Board Size </InputLabel>
              <Select
                value={boardSize}
                onChange={this.handleSelectChange}
                renderValue={selected => selected}
                inputProps={{
                  name: 'Board Size',
                  id: 'boardSize',
                }}
              >
                {this.menuItems(sizes, boardSize)}
              </Select>
          </FormControl> */}
        </div>
        <div style={{position: 'absolute', top: '2rem', left: '10px'}}>
          <span>Player 1</span>
          <Avatar />
        </div>
        <div style={{position: 'absolute', top: '2rem', left: '50'}}>
          <span> GameBoard </span>
          <div style={{position: 'absolute', width: boardSize*9+'rem', height: boardSize*9+'rem', left: '-12rem', marginTop: '2rem'}}>
            <GameBoard 
              boardSize={boardSize}
            />
          </div>
        </div>
        <div style={{position: 'absolute', top: '2rem', right: '10px'}}>
          <span style={{float: 'right'}} > Player 2 </span>
          {/* <Avatar /> */}
        </div>
        <div>
          {/* ScoreBoard */}
        </div>
      </div>
    );
  }
}

export default App;
