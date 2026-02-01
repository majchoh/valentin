// ===== ELEMENTS =====
const textBox = document.getElementById("text-box");
const buttons = document.getElementById("buttons");
const cat = document.getElementById("cat");
const resultImage = document.getElementById("result-image");

// ===== AUDIO =====
const talkSound = new Audio("talk.mp3");
const sadMusic = new Audio("sad.mp3");
const happyMusic = new Audio("kittygo.mp3");

talkSound.volume = 0.4;
sadMusic.loop = true;
happyMusic.loop = true;

// ===== EMAILJS =====
emailjs.init("sGPlsHosinnShUqhJ");

// ===== STATE =====
let typingSpeed = 80;
let isTyping = false;
let fullText = "";
let interval;

// ===== HELPERS =====
function stopMusic() {
  sadMusic.pause();
  happyMusic.pause();
  sadMusic.currentTime = 0;
  happyMusic.currentTime = 0;
}

function sendEmail(answer) {
  emailjs.send("service_1nz9h1e", "template_50anjxr", {
    answer: answer,
    time: new Date().toLocaleString()
  });
}

function screenShake() {
  document.body.style.animation = "shake 0.4s";
  setTimeout(() => document.body.style.animation = "", 400);
}

// ===== TYPEWRITER =====
function typeText(text, callback) {
  if (isTyping) return;
  isTyping = true;

  fullText = text;
  textBox.textContent = "";
  cat.classList.add("talking");

  let i = 0;
  interval = setInterval(() => {
    textBox.textContent += text[i];
    talkSound.currentTime = 0;
    talkSound.play();
    i++;

    if (i >= text.length) finishTyping(callback);
  }, typingSpeed);

  textBox.onclick = () => finishTyping(callback);
}

function finishTyping(callback) {
  clearInterval(interval);
  textBox.textContent = fullText;
  cat.classList.remove("talking");
  isTyping = false;
  textBox.onclick = null;
  if (callback) callback();
}

// ===== UI =====
function clearButtons() {
  buttons.innerHTML = "";
}

function addButton(label, action) {
  const btn = document.createElement("button");
  btn.textContent = label;
  btn.onclick = action;
  buttons.appendChild(btn);
}

function resetView() {
  cat.style.display = "block";
  resultImage.style.display = "none";
}

// ===== HEARTS =====
function spawnHearts() {
  for (let i = 0; i < 15; i++) {
    const heart = document.createElement("div");
    heart.textContent = "❤️";
    heart.style.position = "fixed";
    heart.style.left = Math.random() * 100 + "vw";
    heart.style.bottom = "0";
    heart.style.fontSize = "24px";
    heart.style.animation = "floatUp 3s ease-out forwards";
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 3000);
  }
}

// ===== DIALOGUE =====
function start() {
  stopMusic();
  resetView();
  typeText("Hej!", () => addButton("Hi", step2));
}

function step2() {
  clearButtons();
  typeText("Imam eno vprašanje", () => addButton("Nadaljuj...", step3));
}

function step3() {
  clearButtons();
  resetView();
  typeText("A bi preživela valentinovo z mano?", () => {
    addButton("Yes", yesAnswer);
    addButton("No", noAnswer);
  });
}

function yesAnswer() {
  clearButtons();
  stopMusic();
  sendEmail("YES ❤️");

  cat.style.display = "none";
  resultImage.src = "cat_yes.gif";
  resultImage.style.display = "block";

  happyMusic.play();
  spawnHearts();
  typeText("❤️ Yay! ❤️");
}

function noAnswer() {
  clearButtons();
  stopMusic();
  sendEmail("NO 😿");

  cat.style.display = "none";
  resultImage.src = "cat_no.jpg";
  resultImage.style.display = "block";

  sadMusic.play();
  screenShake();
  typeText("😿 ...", () => addButton("Premislila sem si", step3));
}

start();