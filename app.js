let textBox = document.querySelectorAll(".textBox");
let keyBoard = document.querySelector(".keyboard");
let WORD = 5;

let row = 0;
let currentGuess = "";
let correctWord; // this is the correct
let isWord;

//  Handndle all typing
function writing(e) {
  if (currentGuess.length < WORD) {
    currentGuess += e.key;
    textBox[row * WORD + currentGuess.length - 1].innerText = e.key;
  }
}

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

// Check if the submited word exists flash in red if invalid
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
  let currentGuessArray = currentGuess.split("");
  let correctWordArray = correctWord.split("");
  if (currentGuess === correctWord) {
    for (i = 0; i < WORD; i++) {
      textBox[row * WORD + i].classList.add("correct");
    }
    alert("you win");
  } else if (currentGuess.length === WORD) {
    for (i = 0; i < WORD; i++) {
      for (j = 0; j < WORD; j++) {
        if (currentGuessArray[i] === correctWordArray[i]) {
          textBox[row * WORD + i].classList.add("correct");
          currentGuessArray[i] = "";
          correctWordArray[i] = "";
        } else if (currentGuessArray[i] === correctWordArray[j] && i !== j) {
          textBox[row * WORD + i].classList.add("close");
          currentGuessArray[i] = "";
          correctWordArray[j] = "";
        }
      }
    }
    row++;
    currentGuess = "";
  }
  if (row === 6 && currentGuess !== correctWord) {
    alert(`you lose the word was: ${correctWord}`);
  }
}

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
