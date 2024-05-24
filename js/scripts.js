// Konstanta dan variabel
const minDistance = 20; // jarak minimum dalam piksel
const elements = document.querySelectorAll(".flowchart"); // ambil semua elemen yang ingin diposisikan secara acak
let correctElement;
let countdownInterval;
let countdownTime = 30; // Waktu game

// Preload audio elements
const playSound = document.getElementById("playSound");
const correctSound = document.getElementById("correctSound");
const wrongSound = document.getElementById("wrongSound");

// Fungsi untuk memposisikan elemen secara acak dengan jarak minimum
function randomPosition(element, existingElements, minDistance) {
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  const maxLeft = windowWidth - element.offsetWidth;
  const maxTop = windowHeight - element.offsetHeight;

  let left, top;
  let isOverlapping;

  do {
    left = Math.floor(Math.random() * maxLeft);
    top = Math.floor(Math.random() * maxTop);
    isOverlapping = false;

    for (let i = 0; i < existingElements.length; i++) {
      const existingElement = existingElements[i];
      const existingRect = existingElement.getBoundingClientRect();
      const newRect = {
        left: left,
        top: top,
        right: left + element.offsetWidth,
        bottom: top + element.offsetHeight,
      };

      if (
        newRect.left < existingRect.right + minDistance &&
        newRect.right > existingRect.left - minDistance &&
        newRect.top < existingRect.bottom + minDistance &&
        newRect.bottom > existingRect.top - minDistance
      ) {
        isOverlapping = true;
        break;
      }
    }
  } while (isOverlapping);

  element.style.left = `${left}px`;
  element.style.top = `${top}px`;
}

// Fungsi untuk memposisikan semua elemen flowchart
function positioningFlowchart() {
  elements.forEach((element) => {
    randomPosition(
      element,
      Array.from(elements).filter((el) => el !== element),
      minDistance
    );
  });
}

// Fungsi untuk memilih elemen yang benar secara acak
function selectCorrectElement() {
  if (correctElement) {
    correctElement.style.border = "none"; // reset border sebelumnya
  }
  correctElement = elements[Math.floor(Math.random() * elements.length)];
  correctElement.style.border = "2px solid green"; // tandai elemen yang benar
}

// Fungsi untuk menambah skor dan memposisikan ulang elemen
function incrementScore() {
  let score = document.getElementById("score");
  let currentScore = parseInt(score.innerText);
  score.innerText = currentScore + 1;

  positioningFlowchart();
  selectCorrectElement();
}

// Fungsi untuk mengurangi skor dan memposisikan ulang elemen
function decrementScore() {
  let score = document.getElementById("score");
  let currentScore = parseInt(score.innerText);
  score.innerText = currentScore - 1;

  positioningFlowchart();
  selectCorrectElement();
}

// Fungsi untuk memperbarui skor tertinggi
function endScore() {
  let currentScore = parseInt(document.getElementById("score").textContent);
  let endPoint = parseInt(document.getElementById("endPoint").textContent);
  if (currentScore > endPoint) {
    endPoint = currentScore;
    document.getElementById("endPoint").textContent = endPoint;
  }
}

// Fungsi untuk mengelola hitungan mundur
function countdown() {
  countdownTime--;
  document.getElementById("countdown").innerHTML = countdownTime;

  if (countdownTime <= 0) {
    clearInterval(countdownInterval);
    document.getElementById("restart").style.display = "block";
    hideGamePlay();
    endScore();
  }
}

function startGame() {
  // Memutar suara saat tombol play ditekan
  playSound.play();
  let url = "/play";
  window.location.href = url;
}

// Fungsi untuk menyembunyikan elemen permainan setelah waktu habis
function hideGamePlay() {
  elements.forEach((element) => {
    element.style.display = "none";
  });
  document.getElementById("menu").style.display = "none";
}

// Tambahkan event listener untuk elemen flowchart
elements.forEach((element) => {
  element.addEventListener("click", () => {
    if (element === correctElement) {
      // Memutar suara ketika flowchart yang benar diklik
      correctSound.currentTime = 0; // Mengatur ulang waktu audio ke awal
      correctSound.play();
      incrementScore();
    } else {
      // Memutar suara ketika flowchart yang salah diklik
      wrongSound.currentTime = 0; // Mengatur ulang waktu audio ke awal
      wrongSound.play();
      decrementScore();
    }
  });
});

// Mulai permainan saat DOM siap
document.addEventListener("DOMContentLoaded", function () {
  countdownInterval = setInterval(countdown, 1000);
  selectCorrectElement();
  positioningFlowchart();
});
