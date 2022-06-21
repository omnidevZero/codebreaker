import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class SingleDigit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: ''
        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleKeyDown(e) {
        if (["e", "E", "+", "-"].includes(e.key)) e.preventDefault();
    }

    handleChange(e) {
        const currentArray = this.props.gameState.current;
        const currentValue = parseInt(e.target.value);
        if (currentValue === '' || currentValue > 9 || currentValue < 0) {
            this.setState({
                value: ''
            });
            return;
        } else {
            this.setState({
                value: e.target.value
            });
        }
        currentArray[this.props.number] = currentValue;
    }

    
    render() {
        let className = 'square';
        if (this.props.status.incorrect) className += ' incorrect';
        if (this.props.status.misplaced) className += ' misplaced';
        if (this.props.status.correct) className += ' correct';
        return (
            <input 
                className={className} 
                type="number" min="0" max="9"
                onKeyDown={this.handleKeyDown}
                onChange={this.handleChange}
                value={this.props.gameState.current[this.props.number]}
            >
            </input>
        );
    }
  }

class Submit extends React.Component {
    render() {
        return (
            <button className="submit" onClick={this.props.onClick}>
                <span>Submit</span>
            </button>
        );
    }
}
  
class Digits extends React.Component {
    renderDigit(i) {
        const currentValue = this.props.gameState.current[i];
        const goalValue = this.props.goal[i];
        const goalArray = this.props.goal;
        let status = {
            correct: false,
            misplaced: false,
            incorrect: false
        };
        if (currentValue !== '') {
            if (currentValue === goalValue) {
                status.correct = true;
            } else if (goalArray.includes(currentValue)) {
                status.misplaced = true;
            } else {
                status.incorrect = true;
            }
        }
        return <SingleDigit number={i} goal={this.props.goal[i]} gameState={this.props.gameState} status={status}/>;
    }

    render() {
        return (
        <div>
            {this.renderDigit(0)}
            {this.renderDigit(1)}
            {this.renderDigit(2)}
            {this.renderDigit(3)}
        </div>
        );
    }
}

class MovesLeft extends React.Component {
    render() {
        return (
            <span className="moves">Attempts remaining: {this.props.value}</span>
        )
    }
}

class End extends React.Component {
    render() {
        let message = 'You lost!';
        if (this.props.state.isWin) {
            message = 'Congratulations! You won!';
        }
        return (
            <div className='flex-centered'>
                <div>{message}</div>
                <RetryButton onClick={this.props.retryClick}/>
            </div>
        )
    }
}

class RetryButton extends React.Component {
    render() {
        return (
            <button className='submit retry' onClick={this.props.onClick}>
                <span>Retry</span>
            </button>
        )
    }
}

class Help extends React.Component {
    render() {
        return (
            <div>
                <span className='incorrect'>incorrect digit</span>
                <span className='misplaced'>incorrect placement</span>
                <span className='correct'>correct</span>
            </div>
        )
    }
}

class Title extends React.Component {
    render() {
        return (
            <div className='title'><span>Code</span><span>Breaker</span></div>
        )
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            movesLeft: 6,
            goal: this.generateRandomDigitsGoal(),
            current: Array(4).fill(''),
            gameFinished: false,
            isWin: false
        }
    }

    generateRandomDigitsGoal() {
        let goal = Array(4).fill(null);
        for (let i = 0; i < goal.length; i++) {
            let randomDigit = Math.floor(Math.random() * 10);
            if (i === 0) {
                goal[i] = randomDigit;
            } else {
                while (goal.includes(randomDigit)) {
                    randomDigit = Math.floor(Math.random() * 10);
                };
                goal[i] = randomDigit;
            }
        }
        return goal;
    }

    handleSubmit(e) {
        if (this.state.movesLeft <= 0 || this.state.gameFinished) return;
        if (e.goal.join() === e.current.join()) {
            this.setState({
                gameFinished: true,
                isWin: true
            });
        } else {
            this.setState({
                movesLeft: this.state.movesLeft - 1
            }, () => {
                if (this.state.movesLeft <= 0) {
                    this.setState({
                        gameFinished: true
                    });
                }
            })
        }
    }

    getEndClasses() {
        let classes = 'end';
        if (this.state.gameFinished && this.state.isWin) {
            classes += ' won expanded';
        } else if (this.state.gameFinished) {
            classes += ' lost expanded';
        }
        return classes;
    }

    restartGame() {
        this.setState({
            gameFinished: false,
            movesLeft: 6,
            goal: this.generateRandomDigitsGoal(),
            current: Array(4).fill(''),
            isWin: false
        })
    }

    render() {
        return (
            <div className="game">
                <div className='help'>
                    <Help />
                </div>
                <div className={this.getEndClasses()}>
                    <End state={this.state} retryClick={() => {this.restartGame(this.state)}}/>
                </div>
                <Title />
                <MovesLeft value={this.state.movesLeft}/>
                <div className="game-digits">
                    <Digits goal={this.state.goal} gameState={this.state}/>
                    <Submit onClick={() => {this.handleSubmit(this.state)}}/>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
<Game />,
document.getElementById('root')
);  