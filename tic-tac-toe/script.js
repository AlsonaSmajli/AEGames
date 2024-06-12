"use strict";

// PIXI setup
const app = new PIXI.Application({
  width: window.innerWidth,
  height: window.innerHeight,
  transparent: true,
  resizeTo: window
});
document.getElementById("background-container").appendChild(app.view);

const graphicsContainer = new PIXI.Container();
app.stage.addChild(graphicsContainer);

// Function to create a pink star
const createStar = (x, y) => {
  const star = new PIXI.Graphics();
  star.beginFill(0xff69b4); // Pink color
  star.drawStar(0, 0, 5, 10); // Smaller star for a background effect
  star.endFill();
  star.x = x;
  star.y = y;
  graphicsContainer.addChild(star);

  // Animation to move the stars
  app.ticker.add(() => {
    star.y += 0.5;
    if (star.y > app.screen.height) {
      star.y = -star.height;
    }
  });
};

// Function to create multiple stars
const createStarField = () => {
  for (let i = 0; i < 100; i++) { // Adjust the number of stars as needed
    const x = Math.random() * app.screen.width;
    const y = Math.random() * app.screen.height;
    createStar(x, y);
  }
};

// Function to clear the star field
const clearStarField = () => {
  graphicsContainer.removeChildren();
};

// Game setup
const Player = (sign) => {
  this.sign = sign;

  const getSign = () => {
    return sign;
  };

  return { getSign };
};

const gameBoard = (() => {
  const board = ["", "", "", "", "", "", "", "", ""];

  const setField = (index, sign) => {
    if (index > board.length) return;
    board[index] = sign;
  };

  const getField = (index) => {
    if (index > board.length) return;
    return board[index];
  };

  const reset = () => {
    for (let i = 0; i < board.length; i++) {
      board[i] = "";
    }
    clearStarField(); // Clear stars on reset
  };

  return { setField, getField, reset };
})();

const displayController = (() => {
  const fieldElements = document.querySelectorAll(".field");
  const messageElement = document.getElementById("message");
  const restartButton = document.getElementById("restart-button");

  fieldElements.forEach((field) =>
    field.addEventListener("click", (e) => {
      if (gameController.getIsOver() || e.target.textContent !== "") return;
      gameController.playRound(parseInt(e.target.dataset.index));
      updateGameboard();
    })
  );

  restartButton.addEventListener("click", (e) => {
    gameBoard.reset();
    gameController.reset();
    updateGameboard();
    setMessageElement("Player X's turn");
    restartButton.classList.add("hidden");
  });

  const updateGameboard = () => {
    for (let i = 0; i < fieldElements.length; i++) {
      fieldElements[i].textContent = gameBoard.getField(i);
    }
  };

  const setResultMessage = (winner) => {
    if (winner === "Draw") {
      messageElement.textContent = "No one has won!";
      messageElement.classList.remove("player-winner");
    } else {
      messageElement.textContent = `Player ${winner} has won!`;
      messageElement.classList.add("player-winner");
      createStarField(); // Trigger star field animation on win
    }
    restartButton.classList.remove("hidden"); // Show the button on game over
  };

  const setMessageElement = (message) => {
    messageElement.textContent = message;
  };

  return { setResultMessage, setMessageElement };
})();

const gameController = (() => {
  const playerX = Player("X");
  const playerO = Player("O");
  let round = 1;
  let isOver = false;

  const playRound = (fieldIndex) => {
    gameBoard.setField(fieldIndex, getCurrentPlayerSign());
    if (checkWinner(fieldIndex)) {
      displayController.setResultMessage(getCurrentPlayerSign());
      isOver = true;
      return;
    }
    if (round === 9) {
      displayController.setResultMessage("Draw");
      isOver = true;
      return;
    }
    round++;
    displayController.setMessageElement(
      `Player ${getCurrentPlayerSign()}'s turn`
    );
  };

  const getCurrentPlayerSign = () => {
    return round % 2 === 1 ? playerX.getSign() : playerO.getSign();
  };

  const checkWinner = (fieldIndex) => {
    const winConditions = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    return winConditions
      .filter((combination) => combination.includes(fieldIndex))
      .some((possibleCombination) =>
        possibleCombination.every(
          (index) => gameBoard.getField(index) === getCurrentPlayerSign()
        )
      );
  };

  const getIsOver = () => {
    return isOver;
  };

  const reset = () => {
    round = 1;
    isOver = false;
  };

  return { playRound, getIsOver, reset };
})();
