
const nameScreen = document.querySelector('.name-screen');
const playerName = document.querySelector('.player-name');
const nextBtn = document.querySelector('.next-btn');
const P1Selection = document.querySelector('.select-title');
const selectBtn = document.querySelectorAll('.select-btn');
const signBtn = document.querySelectorAll('.sign-btn');
const opponentBtn = document.querySelectorAll('.opponent-btn');
const activeBtn = document.querySelectorAll('.active-btn');
const selectionScreen = document.querySelector('.select-page');
const grid = document.querySelector('.gameboard');
const cellElements = document.querySelectorAll('.cell');
const result = document.querySelector('.result');
const restartBtn = document.querySelector('.restart-btn');
const returnBtn = document.querySelector('.return-btn');



//create players
const player = (name, sign, active, winner, isAi) => {

    return { name, sign, active, winner, isAi};
};

const player1 = player('Player 1', '', true, false, false);
const player2 = player('', '', false, false, false);


//create and show gameboard
const gameboard = (() => {
    
  
    const createBoard = () => {
        selectionScreen.style.display = 'none';
        grid.style.display = 'grid';
    };

    const board = ['','','','','','','','',''];
    const remainingRounds = 9;
    let chooseGameDifficulty;

    
    const restartGame = () => {
        result.textContent = '';
        
        cellElements.forEach((cell) => {
            cell.textContent = '';
            cell.style.pointerEvents = 'auto';
        });
        
        gameboard.board = ['','','','','','','','',''];
        gameboard.remainingRounds = 9;
        

        // player1.winner = false;
        // player2.winner = false;

        restartBtn.style.display = 'none';
        returnBtn.style.display = 'none';

        resetGameSettings();
        console.log(gameboard.chooseGameDifficulty);
    };

    const reloadGame = () => {
        window.location.reload();
    };

    const resetGameSettings = () => {
        if (player1.sign == "X") {
            player1.active = true;
            player2.active = false;
        } else if (player2.sign == "X") {
            player2.active = true;
            player1.active = false;
        };

        player1.winner = false;
        player2.winner = false;

        // chooseGameDifficulty();
        let RdmNb = Math.random();
        gameboard.chooseGameDifficulty = RdmNb;
        
        //if CP start
        if (player2.name == "Computer" && player2.active == true) {  
            gameflow.CpPlay();      
        };
    };

    return {
        createBoard,
        board,
        remainingRounds,
        restartGame,
        reloadGame,
        resetGameSettings,
        chooseGameDifficulty,
    }
})();


const gameflow = (() => {

 //first page info

    //decide who plays which sign
    signBtn.forEach((btn) => {
        btn.addEventListener('click', () => {

            player1.sign = btn.value;
            
            let XBtn = document.getElementById('select-x');
            let OBtn = document.getElementById('select-o');
            
            if (player1.sign == 'X') {
                player2.sign = 'O';
                player1.active = true;
                player2.active = false;
                XBtn.classList.add('active-btn');
                OBtn.classList.remove('active-btn');
            } else {
                player2.sign = 'X'
                player1.active = false;
                player2.active = true;
                OBtn.classList.add('active-btn');
                XBtn.classList.remove('active-btn');
            }

            if (player1.sign !== '' && player2.name !== '') {
                nextBtn.style.display = 'block';
            };
        });     
    });

    //decide opponent
    opponentBtn.forEach((btn) => {
        btn.addEventListener('click', () => {
            player2.name = btn.value;

            let P2Btn = document.getElementById('select-p2');
            let AiBtn = document.getElementById('select-ai');

            if (player2.name == 'Player 2') {
                player2.isAi = false;
                P2Btn.classList.add('active-btn');
                AiBtn.classList.remove('active-btn');
            } else {
                player2.isAi = true;
                AiBtn.classList.add('active-btn');
                P2Btn.classList.remove('active-btn');
            }

            if (player1.sign !== '' && player2.name !== '') {
                nextBtn.style.display = 'block';
            }
        });
    });

    //create gameboard
    nextBtn.addEventListener('click', () => {
        gameboard.createBoard();
        gameboard.resetGameSettings();
    });

    //cell click event
    cellElements.forEach((cell,index) => {
        cell.addEventListener('click', () => {
            
            if (player1.active == true && player2.name == "Player 2") {
                cell.textContent = player1.sign;
                gameboard.board[index] = player1.sign;
                player1.active = false;
                player2.active = true;
                
            } else if (player2.active == true && player2.name == "Player 2") {
                cell.textContent = player2.sign;
                gameboard.board[index] = player2.sign;
                player2.active = false;
                player1.active = true;
                
            } else if (player1.active == true && player2.name == "Computer") {
                cell.textContent = player1.sign;
                gameboard.board[index] = player1.sign;
                player1.active = false;
                player2.active = true;
                if (gameboard.remainingRounds !== 1) {
                    CpPlay();
                } 
            };

            cell.style.pointerEvents = 'none';
            gameboard.remainingRounds--;
            
            checkWinner();
           
            if (gameboard.remainingRounds == 0 || player1.winner == true || player2.winner == true) {
                endGame()
            };
        });
    });


    const checkWinner = () => {
        const winningConditions = [
            [0,1,2],
            [3,4,5],
            [6,7,8],
            [0,3,6],
            [1,4,7],
            [2,5,8],
            [0,4,8],
            [2,4,6],
        ];
        
        winningConditions.forEach((item) => {
            if (gameboard.board[item[0]] == player1.sign && gameboard.board[item[1]] == player1.sign && gameboard.board[item[2]] == player1.sign) {
                player1.winner = true;
                cellElements.forEach((cell) => {
                    cell.style.pointerEvents = 'none';
                });
            } else if (gameboard.board[item[0]] == player2.sign && gameboard.board[item[1]] == player2.sign && gameboard.board[item[2]] == player2.sign) {
                player2.winner = true;
                cellElements.forEach((cell) => {
                    cell.style.pointerEvents = 'none';
                });
            } 
        });

        // if (player1.winner == true || player2.winner == true) {
        //     return true;
        // } else {
        //     return false;
        // }
    };

    const checkWinnerForMinimax = () => {
        const winningConditions = [
            [0,1,2],
            [3,4,5],
            [6,7,8],
            [0,3,6],
            [1,4,7],
            [2,5,8],
            [0,4,8],
            [2,4,6],
        ];

        let gameOver = false;
        let winner = null;
        
        winningConditions.forEach((item) => {
            if (gameboard.board[item[0]] == player1.sign && gameboard.board[item[1]] == player1.sign && gameboard.board[item[2]] == player1.sign) {
                gameOver = true;
                winner = player1.sign;
            } else if (gameboard.board[item[0]] == player2.sign && gameboard.board[item[1]] == player2.sign && gameboard.board[item[2]] == player2.sign) {
                gameOver = true;
                winner = player2.sign;
            } else if (player1.winner == false && player2.winner == false && gameboard.remainingRounds == 0) {
                gameOver = true;
            }
        });

        if (gameOver == true && winner == player1.sign) {
            return player1.sign;
        } else if (gameOver == true && winner == player2.sign) {
            return player2.sign;
        } else if (gameOver == true && winner == null) {
            return 'draw';
        }
    };

    //winner message and restart & return btn
    const endGame = () => {
        if (player1.winner == true) {
            result.textContent = `${player1.name} wins!`;
        } else if (player2.winner == true) {
            result.textContent = `${player2.name} wins!`;
        } else if (player1.winner == false && player2.winner == false && gameboard.remainingRounds == 0) {
            result.textContent = 'draw!';
        }

        cellElements.forEach((cell) => {
                cell.style.pointerEvents = 'none';
            });
        grid.style.marginTop = '4vh';
        restartBtn.style.display = 'block';
        returnBtn.style.display = 'block';
    };

   

    const getAllEmptyCellsIndexes = (currBoard) => {
        cellElements.forEach((cell,index) => {
            if (currBoard[index] !== "X"  && currBoard[index] !== "O") {
                currBoard[index] = cell.dataset.index;
            }
        });
        return currBoard.filter((i) => i != "X" && i != "O");
    };
    
    //randomn ai play
    let emptySelectedCell;
    const getRandomMove = () => {
        let emptyCells = getAllEmptyCellsIndexes(gameboard.board);
        let randomIndex = Math.floor(Math.random() * emptyCells.length);
        emptySelectedCell = emptyCells[randomIndex];
      };

      //CP plays random moves
      const aiPlay = () => {
        getRandomMove();
        gameboard.board[emptySelectedCell] = player2.sign;
        
        gameboard.remainingRounds--;
        cellElements.forEach((cell) => {
            if (cell.dataset.index == emptySelectedCell) {
                cell.textContent = player2.sign;
                cell.style.pointerEvents = 'none';
            }
        });
        player2.active = false;
        player1.active = true;
      };

      //CP plays best moves
      const aiPlay2 = () => {
        
        let spot = bestSpot();
        console.log(spot);
        
        gameboard.board[spot] = player2.sign;
        gameboard.remainingRounds--;
        cellElements.forEach((cell) => {
            if (cell.dataset.index == spot) {
                cell.textContent = player2.sign;
                cell.style.pointerEvents = 'none';
            }
        });
        player2.active = false;
        player1.active = true;
      };

      const bestSpot = () => {
        return minimax(gameboard.board, player2.sign).index;
      }

      // get 50/50 chance of Ai easy or difficult
      const CpPlay = () => {
        if (gameboard.chooseGameDifficulty < 0.5) {
            //easy AI
            aiPlay();
        } else if (gameboard.chooseGameDifficulty >= 0.5) {
            //difficult AI
            aiPlay2()
        }
      };  
      
   
// minimax
    const minimax = (newBd, currSign) => {
        
        const availCells = getAllEmptyCellsIndexes(newBd);

        if (checkWinnerForMinimax() == player1.sign) {
            return {score: -10}
       } else if (checkWinnerForMinimax() == player2.sign) {
            return {score: 10}
       } else if (availCells.length == 0) {
            return {score: 0}
       }

       let moves = [];
        
        for (let i = 0; i < availCells.length; i++) {
            let move = {};
            move.index = newBd[availCells[i]];
            newBd[availCells[i]] = currSign;
            
            if (currSign == player2.sign) {
                let result = minimax(newBd, player1.sign);
                move.score = result.score;
            } else {
                let result = minimax(newBd, player2.sign);
                move.score = result.score;
            }
            
            newBd[availCells[i]] = move.index;
            moves.push(move);
        }
    
        let bestMove;
        
        if (currSign == player2.sign) {
            let bestScore = -1000;
            for (let i = 0; i < moves.length; i++) {
                if (moves[i].score > bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        } else {
            let bestScore = 1000;
            for (let i = 0; i < moves.length; i++) {
                if (moves[i].score < bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        }

        return moves[bestMove];
    };

    
    // restart btn
    restartBtn.addEventListener('click', gameboard.restartGame);

    //retun btn
    returnBtn.addEventListener('click', gameboard.reloadGame);
    
     return {
        CpPlay,
     };
})();