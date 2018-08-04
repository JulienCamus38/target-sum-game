import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Game.css';

import { sum, sampleSize } from 'lodash';

import Number from '../Number/Number';

const randomNumberBetween = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const colors = {
  new: 'lightblue',
  playing: 'deepskyblue',
  won: 'lightgreen',
  lost: 'lightcoral',
};

class Game extends Component {

  constructor(props) {
    super(props);
    this.state = {
      gameStatus: 'new', // new, playing, won, lost
      remainingSeconds: this.props.initialSeconds,
      selectedIds: [],
    };
  }

  componentDidMount() {
  }

  challengeNumbers = Array.from({
    length: this.props.challengeSize
  }).map(() => randomNumberBetween(...this.props.challengeRange));

  target = sum(
    sampleSize(this.challengeNumbers, this.props.answerSize)
  );

  isNumberAvailable = (numberIndex) =>
    this.state.selectedIds.indexOf(numberIndex) === -1;

  startGame = () => {
    this.setState({ gameStatus: 'playing' }, () => {
      this.intervalId = setInterval(() => {
        this.setState((prevState) => {
          const newRemainingSeconds = prevState.remainingSeconds - 1;
          if (newRemainingSeconds === 0) {
            clearInterval(this.intervalId);
            return { gameStatus: 'lost', remainingSeconds: 0 };
          }
          return { remainingSeconds: newRemainingSeconds };
        });
      }, 1000);
    });
  };

  calcGameStatus = (selectedIds) => {
    const sumSelected = selectedIds.reduce(
      (acc, curr) => acc + this.challengeNumbers[curr],
      0
    );
    if (sumSelected < this.target) {
      return 'playing';
    }
    return sumSelected === this.target ? 'won' : 'lost';
  };

  selectNumber = (numberIndex) => {
    if (this.state.gameStatus !== 'playing') {
      return;
    }
    this.setState(
      (prevState) => ({
        selectedIds: [...prevState.selectedIds, numberIndex],
        gameStatus: this.calcGameStatus([
          ...prevState.selectedIds,
          numberIndex,
        ]),
      }),
      () => {
        if (this.state.gameStatus !== 'playing') {
          clearInterval(this.intervalId);
        }
      }
    );
  };

  render() {
    const { gameStatus, remainingSeconds } = this.state;

    return (
      <div className="game">
        <div className="help">
          Pick {this.props.answerSize} numbers that sum to the target in {this.props.initialSeconds} seconds
        </div>
        <div
          className="target"
          style={{ backgroundColor: colors[gameStatus] }}>
          {gameStatus === 'new' ? '?' : this.target}
        </div>
        <div className="challenge-numbers">
          {
            this.challengeNumbers.map((value, index) =>
              <Number
                key={index}
                id={index}
                value={gameStatus === 'new' ? '?' : value}
                clickable={this.isNumberAvailable(index)}
                onClick={this.selectNumber}
              />
            )
          }
        </div>
        <div className="footer">
          {gameStatus === 'new' && <button onClick={this.startGame}>Start</button>}

          {gameStatus === 'playing' &&
            <div className="timer-value">{remainingSeconds}</div>}

          {['won', 'lost'].includes(gameStatus) && <button>Play Again</button>}
        </div>
      </div>
    );
  }
}

Game.propTypes = {
  challengeSize: PropTypes.number,
  challengeRange: PropTypes.array,
  initialSeconds: PropTypes.number,
  answerSize: PropTypes.number
}

export default Game;