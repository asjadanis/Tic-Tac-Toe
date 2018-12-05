import React, {Component} from 'react';
import * as d3 from 'd3';

class GameTree extends Component{
  constructor(props){
    super(props);
    this.createGameBoard = this.createGameBoard.bind(this);
    this.DFS = this.DFS.bind(this);
    this.generateGameTree = this.generateGameTree.bind(this);
  }

  componentWillReceiveProps(nextProps){
    if (document.getElementById('gameBoard')){
      document.getElementById('gameBoard').remove();
    }
    if (document.getElementById('gameTree')){
      document.getElementById('gameTree').remove();
    }
    this.createGameBoard(nextProps.gameBoard);
  }

  componentDidMount(){
    // this.createGameBoard(this.props.gameBoard);
  }

  getBoardStyles(length, bgColor, gridColor, crossColor, tickColor){
    return ({
      boardLength: length,
      squareLength: Math.floor(length/3),
      bgColor: bgColor,
      gridColor: gridColor,
      crossColor: crossColor,
      tickColor: tickColor
    })
  }

  createGameBoard(gameBoard){
    // const root = this.node;
    const gameBoardStyles = this.getBoardStyles(150, 'rgb(0, 139, 139)', 'rgb(0, 0, 0)', 'rgb(255, 0, 0)', 'rgb(124, 252, 0)')
    var svg = d3.select(this.container).append('svg')
                .attr('id', 'gameBoard')
                .attr("width", gameBoardStyles.boardLength)
                .attr("height", gameBoardStyles.boardLength)

    svg.append('rect')
       .attr('x', 0)
       .attr('y', 0)
       .attr('width', gameBoardStyles.boardLength)
       .attr('height', gameBoardStyles.boardLength)
       .attr('fill', gameBoardStyles.bgColor)
       .attr('stroke', gameBoardStyles.gridColor)
       .attr('stroke-width', 4)
    
    for (let i = 0; i < 3; i++){
      svg.append('line')
         .attr('x1', gameBoardStyles.squareLength * i)
         .attr('y1', 0)
         .attr('x2', gameBoardStyles.squareLength * i)
         .attr('y2', gameBoardStyles.boardLength)
         .attr('stroke-width', 4)
         .attr('stroke', gameBoardStyles.gridColor)

      svg.append('line')
         .attr('x1', 0)
         .attr('y1', gameBoardStyles.squareLength * i)
         .attr('x2', gameBoardStyles.boardLength)
         .attr('y2', gameBoardStyles.squareLength * i)
         .attr('stroke-width', 4)
         .attr('stroke', gameBoardStyles.gridColor)
    }

    var scale = d3.scaleBand()  
                  .domain([0,1,2])
                  .rangeRound([0, gameBoardStyles.boardLength])
                  .padding(1)
                  .paddingOuter(0.5)

    const drawCross = (row, col) => {
      let cellSize = gameBoardStyles.squareLength/4;
      let crossLineWidth = gameBoardStyles.squareLength/10;
      svg.append('line')
         .attr('x1', scale(col) - cellSize)
         .attr('y1', scale(row) - cellSize)
         .attr('x2', scale(col) + cellSize)
         .attr('y2', scale(row) + cellSize)
         .attr('stroke-width', crossLineWidth)
         .attr('stroke', gameBoardStyles.crossColor)

      svg.append('line')
         .attr('x1', scale(col) - cellSize)
         .attr('y1', scale(row) + cellSize)
         .attr('x2', scale(col) + cellSize)
         .attr('y2', scale(row) - cellSize)
         .attr('stroke-width', crossLineWidth)
         .attr('stroke', gameBoardStyles.crossColor)
    }

    const drawTick = (row, col) => {
      svg.append('circle')
         .attr('cx', scale(col))
         .attr('cy', scale(row))
         .attr('r', gameBoardStyles.squareLength * 0.3)
         .attr('fill', gameBoardStyles.tickColor)
    }
    let count = 0;
    for (let i = 0; i < 3; i++){
      for (let j = 0; j < 3; j++){
        if (gameBoard[i][j] === 'H'){
          drawTick(i, j)
        }
        else if (gameBoard[i][j] === 'C'){
          drawCross(i,j)
        }
        else{
          count++;
        }
      }
    }
    this.svg = svg;

    if (count <= 6){
      this.generateGameTree(gameBoard)
    }
  }

  DFS(node, isMaximizer){
    node.children = [];
    let gameScore = this.props.evaluateGameBoard(node.game);
    if (gameScore === 10){ 
      return gameScore;
    }
    else if (gameScore === -10){
      return gameScore;
    }
    if (!this.props.isMovesRemaining(node.game)){
      return 0;
    }
    for (let i = 0; i < this.props.gameBoard.length; i++){
      for (let j = 0; j < this.props.gameBoard.length; j++){
        if (!node.game[i][j]){
          let move = isMaximizer ? 'C' : 'H';
          let nextNode = JSON.parse( JSON.stringify(node) )
          nextNode.game[i][j] = move;
          node.children.push(nextNode);
          this.DFS(nextNode, !isMaximizer);
        }
      }
    }
  }

  generateGameTree(gameBoard){
    let rootNode = {
      game: gameBoard
    }

    this.DFS(rootNode)

    let margin = {top: 50, right: 0, bottom: 60, left: 0};
    // let width = 675 - margin.left - margin.right;
    // let height = 400 - margin.top - margin.bottom;
    let width = 1000 - margin.left - margin.right;
    let height = 1000 - margin.top - margin.bottom;
    let nodeSize= 20;
    let edgeWidth = 2;
    let treeBgColor = '#eeeee';
    let edgeColor = '#666666';

    let svgView = ({
      model: rootNode,
      sideLength: nodeSize
    }) 

    let diagnol = d3.linkHorizontal()
                .x((d) => {return d.x})
                .y((d) => {return d.y})

    let svg = d3.select(this.container)
                .append('svg')
                .attr('id', 'gameTree')
                .attr('width', width + margin.left + margin.right)
                .attr('height', height + margin.top + margin.bottom)
                .attr('style', 'position: absolute; top: 10rem; left: -26rem')
                .append('g')
                .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");
  
    let tree = d3.tree().size([width, height])
    tree.separation(() => {
      return 2;
    })

    // let nodes = tree(rootNode);
    // tree.nodeSize([80,80])

    let nodeMargin = nodeSize/3.4;

    let hierarchy = d3.hierarchy(rootNode);
    let links = tree(hierarchy).links();

    svg.selectAll('path')
       .data(tree(hierarchy).links())
       .enter().append('path')
       .attr('d', diagnol)
       .attr('fill', 'none')
       .attr('stroke', edgeColor)
       .attr('stroke-width', edgeWidth)

    svg.selectAll('g.node-group')
       .data(hierarchy)
       .enter()
       .append('g')
       .attr('class', 'node-group')
       .attr('transform', (d) => {return 'translate('+ (d.x - nodeMargin) + ',' + (d.y - nodeMargin) + ')'})

    svg.selectAll('.node-group')
       .each((node) => {
          // svgView.model = node.game;
          // svgView.svg = d3.select(this);
          // console.log('NODE: ', node);
          this.createGameBoard(node.game);
      });

    svg.selectAll(".node-group")
       .attr("transform", function() {
          return this.getAttribute("transform") + " scale(0.6)";
       });
  }

  render(){
    return(
      <div 
        style={{width: '150px', height: '150px', position: 'absolute', bottom: '-10rem'}}
        ref={(container)=>{this.container = container} }
      >
        {/* <svg 
          ref={(node)=>{this.node = node} } 
          style={{width: '150px', height: '150px'}}
        >
        </svg> */}
      </div>
    )
  }
}

export default GameTree;