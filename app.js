const wins = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
let corners = [0, 2, 6, 8];
let sideMiddle = [1, 3, 5, 7];
let availableMoves = [0, 1, 2, 3, 4, 5, 6, 7, 8];
const moves = [];
const userMoves = [];
const computerMoves = [];
let chosenShape = '';
let computerShape = '';
let counter; // to check if user almost won
// let numberOfGames = 0;
// let numberOfWins = 0;
// let numberOfLosses = 0;

let $cells;
let $shapes;
let $shape;
let $board;
let $winScreen;
let $winner;
let $playAgain;

function chooseShape(e) {
  chosenShape = $(e.target).attr('value');
  (chosenShape === 'x') ? computerShape = 'o' : computerShape = 'x';
  $($board).css('display', 'block');
  $($shapes).css('display', 'none');
}

function init() {
  $cells = $('li');
  $shapes = $('.choose-shapes')[0];
  $shape = $('.shape');
  $board = $('ul')[0];
  $winScreen = $('.win')[0];
  $winner = $('.win h2')[0];
  $playAgain = $('.win')[0];

  // const itsX = {isIt: '', shape: 'x'};


  function checkIfComputerAlmostWon() {
    for (var i = 0; i < wins.length; i++) {
      counter = 0;
      for (var j = 0; j < wins[i].length; j++) {
        if (computerMoves.includes(wins[i][j])) {
          counter ++;
          if (counter === 2) {
            console.log('yay Im about to win');
            return checkWin(computerShape);
          }
        }
      }
      checkIfAlmostWon();
    }
  }

  function checkIfAlmostWon() {
    for (var i = 0; i < wins.length; i++) {
      counter = 0;
      for (var j = 0; j < wins[i].length; j++) {
        if (userMoves.includes(wins[i][j])) {
          counter ++;
          if (counter === 2) {
            // console.log(wins[i][j]);
            // console.log('Shit, user is about to win');
            const nextMove = wins[i].filter(item => {
              return userMoves.indexOf(item) === -1;
            });
            // console.log(`computer clicked here ${nextMove[0]}`);
            if (computerMoves.indexOf(nextMove[0]) === -1) {
              const availIndexOfRandCorner = availableMoves.indexOf(nextMove[0]);
              const cornersIndexOfRandCorner = corners.indexOf(nextMove[0]);
              computerMoves.push(nextMove[0]);
              moves.push({item: computerShape, position: nextMove[0]});
              availableMoves.splice(availIndexOfRandCorner, 1);
              if (cornersIndexOfRandCorner !== -1) corners.splice(cornersIndexOfRandCorner, 1);
              $($cells[nextMove]).html(`<p>${computerShape}</p>`);
              // console.log('TOT MOVES (computer turn): -->', moves);
              // console.log(`AVAIL MOVES: (Computer turn) ${availableMoves}`);
              // console.log(`COMPUTER MOVES so far ${computerMoves}`);
            }
            // checkWin(computerShape);
          } else {
            if (corners.length > 1) {
              const nextMove2 = corners[Math.floor(Math.random() * corners.length)];
              moves.push({item: computerShape, position: nextMove2});
              corners.splice(corners.indexOf(nextMove2), 1);
              computerMoves.push(nextMove2);
              return $($cells[nextMove2]).html(`<p>${computerShape}</p>`);
            } else {
              console.log('sidemiddle -->', sideMiddle);
            }
          }
        }
      }
    }
    checkWin(computerShape);
  }

  function computerTurn(numberTurn) {
    if (numberTurn === 1) { // if it's the first turn computer goes to random corner
      if (moves[moves.length - 1].position === 4) {
        const randomCorner = corners[Math.floor(Math.random() * corners.length)];
        const availIndexOfRandCorner = availableMoves.indexOf(randomCorner);
        const cornersIndexOfRandCorner = corners.indexOf(randomCorner);
        // console.log(`Random corner: ${randomCorner}`);
        availableMoves.splice(availIndexOfRandCorner, 1);
        corners.splice(cornersIndexOfRandCorner, 1);
        computerMoves.push(randomCorner);
        moves.push({item: computerShape, position: randomCorner});
        $($cells[randomCorner]).html(`<p>${computerShape}</p>`);
        // console.log('TOT MOVES (computer turn): -->', moves);
        // console.log(`AVAIL MOVES: (Computer turn) ${availableMoves}`);
        // console.log(`AVAIL CORNERS: (Computer turn) ${corners}`);
        // console.log(`COMPUTER MOVES so far ${computerMoves}`);
      }
    } else {
      console.log('computer moves', computerMoves);
      checkIfComputerAlmostWon();
      // checkIfAlmostWon();
    }
  }

  function userTurn(e) {
    const clickedItem = $(e.target).val();
    // console.log(`I clicked here: ${clickedItem}`);
    userMoves.push(clickedItem);
    moves.push({item: chosenShape, position: clickedItem});
    availableMoves.splice(clickedItem, 1);
    if (corners.includes(clickedItem)) {
      console.log('user clicked on a corner');
      corners.splice(corners.indexOf(clickedItem), 1);
    }
    if (sideMiddle.includes(clickedItem)) {
      sideMiddle.splice(sideMiddle.indexOf(clickedItem), 1);
    }
    // console.log('TOT MOVES (urser turn): -->', moves);
    // console.log(`AVAIL MOVES: (User turn) ${availableMoves}`);
    // console.log(`USER MOVES so far ${userMoves}`);
    checkWin(chosenShape);
    setTimeout(() => {
      computerTurn(moves.length);
    }, 2000);
  }

  function fillShape(e) {
    if ($(e.target).html() === '') {
      $(e.target).html(`<p>${chosenShape}</p>`);
      userTurn(e);
    }
  }

  function displayWinner(shape) {
    $($board).css('display', 'none');
    if (shape === chosenShape) {
      $($winner).html('YOU WON!');
    } else if (shape === 'IT\'S A DRAW!') {
      $($winner).html(shape);
    } else {
      $($winner).html('YOU LOST :(');
    }
    $($winScreen).css('display', 'block');
  }

  function checkWin(shape) {
    console.log('how many moves so far --->', moves.length);
    console.log('shape being checked --->', shape);
    counter = {};
    for (var i = 0; i < wins.length; i++) {
      counter = { shape: shape, count: 0 };
      for (var j = 0; j < wins[i].length; j++) {
        if (userMoves.includes(wins[i][j]) && counter.shape === chosenShape) {
          counter.count ++;
          if (counter.count === 3) displayWinner(shape);
        } else if (computerMoves.includes(wins[i][j]) && counter.shape === computerShape) {
          counter.count ++;
          if (counter.count === 3) displayWinner(shape);
        } else {
          counter.count = 0;
        }
      }
    }
    if (moves.length === 9) return displayWinner('IT\'S A DRAW!');
  }

  function resetTable() {
    moves.splice(0, moves.length);
    userMoves.splice(0, userMoves.length);
    computerMoves.splice(0, computerMoves.length);
    corners = [0, 2, 6, 8];
    sideMiddle = [1, 3, 5, 7];
    availableMoves = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    for (var i = 0; i < $cells.length; i++) {
      $($cells[i]).html('');
    }
    $($winScreen).css('display', 'none');
    $($shapes).css('display', 'block');
  }

  for (var i = 0; i < $cells.length; i++) {
    $($cells[i]).val(i);
    $($cells[i]).on('click', fillShape);
  }
  $($shape).on('click', chooseShape);
  $($playAgain).on('click', resetTable);
}

$(init);
