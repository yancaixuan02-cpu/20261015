// sketch.js

const API_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSs6zVry-osH2TrsMWkbD25einHXm6j1g3_ylCE1nnNcNzfv15EomiSqbBuV1CHMMmcYBHTTv6hNCGH/pub?gid=390246399&single=true&output=csv";

let questions = [];
let currentQuestion = 0;
let score = 0;
let selectedAnswer = -1;
let answered = false;
let loading = true;
let errorMessage = "";

function setup() {
  createCanvas(900, 650);
  textFont("Arial");
  loadQuestions();
}

function draw() {
  background("#f4f7fb");

  if (loading) {
    drawLoading();
    return;
  }

  if (errorMessage !== "") {
    drawError();
    return;
  }

  if (questions.length === 0) {
    drawNoQuestions();
    return;
  }

  if (currentQuestion >= questions.length) {
    drawResult();
    return;
  }

  drawQuiz();
}

// 從 Google Apps Script 讀取題目
async function loadQuestions() {
  loading = true;
  errorMessage = "";

  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("無法連線到題庫");
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new Error("題庫格式錯誤");
    }

    questions = data.filter(question => {
      return question["啟用"] === true ||
             question["啟用"] === "TRUE" ||
             question["啟用"] === "true" ||
             question["啟用"] === 1;
    });

    // 如果 Apps Script 沒有啟用欄位，則全部使用
    if (questions.length === 0 && data.length > 0) {
      questions = data;
    }

    shuffleArray(questions);

  } catch (error) {
    console.error(error);
    errorMessage = "題庫載入失敗，請確認 API 網址或網路連線。";
  }

  loading = false;
}

// 顯示載入畫面
function drawLoading() {
  fill("#263238");
  textAlign(CENTER, CENTER);
  textSize(28);
  text("正在載入題庫...", width / 2, height / 2);
}

// 顯示錯誤畫面
function drawError() {
  fill("#c62828");
  textAlign(CENTER, CENTER);
  textSize(24);
  text(errorMessage, width / 2, height / 2 - 30);

  fill("#1976d2");
  rectMode(CENTER);
  rect(width / 2, height / 2 + 50, 150, 45, 8);

  fill("white");
  textSize(18);
  text("重新載入", width / 2, height / 2 + 50);

  rectMode(CORNER);
}

// 沒有題目
function drawNoQuestions() {
  fill("#263238");
  textAlign(CENTER, CENTER);
  textSize(28);
  text("目前沒有可用題目", width / 2, height / 2);
}

// 繪製測驗畫面
function drawQuiz() {
  const question = questions[currentQuestion];

  // 標題
  fill("#263238");
  textAlign(LEFT, TOP);
  textSize(26);
  text("線上題庫測驗", 40, 30);

  // 題號與分數
  textSize(18);
  fill("#546e7a");
  text(
    `第 ${currentQuestion + 1} / ${questions.length} 題`,
    40,
    75
  );

  text(
    `目前得分：${score}`,
    width - 180,
    75
  );

  // 題目區塊
  fill("white");
  rect(40, 115, width - 80, 150, 12);

  fill("#263238");
  textSize(24);
  text(
    question["題目"] || question["question"] || "題目內容",
    70,
    145,
    width - 140,
    100
  );

  // 選項
  const options = [
    {
      key: "A",
      text: question["選項A"] || question["A"] || ""
    },
    {
      key: "B",
      text: question["選項B"] || question["B"] || ""
    },
    {
      key: "C",
      text: question["選項C"] || question["C"] || ""
    },
    {
      key: "D",
      text: question["選項D"] || question["D"] || ""
    }
  ];

  for (let i = 0; i < options.length; i++) {
    const x = 70;
    const y = 300 + i * 65;

    let buttonColor = "#ffffff";

    if (answered) {
      const correctAnswer = normalizeAnswer(question["答案"]);

      if (options[i].key === correctAnswer) {
        buttonColor = "#c8e6c9";
      } else if (options[i].key === selectedAnswer) {
        buttonColor = "#ffcdd2";
      }
    } else if (selectedAnswer === options[i].key) {
      buttonColor = "#bbdefb";
    }

    fill(buttonColor);
    stroke("#90a4ae");
    strokeWeight(2);
    rect(x, y, width - 140, 50, 8);

    noStroke();
    fill("#263238");
    textAlign(LEFT, CENTER);
    textSize(20);

    text(
      `${options[i].key}. ${options[i].text}`,
      x + 20,
      y + 25
    );
  }

  // 回饋訊息
  if (answered) {
    const correctAnswer = normalizeAnswer(question["答案"]);

    textAlign(LEFT, TOP);
    textSize(18);

    if (selectedAnswer === correctAnswer) {
      fill("#2e7d32");
      text("答對了！", 70, 570);
    } else {
      fill("#c62828");
      text(`答錯了，正確答案是 ${correctAnswer}`, 70, 570);
    }

    if (question["解釋"]) {
      fill("#455a64");
      textSize(16);
      text(`解析：${question["解釋"]}`, 70, 595, width - 140, 40);
    }
  } else {
    fill("#607d8b");
    textAlign(CENTER, CENTER);
    textSize(16);
    text("請點選一個答案", width / 2, 625);
  }
}

// 滑鼠點擊
function mousePressed() {
  // 重新載入
  if (errorMessage !== "") {
    if (
      mouseX > width / 2 - 75 &&
      mouseX < width / 2 + 75 &&
      mouseY > height / 2 + 25 &&
      mouseY < height / 2 + 75
    ) {
      loadQuestions();
    }

    return;
  }

  // 測驗結束後重新開始
  if (currentQuestion >= questions.length) {
    if (
      mouseX > width / 2 - 100 &&
      mouseX < width / 2 + 100 &&
      mouseY > 460 &&
      mouseY < 510
    ) {
      restartQuiz();
    }

    return;
  }

  if (answered) {
    if (mouseY > 560) {
      nextQuestion();
    }

    return;
  }

  // 判斷是否點擊選項
  for (let i = 0; i < 4; i++) {
    const y = 300 + i * 65;

    if (
      mouseX > 70 &&
      mouseX < width - 70 &&
      mouseY > y &&
      mouseY < y + 50
    ) {
      selectAnswer(["A", "B", "C", "D"][i]);
      return;
    }
  }
}

// 選擇答案
function selectAnswer(answer) {
  if (answered) return;

  selectedAnswer = answer;
  answered = true;

  const correctAnswer = normalizeAnswer(
    questions[currentQuestion]["答案"]
  );

  if (selectedAnswer === correctAnswer) {
    score++;
  }
}

// 下一題
function nextQuestion() {
  currentQuestion++;
  selectedAnswer = -1;
  answered = false;
}

// 重新開始測驗
function restartQuiz() {
  currentQuestion = 0;
  score = 0;
  selectedAnswer = -1;
  answered = false;

  shuffleArray(questions);
}

// 顯示結果
function drawResult() {
  background("#e3f2fd");

  fill("#263238");
  textAlign(CENTER, CENTER);

  textSize(36);
  text("測驗完成！", width / 2, 180);

  textSize(28);
  text(
    `你的分數：${score} / ${questions.length}`,
    width / 2,
    260
  );

  const percentage = Math.round((score / questions.length) * 100);

  textSize(24);
  text(`正確率：${percentage}%`, width / 2, 315);

  fill("#1976d2");
  rectMode(CENTER);
  rect(width / 2, 485, 200, 55, 10);

  fill("white");
  textSize(20);
  text("重新開始", width / 2, 485);

  rectMode(CORNER);
}

// 將答案格式統一
function normalizeAnswer(answer) {
  if (answer === undefined || answer === null) {
    return "";
  }

  const value = String(answer).trim().toUpperCase();

  if (value === "1") return "A";
  if (value === "2") return "B";
  if (value === "3") return "C";
  if (value === "4") return "D";

  if (value.includes("A")) return "A";
  if (value.includes("B")) return "B";
  if (value.includes("C")) return "C";
  if (value.includes("D")) return "D";

  return value;
}

// 洗牌
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// 讓畫面可以適應視窗
function windowResized() {
  resizeCanvas(
    Math.min(windowWidth - 30, 900),
    Math.min(windowHeight - 30, 650)
  );
}