import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Game.css';

import { sum, sampleSize } from 'lodash';

import Number from '../Number/Number';

import { Animated } from 'react-animated-css';

const randomNumberBetween = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const colors = {
  new: 'secondary',
  playing: 'primary',
  won: 'success',
  lost: 'danger'
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
    if (this.props.autoPlay) {
      this.startGame();
    }
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
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
    var remainingSecondsStyle = (remainingSeconds < 4) ? 'danger' : (remainingSeconds < 8) ? 'warning' : 'success';

    return (
      <div className="game">
        <div className="help">
          Pick {this.props.answerSize} numbers that sum to the target in {this.props.initialSeconds} seconds
        </div>
        <div
          className={"target shadow-lg p-3 mb-5 rounded p-3 mb-2 alert alert-" + colors[gameStatus]}>
          <div className={gameStatus === 'playing' ? "animated pulse infinite" : ""}>
            {gameStatus === 'new' ? '?' : this.target}
          </div>
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
          {gameStatus === 'new' && <button
            className="btn btn-outline-success"
            onClick={this.startGame}>
            Start game
          </button>}

          {gameStatus === 'playing' &&
            <div
              className={"timer-value alert alert-" + remainingSecondsStyle}
            >
              <div className="animated tada infinite">
                {remainingSeconds}
              </div>
            </div>
          }

          {['won', 'lost'].includes(gameStatus) && <button
            className="btn btn-outline-success"
            onClick={this.props.onPlayAgain}>
            Play Again
          </button>}
        </div>
      </div>
    );
  }
}

Game.propTypes = {
  challengeSize: PropTypes.number,
  challengeRange: PropTypes.array,
  initialSeconds: PropTypes.number,
  answerSize: PropTypes.number,
  gameId: PropTypes.number,
  autoPlay: PropTypes.bool,
  onPlayAgain: PropTypes.func
}

export default Game;