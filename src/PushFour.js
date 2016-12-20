import React from 'react';
import './PushFour.css';

function GameSummary(props) {
  var turn = props.playersTurn === 0 ? 'red' : 'blue';
  var infoText = "It is " + turn + "'s turn.";
  if (props.endGame) {
    // If the game has ended, the player of the previous turn has won.
    var winner = turn === 'red' ? 'blue' : 'red';
    infoText = winner + " has won!";
  }
  return (
    <h2>{infoText}</h2>
  );
}

class PushFour extends React.Component {
  constructor(props) {
    super(props);
    var board = [
            ['w','g','g','g','g','g','g','g','g','g','g','w'],
            ['g','w','w','w','w','w','w','w','w','w','w','g'],
            ['g','w','w','w','w','w','w','w','w','w','w','g'],
            ['g','w','w','w','w','w','w','w','w','w','w','g'],
            ['g','w','w','w','w','w','w','w','w','w','w','g'],
            ['g','w','w','w','w','w','w','w','w','w','w','g'],
            ['g','w','w','w','w','w','w','w','w','w','w','g'],
            ['g','w','w','w','w','w','w','w','w','w','w','g'],
            ['g','w','w','w','w','w','w','w','w','w','w','g'],
            ['g','w','w','w','w','w','w','w','w','w','w','g'],
            ['g','w','w','w','w','w','w','w','w','w','w','g'],
            ['w','g','g','g','g','g','g','g','g','g','g','w']
          ];

    // Place 10 blocker tiles randomly on the board.
    var randx = 0;
    var randy = 0;
    for (let i = 0; i < 10; i++) {
      randx = Math.floor((Math.random() * 10) + 1);
      randy = Math.floor((Math.random() * 10) + 1);
      board[randx][randy] = 'b';
    }

    this.state = {
      playersTurn: 0,
      board: board,
      endGame: false
    }
  }

  /**
   * Callback for when a player clicks on a control
   * tile (the grey tiles along the edges).
   * This function calculates the playing piece's final landing
   * position and marks that position on the board.
   * It also checks for the win condition.
   **/
  handleTileClick(e) {
    var landingX = 0;
    var landingY = 0;
    var board = this.state.board.slice().map( function(row){ return row.slice(); });
    const [ x, y ] = e.target.dataset.coords.split('_');

    if (x === '0') {
      // Walk down
      for (let i=0; i<11; i++) {
        if (board[i+1][y] !== 'w') {
          landingX = i;
          landingY = y;
          break;
        }
      }
    } else if (y === '0') {
      // Walk right
      for (let i=0; i<11; i++) {
        if (board[x][i+1] !== 'w') {
          landingX = x;
          landingY = i;
          break;
        }
      }
    } else if (x === '11') {
      // Walk left
      for (let i=11; i>0; i--) {
        if (board[i-1][y] !== 'w') {
          landingX = i;
          landingY = y;
          break;
        }
      }
    } else if (y === '11') {
      // Walk up
      for (let i=11; i>0; i--) {
        if (board[x][i-1] !== 'w') {
          landingX = x;
          landingY = i;
          break;
        }
      }
    }
    board[landingX][landingY] = 'player-' + this.state.playersTurn;
    let playersTurn = this.state.playersTurn;
    let nextPlayersTurn = playersTurn === 0 ? 1 : 0;
    let endGame = this.winningCondition(board, playersTurn);
    this.setState({
      board: board,
      playersTurn: nextPlayersTurn,
      endGame: endGame
    });

  }

  /**
   ** Returns true if either player has made four in a row.
   **/
  winningCondition(board, player) {
    var inARow = 0;

    // Vertical
    for(let row = 1; row < 11; row++) {
      for (let col = 1; col < 11; col++) {
        if (board[row][col] === ('player-' + player)) {
          inARow = inARow + 1;
        } else {
          inARow = 0;
        }
        if (inARow === 4) {
          return true;
        }
      }
    }

    // Horizontal
    for(let row = 1; row < 11; row++) {
      for (let col = 1; col < 11; col++) {
        if (board[col][row] === ('player-' + player)) {
          inARow = inARow + 1;
        } else {
          inARow = 0;
        }
        if (inARow === 4) {
          return true;
        }
      }
    }

    // TODO: Check the diagonal 4 in a row.

    return false;
  }

  handleMouseEnter(e) {
    // TODO: Display preview of a potential move here.
  }

  render() {
    let clickhandler = this.handleTileClick.bind(this);
    let mouseenterhandler = this.handleMouseEnter.bind(this);
    var rows = this.state.board.map(function(item, i) {
      var tiles = item.map(function(t, j) {
        var isControl = "false";
        if ((i === 0 && j > 0 && j < 11)
          || (j === 0 && i > 0 && i < 11)
          || (i === 11 && j > 0 && j < 11)
          || (j === 11 && i > 0 && i < 11)) {
            isControl = "true";
        }
        if (isControl === "true") {
          let coords = `${i}_${j}`;
          return (
            <td key={j}
                className={t}
                onClick={clickhandler}
                onMouseEnter={mouseenterhandler}
                data-coords={coords}>
            </td>
          );
        } else {
          return (
            <td key={j}
                className={t}>
            </td>
          )
        }
      });
      return (
        <tr key={i}> {tiles} </tr>
      );
    });

    let disableGame = this.state.endGame ? 'disable-game' : '';
    return (
      <div>
        <table>
          <tbody>
            {rows}
          </tbody>
        </table>

        <GameSummary playersTurn={this.state.playersTurn}
                     endGame={this.state.endGame}
        />
        <div className={disableGame}></div>
      </div>
    );
  }
}

export default PushFour;
