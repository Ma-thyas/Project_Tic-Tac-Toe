
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


//create players
const player = (name, sign, active) => {

    return { name, sign, active };
};

const player1 = player('Player 1', '', true);
const player2 = player('', '', false);


//create and show gameboard
const gameboard = (() => {
    
  
    const createBoard = () => {
        selectionScreen.style.display = 'none';
        grid.style.display = 'grid';
    };

    const board = ['','','','','','','','',''];
    const remainingRounds = 9;

    const restartGame = () => {
        result.textContent = '';
        
        cellElements.forEach((cell) => {
            cell.textContent = '';
            cell.style.pointerEvents = 'auto';
        });
        
        gameboard.board = ['','','','','','','','',''];
        gameboard.remainingRounds = 9;
    };

    return {
        createBoard,
        board,
        remainingRounds,
        restartGame,
        
    }
})();


const gameflow = (() => {

 //first page info

    //decide who plays which sign
    signBtn.forEach((btn) => {
        btn.addEventListener('click', () => {

            // signBtn.forEach((button) => {
            //     button.classList.remove('active-btn');
            // });
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
                P2Btn.classList.add('active-btn');
                AiBtn.classList.remove('active-btn');
            } else {
                AiBtn.classList.add('active-btn');
                P2Btn.classList.remove('active-btn');
            }

            if (player1.sign !== '' && player2.name !== '') {
                nextBtn.style.display = 'block';
            }
        })
    })

    //create gameboard
    nextBtn.addEventListener('click', () => {
        gameboard.createBoard();
        console.log(player1);
        console.log(player2);
    });


    //cell click event
    cellElements.forEach((cell,index) => {
        cell.addEventListener('click', () => {
            if (player1.active == true) {
                cell.textContent = player1.sign;
                gameboard.board[index] = player1.sign;
                player1.active = false;
                player2.active = true;
            } else {
                cell.textContent = player2.sign;
                gameboard.board[index] = player2.sign;
                player2.active = false;
                player1.active = true;
            }
            cell.style.pointerEvents = 'none';
            gameboard.remainingRounds--;
    
            checkWinner();
            
        });
    });

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

    const checkWinner = (() => {
        let isWinner = false;
        winningConditions.forEach((item) => {
            if(gameboard.board[item[0]] == player1.sign && gameboard.board[item[1]] == player1.sign && gameboard.board[item[2]] == player1.sign) {
                result.textContent = `${player1.name} wins!`;
                isWinner = true;
                grid.style.marginTop = '4vh';
                restartBtn.style.display = 'block';
                cellElements.forEach((cell) => {
                    cell.style.pointerEvents = 'none';
                });
            } else if (gameboard.board[item[0]] == player2.sign && gameboard.board[item[1]] == player2.sign && gameboard.board[item[2]] == player2.sign) {
                result.textContent = `${player2.name} wins!`;
                isWinner = true;
                grid.style.marginTop = '4vh';
                restartBtn.style.display = 'block';
                cellElements.forEach((cell) => {
                    cell.style.pointerEvents = 'none';
                });
            } else if (isWinner == false && gameboard.remainingRounds == 0) {
                result.textContent = 'draw!';
                grid.style.marginTop = '4vh';
                restartBtn.style.display = 'block';
            }
            
        });
    });

    restartBtn.addEventListener('click', gameboard.restartGame);
    
     
})();