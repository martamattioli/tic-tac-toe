function init() {
  const $cells = $('li');
  const $shapes = $('.choose-shapes')[0];
  const $shape = $('.shape');
  const $board = $('ul')[0];
  const $winScreen = $('.win')[0];
  const $winner = $('.win h2')[0];
  const $playAgain = $('.win')[0];
  let chosenShape = '';
  let computerShape = '';
  // const itsX = {isIt: '', shape: 'x'};
  const wins = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
  let corners = [0, 2, 6, 8];
  let availableMoves = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  const moves = [];
  const userMoves = [];
  const computerMoves = [];
  // const movesHistoryX = [];
  // const movesHistoryO = [];
  let numberOfGames = 0;
  let numberOfWins = 0;
  let numberOfLosses = 0;

  function chooseShape(e) {
    chosenShape = $(e.target).attr('value');
    (chosenShape === 'x') ? computerShape = 'o' : computerShape = 'x';
    $($board).css('display', 'block');
    $($shapes).css('display', 'none');
  }

  function checkIfAlmostWon() {
    let counter = {};
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
            checkWin(computerShape);
          }
        }
      }
    }
  }

  function computerTurn(numberTurn) {
    if (numberTurn === 1) {
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
      checkIfAlmostWon();
    }
  }

  function userTurn(e) {
    const clickedItem = $(e.target).val();
    // console.log(`I clicked here: ${clickedItem}`);
    userMoves.push(clickedItem);
    moves.push({item: chosenShape, position: clickedItem});
    availableMoves.splice(clickedItem, 1);
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
    let counter = {};
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
    if (moves.length === 9) displayWinner('IT\'S A DRAW!');
  }

  function resetTable() {
    moves.splice(0,moves.length);
    userMoves.splice(0, userMoves.length);
    computerMoves.splice(0, computerMoves.length);
    corners = [0, 2, 6, 8];
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
