let textBox = document.querySelectorAll(".textBox");
let WORD = 5;

let row = 0;
let currentGuess = "";
let correctWord; // this is the correct
let isWord;

//  Handle all typing
function writing(e) {
  if (currentGuess.length < WORD) {
    currentGuess += e.key;
    textBox[row * WORD + currentGuess.length - 1].innerText = e.key;
  }
}

// Limit the typing to letters
function checkIfLetter(e) {
  if (e.keyCode <= 122 && e.keyCode >= 97) {
    return true;
  } else if (e.keyCode <= 90 && e.keyCode >= 65) {
    return true;
  } else {
    return false;
  }
}

// Handle deleting last letter
function handleBackSpace() {
  currentGuess = currentGuess.slice(0, -1);
  textBox[row * WORD + currentGuess.length].innerText = "";
}

// Get word of the day
async function getWord() {
  let askForWord = await fetch(
    "https://words.dev-apis.com/word-of-the-day?random=1"
  );
  let response = await askForWord.json();
  correctWord = response.word;
}

// Check if the submitted word exists flash in red if invalid
async function checkIfValid() {
  let sendWord = await fetch("https://words.dev-apis.com/validate-word", {
    method: "POST",
    body: JSON.stringify({ word: currentGuess }),
  });
  let response = await sendWord.json();
  isWord = response.validWord;
  if (isWord === true) {
    handleEnter();
  } else {
    for (let i = 0; i < WORD; i++) {
      textBox[row * WORD + i].classList.add("invalid");
    }
    setTimeout(() => {
      for (let i = 0; i < WORD; i++) {
        textBox[row * WORD + i].classList.remove("invalid");
      }
    }, 500);
  }
}

// Handle enter
function handleEnter() {
  currentGuess = currentGuess.toLowerCase();
  correctWord = correctWord.toLowerCase();
  // make arrays out of the guess and the word of the day
  let currentGuessArray = currentGuess.split("");
  let correctWordArray = correctWord.split("");
  if (currentGuess === correctWord) {
    for (i = 0; i < WORD; i++) {
      // if correct word -> win
      textBox[row * WORD + i].classList.add("correct");
    }
    handleWin();
  } else if (currentGuess.length === WORD) {
    for (i = 0; i < WORD; i++) {
      if (!correctWordArray.includes(currentGuess[i])) {
        // Gray if letter is not included in the word
        textBox[row * WORD + i].classList.add("not-included");
      }
      for (j = 0; j < WORD; j++) {
        if (currentGuessArray[i] === correctWordArray[i]) {
          // same place -> green
          textBox[row * WORD + i].classList.add("correct");
          currentGuessArray[i] = "";
          correctWordArray[i] = "";
        } else if (currentGuessArray[i] === correctWordArray[j] && i != j) {
          // different place -> orange
          textBox[row * WORD + i].classList.add("close");
          currentGuessArray[i] = "";
          correctWordArray[j] = "";
        }
      }
    }
  }
  // move to next row
  row++;
  // reset guess
  if (row === 6 && currentGuess != correctWord) {
    // display end game screen
    handleLoss();
  }
  currentGuess = "";
}

//  Display winning screen
let resetButton = document.querySelector(".reset-button");
function handleWin() {
  let wordText = document.createElement("p");
  let rowText = document.createElement("p");
  let winModal = document.querySelector(".end-modal");
  let congratulations = document.createElement("h1");
  if (row === 0) {
    rowText.innerText = `You correctly guessed the word in ${row + 1} try.`;
  } else {
    rowText.innerText = `You correctly guessed the word in ${row + 1} tries.`;
  }
  wordText.innerText = `The word was ${correctWord}`;
  congratulations.innerText = `Congratulations!`;
  congratulations.classList.add("win");
  winModal.append(congratulations, wordText, rowText);
  winModal.classList.remove("hidden");
  resetButton.classList.remove("hidden");
}

// Display losing screen
function handleLoss() {
  let youLose = document.createElement("h1");
  let wordText = document.createElement("p");
  let lossModal = document.querySelector(".lose-modal");
  wordText.innerText = `The word was: ${correctWord}`;
  youLose.innerText = `You lost! :( `;
  youLose.classList.add("lose");
  lossModal.append(youLose);
  lossModal.append(wordText);
  lossModal.classList.remove("hidden");
  resetButton.classList.remove("hidden");
}

// Keyboard

const keyBoard = () => {
  let keyB = [
    "q",
    "w",
    "e",
    "r",
    "t",
    "y",
    "u",
    "i",
    "o",
    "p",
    "a",
    "s",
    "d",
    "f",
    "g",
    "h",
    "j",
    "k",
    "l",
    "⏎",
    "z",
    "x",
    "c",
    "v",
    "b",
    "n",
    "m",
    "←",
  ];

  const keyBoardContainer = document.querySelector(".keyboard");

  for (let i = 0; i < keyB.length; i++) {
    let key = document.createElement("button");
    key.innerText = keyB[i].toUpperCase();
    key.classList.add("key");
    key.setAttribute(`value`, `${keyB[i]}`);
    key.setAttribute(`id`, `${keyB[i]}`);
    keyBoardContainer.append(key);
    key.onclick = () => {
      if (key.value === "←") {
        handleBackSpace();
      } else if (key.value === "⏎") {
        checkIfValid();
      } else if (currentGuess.length < WORD) {
        currentGuess += key.value;
        textBox[row * WORD + currentGuess.length - 1].innerText = key.value;
      }
    };
  }
};

// Init game
document.addEventListener("load", getWord());
document.addEventListener("keyup", (e) => {
  if (checkIfLetter(e)) {
    writing(e);
  } else if (e.key === "Backspace") {
    handleBackSpace();
  } else if (e.key === "Enter") {
    checkIfValid();
  }
});
keyBoard();
