const $ = document;
const hiddenWordContainer = $.querySelector(".hidden-word");
const hangManImg = $.querySelector(".hangman-img");
const navbar = $.querySelector("nav");
const homeElem = $.querySelector(".home");
const backElem = $.querySelector(".back");
const tipElem = $.querySelector(".tip");
const scoreElem = $.querySelector(".score");
const heartElem = $.querySelector(".heart");
const gameOverMenu = $.querySelector(".game-over-menu");
const loadingScreen = $.querySelector(".loading-screen");




let steps = 0;
let heartCount = 10;
let scoreCount = +localStorage.getItem("score");
let secretWordObj = "";
let lettersArray = [];



async function addDomElements() {
  loadingScreen.style.display = "none";
  secretWordObj = await getWord();

  lettersArray = secretWordObj.title.split(" ").join("").split("");

  displayWordBox(secretWordObj);
  displayKeyboard();
  loadNav(secretWordObj);
}

const displayKeyboard = () => {
  const keyboardContainer = $.querySelector(".keyboard");
  let keyboardHTML = "";

  for (let i = 97; i <= 122; i++) {
    keyboardHTML += `<div class=" h-full w-full bg-blueBackground/45 rounded-3xl shadow-[0px_2px_0px_2px_rgba(0,0,0,1)] flex items-center justify-center text-lg text-white font-bold hover:scale-110 hover:cursor-pointer hover:bg-slate-500 active:scale-75 ease-out sm:text-2xl" onclick='typeTheLetter(
      event
    ); this.onclick=null;'>${String.fromCharCode(i)}</div>`;
  }
  keyboardContainer.insertAdjacentHTML("afterbegin", keyboardHTML);
};

async function getWord() {
  let category = localStorage.getItem("category").toLowerCase();

  try {
    let response = await fetch(
      "http://127.0.0.1:5500/public/src/json/data.json",
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }
    );
    let data = await response.json();
    let wordsList = await data[category];
    wordObj = await wordsList[Math.floor(Math.random() * 4)];
  } catch {
    throw new Error();
  }

  return wordObj;
}

const displayWordBox = (secretWordObj) => {
  let secretPhraseArray = secretWordObj.title.split(" ");
  let hiddenWordContainerHtml = "";

  secretPhraseArray.forEach((word) => {
    hiddenWordContainerHtml += `<div class="flex gap-2 w-full justify-center">${word
      .split("")
      .map((letter) => {
        return `<div class=" basis-[1.5rem] flex items-center justify-center  border-black border-2  text-transparent  rounded-sm shadow-[0px_2px_2px_0px_rgba(0,0,0,1)] font-bold sm:text-md sm:basis-[2rem] sm:h-[2rem] md:text-lg md:basis-[3rem] md:h-[3rem]">${letter}</div>`;
      })
      .join("")}</div>`;
  });

  hiddenWordContainer.insertAdjacentHTML("afterbegin", hiddenWordContainerHtml);
};

const loadNav = (secretWordObj) => {
  homeElem.addEventListener("click", () => {
    goToHome();
  });

  backElem.addEventListener("click", () => {
    goToMenu();
  });

  tipElem.addEventListener(
    "click",
    () => {
      let tipContainer = $.querySelector(".tip-container");
      tipContainer.classList.add("w-1/2");
      tipContainer.insertAdjacentHTML(
        "afterbegin",
        `<p>${secretWordObj.description}</p>`
      );
    },
    { once: true }
  );

  setScore();

  setHeart();
};

const goToHome = () => {
  location.assign("http://127.0.0.1:5500/public/index.html");
};

const goToMenu = () => {
  location.assign("http://127.0.0.1:5500/public/src/menu/menu.html");
};

const setScore = () => {
  if (!scoreCount) {
    scoreCount = 0;
  }
  scoreElem.children[1].innerHTML = scoreCount;
  localStorage.setItem("score", scoreCount);
};

const setHeart = () => {
  heartElem.children[1].innerHTML = heartCount;
};

const typeTheLetter = (event) => {
  let clickedBtn = event.target;
  let clickedLetter = event.target.innerHTML;
  let statusFlag;

  changeKeyboard(clickedBtn);

  if (secretWordObj.title.includes(clickedLetter)) {
    activeLetters(clickedLetter);
    statusFlag = true;
  } else {
    changeStatus();
    statusFlag = false;
  }

  checkStatus(clickedLetter, statusFlag);
};

const changeKeyboard = (button) => {
  button.classList.remove("hover:bg-slate-500", "active:scale-75");
  button.classList.add("opacity-20");
};

const activeLetters = (letter) => {
  for (innerChildren of hiddenWordContainer.children) {
    for (child of innerChildren.children) {
      if (child.innerHTML === letter) {
        child.classList.remove("text-transparent");
        child.classList.add("bg-purpleBackground");
      }
    }
  }
};

const changeStatus = () => {
  heartCount -= 1;
  if (steps === 0) {
    hangManImg.classList.remove("opacity-0");
  }

  hangManImg.src = `../img/hangman/${++steps}.png`;

  setHeart();
};

const checkStatus = (letter, flag) => {
  if (flag) {
    lettersArray = lettersArray.filter((wordLetter) => {
      if (letter !== wordLetter) {
        return wordLetter;
      }
    });

    if (lettersArray.length === 0) {
      scoreCount += 100;
      setScore();
      showEndGameScreen(true);
    }
  } else {
    if (heartCount === 0) {
      showEndGameScreen(false);
    }
  }
};

const showEndGameScreen = (flag) => {
  const finalScore = $.querySelector(".final-score");
  const answer = $.querySelector(".answer");
  const winText = $.querySelector(".win-text");
  const homeBtn = $.querySelector(".over-btn-home");
  const menuBtn = $.querySelector(".over-btn-menu");

  if (flag) {
    gameOverMenu.classList.remove("invisible", "opacity-0");
    finalScore.innerHTML = `<i class="ri-star-fill"></i><span class="final-score">${scoreCount}</span>
          </div>`;
    winText.innerHTML = "YOU WON!!";
  } else {
    gameOverMenu.classList.remove("invisible", "opacity-0");
    winText.innerHTML = "YOU LOST:(";
    answer.innerHTML = secretWordObj.title;
  }

  menuBtn.addEventListener("click", () => {
    goToMenu();
  });
  homeBtn.addEventListener("click", () => {
    goToHome();
  });
};


window.addEventListener("load", addDomElements);

