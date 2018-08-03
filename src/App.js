import React from 'react';
import './App.css';


function GridCell(props){
  var style = {
    width: 30,
    height: 30,
    border: '1px black',
    backgroundColor: props.cell
  }
  return (
    <div style={style}>

    </div>
  )
}

function GridRow(props){

  var style = {
    display: 'flex'
  }
  return (
    <div style = {style}>
      {
        props.row.map((cell) => {
          return <GridCell cell = {cell}/>
        })
      }
    </div>
  )
}


function Grid(props){

  return (
    <div>
      {
        props.grid.map((row) => {
          return <GridRow row = {row} />
        })
      }
    </div>
  )
}


class Game extends React.Component {
  constructor(props){
    super(props);
    var grid = []
    for (let i = 0; i < 20; i++){
      grid.push(new Array(20).fill())
    }

    var bird = {
      height: 10,
      position: 2
    }

    var towers = [
      {position: 3, height: 5, upright: true},
      {position: 7, height: 8, upright: false},
      {position: 18, height: 7, upright: true},
      {position: 14, height: 6, upright: false},
      {position: 18, height: 7, upright: true},
      {position: 12, height: 3, upright: false},
      {position: 16, height: 8, upright: true},
      {position: 19, height: 2, upright: false}
    ]

    grid[bird.height][bird.position] = 'yellow';

    var initialState = {grid, bird, towers, crashed: false, score: 0};

    this.state = initialState;

    this.timerID = setInterval(() => {
      if(this.state.crashed)
        return
      var gridCopy = []
      var towersCopy = this.state.towers.slice();
      for (let i = 0; i < 20; i++){
        gridCopy.push(new Array(20).fill('LightSkyBlue'));
      }


      // making towers
      for (let i =0; i < towersCopy.length; i++) {
          towersCopy[i].position--;
          if(towersCopy[i].position < 0){
            towersCopy[i].position = 19
            towersCopy[i].height = Math.floor(Math.random()*7)+3;
          }
      }

      for (let i = 0; i < towersCopy.length; i++){
        for ( let j =0 ; j < towersCopy[i].height; j++){
          if(towersCopy[i].upright)
            gridCopy[19-j][towersCopy[i].position] = "green";
          else
            gridCopy[j][towersCopy[i].position] = "green";
        }
      }


      var birdCopy = this.state.bird;
      birdCopy.height++;

      var crashed = false;

      if(birdCopy.height > 19 || birdCopy.height < 0){
        birdCopy.height = 10;
        crashed = true;
      }

      for ( let i = 0; i < 20; i++){
        if(gridCopy[i][2] == 'green' && birdCopy.height == i){
          birdCopy.height = 10;
          crashed = true;
        }
      }
      if(crashed){
        this.setState({crashed: true});
      }
      gridCopy[birdCopy.height][birdCopy.position] = "yellow";

      this.setState({grid:gridCopy, bird, towers: towersCopy, score: this.state.score+1});
    }, 200)
  }

  handleClick(){
    if(this.state.crashed)
      return
    var birdCopy = this.state.bird;
    birdCopy.height -= 3;
    this.setState({bird:birdCopy});
  }

  restart() {
    this.setState({crashed: false, score: 0});
  }

  render(){
    return (
      <div onClick = {this.handleClick.bind(this)}>
        <Grid grid= {this.state.grid}/>
        {this.state.crashed? <div> <h2>Your score was {this.state.score}</h2>
          <button onClick = {this.restart.bind(this)}>Restart</button></div>: this.state.score}
      </div>
    )
  }
}

export default Game;
