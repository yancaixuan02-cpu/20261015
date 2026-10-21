---
title: 選擇題測驗卷網站講義（學生版）.md

---

---
title: 選擇題測驗卷網站講義（學生版）

---

---
title: 選擇題測驗卷網站講義（學生版）
tags: [114程式設計與實習_上學期]

---

# 選擇題測驗卷網站講義（學生版）

學號：＿＿＿＿＿＿＿＿　　姓名：＿＿＿＿＿＿＿＿

> **填寫方式**
> 1. 每個學習都要放：**執行截圖**、**三次問 AI 的提示詞**、**最後採用的程式碼**。
> 2. 問 AI 的提示詞請**逐字貼上**自己實際輸入的內容（不要寫摘要），第一次、第二次、第三次依序記錄。
> 3. 程式碼貼在「點開貼上」的收合區塊裡，貼上**你最後真正採用、而且能執行**的版本。

---

## 學習1：產生一個選擇題測驗卷網站

https://cfchen58.synology.me/115/week4/stage1/

**這個階段的目標：** 用 p5.js 做出一個一次顯示一題、四個選項、答完會顯示對錯與總分的測驗網站（題目先寫在程式裡）。
**這個階段會修改的檔案：** index.html、sketch.js

### 執行截圖

![image](https://hackmd.io/_uploads/SJFUD3Esfx.png)

![動畫](https://hackmd.io/_uploads/r1BJ5hVsGg.gif)
### 第一次問 AI

```tex!
使用p5.js撰寫一個選擇題網頁測驗系統，我已經產生一個p5.js專案，請把程式碼寫到sketch.js檔案內，每條指令都加上中文註解。測驗系統題目設定為五題，測驗題目的內容為程式設計p5.js簡易指令練習測驗，系統採用全螢幕畫布，使用者答錯題目時，系統會在正確答案選項上，加上d9ed92背景顏色，該選項要上下跳動，答錯的選項採用e63946背景顏色，選項左右移動，選擇題選項共有四個選項，當五題結束後，需要顯示答對的題數，每次顯示一個題目，需要有下一提的按鈕。
```
### 第二次問 AI

```tex!
```

### 第三次問 AI

```tex!
（逐字貼上你第三次問 AI 的提示詞）
```

### 程式碼內容

:::info
:::spoiler 點開貼上學習1的程式碼
```javascript=
// 儲存所有測驗題目資料
let questions = [
  {
    question: "哪一個函式可以建立 p5.js 畫布？",
    options: ["setup()", "createCanvas()", "draw()", "background()"],
    answer: 1,
    explanation: "createCanvas() 用來建立 p5.js 畫布，並設定畫布的寬度與高度。"
  },
  {
    question: "哪一個函式可以設定畫布背景顏色？",
    options: ["fill()", "stroke()", "background()", "text()"],
    answer: 2,
    explanation: "background() 用來設定畫布的背景顏色。"
  },
  {
    question: "哪一個函式可以繪製圓形或橢圓形？",
    options: ["ellipse()", "rect()", "line()", "triangle()"],
    answer: 0,
    explanation: "ellipse() 可以繪製橢圓形，當寬度與高度相同時就會形成圓形。"
  },
  {
    question: "哪一個函式可以設定圖形的填滿顏色？",
    options: ["stroke()", "fill()", "textSize()", "noFill()"],
    answer: 1,
    explanation: "fill() 用來設定圖形或文字的填滿顏色。"
  },
  {
    question: "哪一個函式會在 setup() 後持續重複執行？",
    options: ["setup()", "draw()", "mousePressed()", "preload()"],
    answer: 1,
    explanation: "draw() 會在 setup() 執行後持續重複執行，適合製作動畫。"
  }
];

// 儲存目前題目編號
let currentQuestion = 0;

// 儲存答對題數
let score = 0;

// 儲存使用者每一題的答案
let userAnswers = [];

// 儲存使用者是否已經回答目前題目
let answered = false;

// 儲存目前選擇的選項
let selectedOption = -1;

// 儲存目前畫面狀態
let gameState = "quiz";

// 儲存選項按鈕資料
let optionButtons = [];

// 儲存下一題按鈕資料
let nextButton = {};

// 儲存重新開始按鈕資料
let restartButton = {};

// 儲存結果頁捲動位置
let resultScrollY = 0;

// 儲存結果頁觸控起始位置
let touchStartY = 0;

// 儲存是否正在觸控捲動
let isDragging = false;

// 設定正確答案背景顏色
const CORRECT_COLOR = "#d9ed92";

// 設定錯誤答案背景顏色
const WRONG_COLOR = "#e63946";

// 設定主要文字顏色
const TEXT_COLOR = "#1d3557";

// 設定畫布背景顏色
const BACKGROUND_COLOR = "#f1faee";

// p5.js 初始化函式
function setup() {
  // 建立全螢幕畫布
  createCanvas(windowWidth, windowHeight);

  // 設定文字使用置中對齊
  textAlign(CENTER, CENTER);

  // 設定文字使用平滑顯示
  textFont("Arial");

  // 初始化每一題的作答紀錄
  userAnswers = Array(questions.length).fill(-1);

  // 設定畫面更新速度
  frameRate(60);
}

// p5.js 每一幀執行的函式
function draw() {
  // 設定畫布背景顏色
  background(BACKGROUND_COLOR);

  // 判斷目前要繪製測驗頁或結果頁
  if (gameState === "quiz") {
    // 繪製測驗頁面
    drawQuizPage();
  } else {
    // 繪製結果頁面
    drawResultPage();
  }
}

// 繪製測驗頁面
function drawQuizPage() {
  // 取得目前題目資料
  let currentData = questions[currentQuestion];

  // 設定標題文字顏色
  fill(TEXT_COLOR);

  // 設定標題文字大小
  textSize(min(width * 0.045, 36));

  // 繪製測驗標題
  text("p5.js 簡易指令練習測驗", width / 2, 42);

  // 設定題數文字大小
  textSize(min(width * 0.025, 20));

  // 顯示目前題數
  text(
    "第 " + (currentQuestion + 1) + " 題 / 共 " + questions.length + " 題",
    width / 2,
    82
  );

  // 設定題目卡片寬度
  let cardWidth = min(width * 0.88, 900);

  // 設定題目卡片高度
  let cardHeight = 145;

  // 設定題目卡片左側位置
  let cardX = width / 2 - cardWidth / 2;

  // 設定題目卡片上方位置
  let cardY = 110;

  // 設定題目卡片圓角
  rectMode(CORNER);

  // 設定題目卡片填滿顏色
  fill("#ffffff");

  // 設定題目卡片線條顏色
  stroke("#a8dadc");

  // 設定題目卡片線條寬度
  strokeWeight(2);

  // 繪製題目卡片
  rect(cardX, cardY, cardWidth, cardHeight, 18);

  // 關閉線條
  noStroke();

  // 設定題目文字顏色
  fill(TEXT_COLOR);

  // 設定題目文字大小
  textSize(min(width * 0.03, 25));

  // 繪製題目文字
  text(currentData.question, width / 2, cardY + cardHeight / 2);

  // 設定選項按鈕寬度
  let optionWidth = min(width * 0.78, 700);

  // 設定選項按鈕高度
  let optionHeight = 58;

  // 設定選項按鈕間距
  let optionGap = 14;

  // 設定選項區域開始位置
  let optionStartY = 285;

  // 清空選項按鈕資料
  optionButtons = [];

  // 逐一繪製四個選項
  for (let i = 0; i < currentData.options.length; i++) {
    // 計算原始選項的垂直位置
    let originalY = optionStartY + i * (optionHeight + optionGap);

    // 設定選項的水平動畫位移
    let offsetX = 0;

    // 設定選項的垂直動畫位移
    let offsetY = 0;

    // 判斷目前選項是否為答錯的選項
    let isWrongOption = answered && selectedOption === i && selectedOption !== currentData.answer;

    // 判斷目前選項是否為正確答案
    let isCorrectOption = answered && i === currentData.answer;

    // 讓答錯的選項左右移動
    if (isWrongOption) {
      // 使用 sin() 製造左右震動效果
      offsetX = sin(frameCount * 0.45) * 12;
    }

    // 讓答錯後的正確選項上下跳動
    if (isCorrectOption && selectedOption !== currentData.answer) {
      // 使用 sin() 製造上下跳動效果
      offsetY = sin(frameCount * 0.35) * 10;
    }

    // 計算選項實際繪製位置
    let buttonX = width / 2 - optionWidth / 2 + offsetX;

    // 計算選項實際繪製位置
    let buttonY = originalY + offsetY;

    // 儲存選項按鈕範圍
    optionButtons.push({
      x: buttonX,
      y: buttonY,
      width: optionWidth,
      height: optionHeight
    });

    // 設定尚未作答時的選項背景顏色
    let buttonColor = "#ffffff";

    // 答對時將正確答案標示為綠色
    if (answered && i === currentData.answer) {
      buttonColor = CORRECT_COLOR;
    }

    // 答錯時將使用者選錯的選項標示為紅色
    if (isWrongOption) {
      buttonColor = WRONG_COLOR;
    }

    // 設定選項背景顏色
    fill(buttonColor);

    // 設定選項外框顏色
    stroke("#457b9d");

    // 設定選項外框寬度
    strokeWeight(2);

    // 繪製選項按鈕
    rect(buttonX, buttonY, optionWidth, optionHeight, 14);

    // 關閉外框
    noStroke();

    // 設定選項文字顏色
    fill(TEXT_COLOR);

    // 設定選項文字大小
    textSize(min(width * 0.025, 21));

    // 繪製選項文字
    text(
      String.fromCharCode(65 + i) + ". " + currentData.options[i],
      width / 2 + offsetX,
      buttonY + optionHeight / 2
    );
  }

  // 作答後才顯示下一題按鈕
  if (answered) {
    // 計算下一題按鈕寬度
    let buttonWidth = 190;

    // 計算下一題按鈕高度
    let buttonHeight = 52;

    // 計算下一題按鈕位置
    let buttonX = width / 2 - buttonWidth / 2;

    // 計算下一題按鈕位置
    let buttonY = min(height - 80, optionStartY + 4 * (optionHeight + optionGap) + 20);

    // 儲存下一題按鈕範圍
    nextButton = {
      x: buttonX,
      y: buttonY,
      width: buttonWidth,
      height: buttonHeight
    };

    // 設定下一題按鈕背景顏色
    fill("#457b9d");

    // 繪製下一題按鈕
    rect(buttonX, buttonY, buttonWidth, buttonHeight, 14);

    // 設定按鈕文字顏色
    fill("#ffffff");

    // 設定按鈕文字大小
    textSize(20);

    // 顯示下一題或查看成績文字
    text(
      currentQuestion === questions.length - 1 ? "查看成績與解析" : "下一題",
      width / 2,
      buttonY + buttonHeight / 2
    );
  }
}

// 繪製結果頁面
function drawResultPage() {
  // 設定結果頁標題文字顏色
  fill(TEXT_COLOR);

  // 設定結果頁標題文字大小
  textSize(min(width * 0.045, 36));

  // 顯示結果頁標題
  text("測驗完成！", width / 2, 42);

  // 設定成績文字大小
  textSize(min(width * 0.03, 25));

  // 顯示答對題數
  text(
    "答對題數：" + score + " / " + questions.length,
    width / 2,
    82
  );

  // 設定結果內容區域位置
  let contentX = 25;

  // 設定結果內容區域寬度
  let contentWidth = width - 50;

  // 設定結果內容區域上方位置
  let contentTop = 115;

  // 設定結果內容區域高度
  let contentHeight = height - 190;

  // 儲存畫布狀態
  push();

  // 限制解析內容只能顯示在結果區域
  drawingContext.save();

  // 設定結果區域裁切範圍
  drawingContext.beginPath();

  // 設定結果區域裁切矩形
  drawingContext.rect(contentX, contentTop, contentWidth, contentHeight);

  // 執行裁切
  drawingContext.clip();

  // 設定每一張解析卡片高度
  let cardHeight = 145;

  // 設定解析卡片間距
  let cardGap = 14;

  // 計算所有解析內容的總高度
  let totalHeight = questions.length * (cardHeight + cardGap);

  // 計算解析內容的起始位置
  let startY = contentTop + 10 - resultScrollY;

  // 逐題繪製解析卡片
  for (let i = 0; i < questions.length; i++) {
    // 取得目前題目資料
    let item = questions[i];

    // 計算目前解析卡片的垂直位置
    let cardY = startY + i * (cardHeight + cardGap);

    // 判斷使用者是否答對
    let isCorrect = userAnswers[i] === item.answer;

    // 設定解析卡片顏色
    fill("#ffffff");

    // 設定解析卡片外框顏色
    stroke(isCorrect ? "#2a9d8f" : "#e63946");

    // 設定解析卡片外框寬度
    strokeWeight(2);

    // 繪製解析卡片
    rect(contentX, cardY, contentWidth, cardHeight, 14);

    // 關閉外框
    noStroke();

    // 設定結果文字顏色
    fill(isCorrect ? "#2a9d8f" : "#e63946");

    // 設定結果文字大小
    textSize(19);

    // 設定文字靠左對齊
    textAlign(LEFT, TOP);

    // 顯示題號與答題結果
    text("第 " + (i + 1) + " 題：" + (isCorrect ? "答對" : "答錯"), contentX + 16, cardY + 12);

    // 設定一般文字顏色
    fill(TEXT_COLOR);

    // 設定一般文字大小
    textSize(16);

    // 取得使用者答案文字
    let userAnswerText = userAnswers[i] === -1
      ? "未作答"
      : item.options[userAnswers[i]];

    // 顯示使用者答案
    text("你的答案：" + userAnswerText, contentX + 16, cardY + 42);

    // 顯示正確答案
    text("正確答案：" + item.options[item.answer], contentX + 16, cardY + 65);

    // 設定解析文字顏色
    fill("#343a40");

    // 顯示題目解析
    text(
      "解析：" + item.explanation,
      contentX + 16,
      cardY + 88,
      contentWidth - 32,
      45
    );

    // 恢復文字置中對齊
    textAlign(CENTER, CENTER);
  }

  // 恢復裁切狀態
  drawingContext.restore();

  // 恢復畫布狀態
  pop();

  // 設定捲軸背景顏色
  fill("#d9ed92");

  // 設定捲軸位置
  let scrollbarX = width - 18;

  // 設定捲軸寬度
  let scrollbarWidth = 8;

  // 計算捲軸高度
  let scrollbarHeight = max(35, contentHeight * contentHeight / totalHeight);

  // 計算捲軸可移動距離
  let scrollbarTravel = contentHeight - scrollbarHeight;

  // 計算捲軸目前位置
  let scrollbarY = contentTop + scrollbarTravel * resultScrollY / max(1, totalHeight - contentHeight);

  // 繪製捲軸
  rect(scrollbarX, scrollbarY, scrollbarWidth, scrollbarHeight, 4);

  // 設定重新開始按鈕寬度
  let restartWidth = 190;

  // 設定重新開始按鈕高度
  let restartHeight = 48;

  // 設定重新開始按鈕位置
  let restartX = width / 2 - restartWidth / 2;

  // 設定重新開始按鈕位置
  let restartY = height - 60;

  // 儲存重新開始按鈕範圍
  restartButton = {
    x: restartX,
    y: restartY,
    width: restartWidth,
    height: restartHeight
  };

  // 設定重新開始按鈕背景顏色
  fill("#457b9d");

  // 繪製重新開始按鈕
  rect(restartX, restartY, restartWidth, restartHeight, 14);

  // 設定重新開始按鈕文字顏色
  fill("#ffffff");

  // 設定重新開始按鈕文字大小
  textSize(19);

  // 顯示重新開始文字
  text("重新開始", width / 2, restartY + restartHeight / 2);
}

// 處理滑鼠點擊事件
function mousePressed() {
  // 呼叫共用的指標操作函式
  handlePointerInput(mouseX, mouseY);

  // 回傳 false 以避免瀏覽器預設行為
  return false;
}

// 處理觸控開始事件
function touchStarted() {
  // 記錄觸控開始的垂直位置
  touchStartY = touches.length > 0 ? touches[0].y : mouseY;

  // 開始記錄觸控拖曳狀態
  isDragging = false;

  // 回傳 false 以避免頁面捲動
  return false;
}

// 處理觸控移動事件
function touchMoved() {
  // 判斷目前是否在結果頁面
  if (gameState === "result") {
    // 取得目前觸控位置
    let currentY = touches.length > 0 ? touches[0].y : mouseY;

    // 計算觸控移動距離
    let difference = touchStartY - currentY;

    // 判斷是否超過拖曳判定距離
    if (abs(difference) > 3) {
      // 標記目前正在拖曳
      isDragging = true;

      // 更新結果頁捲動位置
      resultScrollY += difference;

      // 限制捲動位置
      limitResultScroll();

      // 更新觸控起始位置
      touchStartY = currentY;
    }
  }

  // 回傳 false 以避免瀏覽器捲動
  return false;
}

// 處理觸控結束事件
function touchEnded() {
  // 判斷是否沒有拖曳
  if (!isDragging) {
    // 使用最後觸控位置執行點擊
    handlePointerInput(mouseX, mouseY);
  }

  // 回傳 false 以避免瀏覽器預設行為
  return false;
}

// 處理滑鼠滾輪事件
function mouseWheel(event) {
  // 判斷目前是否位於結果頁面
  if (gameState === "result") {
    // 更新結果頁捲動位置
    resultScrollY += event.delta;

    // 限制結果頁捲動範圍
    limitResultScroll();

    // 回傳 false 以阻止頁面捲動
    return false;
  }

  // 允許其他頁面使用瀏覽器預設滾動行為
  return true;
}

// 統一處理滑鼠與觸控點擊
function handlePointerInput(pointerX, pointerY) {
  // 判斷目前是否為測驗頁面
  if (gameState === "quiz") {
    // 判斷已經作答時不再接受選項
    if (answered) {
      // 判斷是否點擊下一題按鈕
      if (isInsideButton(pointerX, pointerY, nextButton)) {
        // 前往下一題或顯示結果
        goToNextQuestion();
      }

      // 結束已作答狀態的處理
      return;
    }

    // 逐一檢查四個選項按鈕
    for (let i = 0; i < optionButtons.length; i++) {
      // 判斷指標是否位於目前選項
      if (isInsideButton(pointerX, pointerY, optionButtons[i])) {
        // 記錄使用者選擇
        chooseAnswer(i);

        // 結束選項檢查
        return;
      }
    }
  }

  // 判斷目前是否為結果頁面
  if (gameState === "result") {
    // 判斷是否點擊重新開始按鈕
    if (isInsideButton(pointerX, pointerY, restartButton)) {
      // 重新開始測驗
      restartQuiz();
    }
  }
}

// 判斷指標是否位於按鈕範圍內
function isInsideButton(pointerX, pointerY, button) {
  // 回傳是否在按鈕矩形範圍內
  return (
    pointerX >= button.x &&
    pointerX <= button.x + button.width &&
    pointerY >= button.y &&
    pointerY <= button.y + button.height
  );
}

// 處理使用者選擇答案
function chooseAnswer(optionIndex) {
  // 取得目前題目
  let currentData = questions[currentQuestion];

  // 記錄使用者答案
  userAnswers[currentQuestion] = optionIndex;

  // 記錄目前選擇的選項
  selectedOption = optionIndex;

  // 設定目前題目已經作答
  answered = true;

  // 判斷答案是否正確
  if (optionIndex === currentData.answer) {
    // 答對時增加分數
    score++;
  }
}

// 前往下一題或顯示結果
function goToNextQuestion() {
  // 判斷是否已經是最後一題
  if (currentQuestion === questions.length - 1) {
    // 切換到結果頁面
    gameState = "result";

    // 將結果頁捲動位置歸零
    resultScrollY = 0;

    // 結束函式
    return;
  }

  // 題目編號加一
  currentQuestion++;

  // 清除作答狀態
  answered = false;

  // 清除選擇的選項
  selectedOption = -1;

  // 清除下一題按鈕資料
  nextButton = {};
}

// 重新開始整份測驗
function restartQuiz() {
  // 將目前題目重設為第一題
  currentQuestion = 0;

  // 將分數歸零
  score = 0;

  // 清除所有作答紀錄
  userAnswers = Array(questions.length).fill(-1);

  // 清除作答狀態
  answered = false;

  // 清除目前選項
  selectedOption = -1;

  // 切換回測驗頁面
  gameState = "quiz";

  // 將結果頁捲動位置歸零
  resultScrollY = 0;

  // 清除按鈕資料
  optionButtons = [];

  // 清除下一題按鈕資料
  nextButton = {};

  // 清除重新開始按鈕資料
  restartButton = {};
}

// 限制結果頁的捲動範圍
function limitResultScroll() {
  // 設定結果內容區域高度
  let contentHeight = height - 190;

  // 設定解析卡片高度
  let cardHeight = 145;

  // 設定解析卡片間距
  let cardGap = 14;

  // 計算結果內容總高度
  let totalHeight = questions.length * (cardHeight + cardGap);

  // 計算最大捲動距離
  let maxScroll = max(0, totalHeight - contentHeight - 20);

  // 限制結果捲動位置
  resultScrollY = constrain(resultScrollY, 0, maxScroll);
}

// 當瀏覽器視窗尺寸改變時執行
function windowResized() {
  // 重新設定全螢幕畫布尺寸
  resizeCanvas(windowWidth, windowHeight);

  // 限制結果頁捲動位置
  limitResultScroll();
}
```
:::


---

## 學習2：網頁設定為響應式網頁

https://cfchen58.synology.me/115/week4/stage2/

**這個階段的目標：** 讓網站在電腦、平板、手機（直向與橫向）都能正常顯示，視窗大小改變時版面自動調整。
**這個階段會修改的檔案：** index.html、sketch.js

### 執行截圖

![image](https://hackmd.io/_uploads/rJiB32VjMx.png)

![動畫2](https://hackmd.io/_uploads/ByHohh4jfg.gif)
### 第一次問 AI

```tex!
網頁設定為響應式網頁，主要是要讓網頁站在電腦 平板 手機(橫向與直向)都能正常顯示 視窗大小改變時，版面自動調整。
```

### 第二次問 AI

```tex!
（逐字貼上你第二次問 AI 的提示詞）
```

### 第三次問 AI

```tex!
（逐字貼上你第三次問 AI 的提示詞）
```

### 程式碼內容

:::info
:::spoiler 點開貼上學習2的程式碼
```javascript=
// 儲存五題 p5.js 測驗題目
const questions = [
  {
    question: "哪一個函式可以建立 p5.js 畫布？",
    options: ["setup()", "createCanvas()", "draw()", "background()"],
    answer: 1,
    explanation: "createCanvas() 用來建立畫布，並設定畫布寬度與高度。"
  },
  {
    question: "哪一個函式可以設定畫布背景顏色？",
    options: ["fill()", "stroke()", "background()", "text()"],
    answer: 2,
    explanation: "background() 用來設定整個畫布的背景顏色。"
  },
  {
    question: "哪一個函式可以繪製圓形或橢圓形？",
    options: ["ellipse()", "rect()", "line()", "triangle()"],
    answer: 0,
    explanation: "ellipse() 可繪製橢圓形；寬度與高度相同時就是圓形。"
  },
  {
    question: "哪一個函式可以設定圖形填滿顏色？",
    options: ["stroke()", "fill()", "textSize()", "noFill()"],
    answer: 1,
    explanation: "fill() 用來設定圖形或文字的填滿顏色。"
  },
  {
    question: "哪一個函式會持續重複執行？",
    options: ["setup()", "draw()", "mousePressed()", "preload()"],
    answer: 1,
    explanation: "draw() 會在 setup() 後持續重複執行，適合製作動畫。"
  }
];

// 儲存目前題目編號
let currentQuestion = 0;

// 儲存答對題數
let score = 0;

// 儲存使用者答案
let userAnswers = [];

// 儲存是否已作答
let answered = false;

// 儲存目前選擇的選項
let selectedOption = -1;

// 儲存目前畫面狀態
let page = "quiz";

// 儲存選項按鈕
let optionButtons = [];

// 儲存下一題按鈕
let nextButton = {};

// 儲存重新開始按鈕
let restartButton = {};

// 儲存響應式版面資料
let layout = {};

// 儲存結果頁捲動位置
let resultScroll = 0;

// 儲存觸控起始位置
let touchStartY = 0;

// 儲存上一次輸入時間
let lastInputTime = 0;

// 設定正確答案顏色
const CORRECT_COLOR = "#d9ed92";

// 設定錯誤答案顏色
const WRONG_COLOR = "#e63946";

// 設定畫布背景顏色
const BACKGROUND_COLOR = "#f1faee";

// 設定主要文字顏色
const TEXT_COLOR = "#1d3557";

// p5.js 初始化函式
function setup() {
  // 建立全螢幕畫布
  createCanvas(windowWidth, windowHeight);

  // 設定文字使用 Arial 字型
  textFont("Arial");

  // 初始化答案陣列
  userAnswers = Array(questions.length).fill(-1);

  // 設定畫布觸控行為
  setTouchAction();

  // 計算響應式版面
  calculateLayout();
}

// p5.js 每一幀執行的函式
function draw() {
  // 設定背景顏色
  background(BACKGROUND_COLOR);

  // 判斷目前頁面
  if (page === "quiz") {
    // 繪製測驗頁面
    drawQuizPage();
  } else {
    // 繪製結果頁面
    drawResultPage();
  }
}

// 設定觸控安全行為
function setTouchAction() {
  // 取得 p5.js 畫布元素
  const canvasElement = document.querySelector("canvas");

  // 確認畫布元素存在
  if (canvasElement) {
    // 防止瀏覽器觸控手勢干擾
    canvasElement.style.touchAction = "none";

    // 防止使用者選取文字
    canvasElement.style.userSelect = "none";
  }

  // 設定頁面禁止觸控捲動
  document.body.style.margin = "0";

  // 設定頁面不顯示水平捲軸
  document.body.style.overflow = "hidden";
}

// 計算響應式版面
function calculateLayout() {
  // 計算安全邊距
  const margin = constrain(min(width, height) * 0.04, 14, 36);

  // 判斷是否為手機畫面
  const isPhone = min(width, height) < 600;

  // 判斷是否為直向畫面
  const isPortrait = height >= width;

  // 計算內容最大寬度
  const contentWidth = min(width - margin * 2, 980);

  // 設定標題文字大小
  const titleSize = isPhone ? 24 : 34;

  // 設定副標題文字大小
  const subtitleSize = isPhone ? 15 : 19;

  // 設定題目文字大小
  const questionSize = isPhone ? 18 : 24;

  // 設定選項文字大小
  const optionSize = isPhone ? 16 : 20;

  // 設定題目卡片高度
  const questionHeight = isPhone ? 112 : 140;

  // 判斷是否使用雙欄選項
  const useTwoColumns = !isPortrait && width >= 650;

  // 計算選項寬度
  const optionWidth = useTwoColumns
    ? (contentWidth - 14) / 2
    : contentWidth;

  // 設定選項高度
  const optionHeight = isPhone ? 58 : 66;

  // 設定選項間距
  const optionGap = isPhone ? 10 : 14;

  // 設定按鈕高度
  const buttonHeight = isPhone ? 48 : 56;

  // 設定頁首高度
  const headerHeight = isPhone ? 84 : 112;

  // 儲存所有版面資料
  layout = {
    margin: margin,
    contentWidth: contentWidth,
    titleSize: titleSize,
    subtitleSize: subtitleSize,
    questionSize: questionSize,
    optionSize: optionSize,
    questionHeight: questionHeight,
    useTwoColumns: useTwoColumns,
    optionWidth: optionWidth,
    optionHeight: optionHeight,
    optionGap: optionGap,
    buttonHeight: buttonHeight,
    headerHeight: headerHeight
  };
}

// 繪製測驗頁面
function drawQuizPage() {
  // 重新計算目前版面
  calculateLayout();

  // 取得目前題目
  const item = questions[currentQuestion];

  // 設定文字置中
  textAlign(CENTER, CENTER);

  // 設定標題文字顏色
  fill(TEXT_COLOR);

  // 設定標題文字大小
  textSize(layout.titleSize);

  // 顯示測驗標題
  text("p5.js 簡易指令練習測驗", width / 2, 30);

  // 設定副標題文字大小
  textSize(layout.subtitleSize);

  // 顯示目前題數
  text(
    `第 ${currentQuestion + 1} 題 / 共 ${questions.length} 題`,
    width / 2,
    layout.headerHeight - 22
  );

  // 計算題目卡片位置
  const questionX = width / 2 - layout.contentWidth / 2;

  // 計算題目卡片位置
  const questionY = layout.headerHeight;

  // 設定題目卡片填滿顏色
  fill("#ffffff");

  // 設定題目卡片外框顏色
  stroke("#a8dadc");

  // 設定題目卡片外框寬度
  strokeWeight(2);

  // 繪製題目卡片
  rect(
    questionX,
    questionY,
    layout.contentWidth,
    layout.questionHeight,
    16
  );

  // 關閉外框
  noStroke();

  // 設定題目文字顏色
  fill(TEXT_COLOR);

  // 設定題目文字大小
  textSize(layout.questionSize);

  // 繪製自動換行題目
  drawCenteredWrappedText(
    item.question,
    width / 2,
    questionY + layout.questionHeight / 2,
    layout.contentWidth - 30,
    layout.questionSize * 1.35
  );

  // 計算選項開始位置
  const optionStartY = questionY + layout.questionHeight + 24;

  // 清除舊的選項按鈕資料
  optionButtons = [];

  // 繪製四個選項
  for (let i = 0; i < item.options.length; i++) {
    // 計算選項欄位
    const column = layout.useTwoColumns ? i % 2 : 0;

    // 計算選項列數
    const row = layout.useTwoColumns ? floor(i / 2) : i;

    // 計算選項 X 座標
    const baseX =
      width / 2 -
      (layout.useTwoColumns
        ? layout.contentWidth / 2
        : layout.optionWidth / 2) +
      column * (layout.optionWidth + layout.optionGap);

    // 計算選項 Y 座標
    const baseY =
      optionStartY + row * (layout.optionHeight + layout.optionGap);

    // 設定水平動畫位移
    let offsetX = 0;

    // 設定垂直動畫位移
    let offsetY = 0;

    // 判斷是否為錯誤選項
    const isWrong =
      answered &&
      selectedOption === i &&
      selectedOption !== item.answer;

    // 判斷是否為答錯後的正確選項
    const isCorrectAfterWrong =
      answered &&
      selectedOption !== item.answer &&
      i === item.answer;

    // 讓錯誤選項左右移動
    if (isWrong) {
      // 使用正弦函式製造左右晃動效果
      offsetX = sin(frameCount * 0.45) * 10;
    }

    // 讓正確選項上下跳動
    if (isCorrectAfterWrong) {
      // 使用正弦函式製造上下跳動效果
      offsetY = sin(frameCount * 0.35) * 9;
    }

    // 建立選項按鈕資料
    const button = {
      x: baseX + offsetX,
      y: baseY + offsetY,
      width: layout.optionWidth,
      height: layout.optionHeight
    };

    // 儲存選項按鈕資料
    optionButtons.push(button);

    // 設定選項預設顏色
    let buttonColor = "#ffffff";

    // 答對或正確答案使用綠色
    if (answered && i === item.answer) {
      buttonColor = CORRECT_COLOR;
    }

    // 錯誤選項使用紅色
    if (isWrong) {
      buttonColor = WRONG_COLOR;
    }

    // 設定選項背景顏色
    fill(buttonColor);

    // 設定選項外框顏色
    stroke("#457b9d");

    // 設定選項外框寬度
    strokeWeight(2);

    // 繪製選項
    rect(button.x, button.y, button.width, button.height, 14);

    // 關閉外框
    noStroke();

    // 設定選項文字顏色
    fill(TEXT_COLOR);

    // 設定選項文字大小
    textSize(layout.optionSize);

    // 建立選項文字
    const optionText =
      String.fromCharCode(65 + i) + ". " + item.options[i];

    // 繪製自動換行選項文字
    drawCenteredWrappedText(
      optionText,
      button.x + button.width / 2,
      button.y + button.height / 2,
      button.width - 24,
      layout.optionSize * 1.25
    );
  }

  // 作答後顯示下一題按鈕
  if (answered) {
    // 計算選項總列數
    const rowCount = layout.useTwoColumns ? 2 : 4;

    // 計算下一題按鈕 Y 座標
    const buttonY = height - layout.margin - layout.buttonHeight;

    // 設定下一題按鈕寬度
    const buttonWidth = min(layout.contentWidth, 240);

    // 儲存下一題按鈕資料
    nextButton = {
      x: width / 2 - buttonWidth / 2,
      y: buttonY,
      width: buttonWidth,
      height: layout.buttonHeight
    };

    // 設定下一題按鈕顏色
    fill("#457b9d");

    // 繪製下一題按鈕
    rect(
      nextButton.x,
      nextButton.y,
      nextButton.width,
      nextButton.height,
      14
    );

    // 設定按鈕文字顏色
    fill("#ffffff");

    // 設定按鈕文字大小
    textSize(layout.optionSize);

    // 顯示按鈕文字
    text(
      currentQuestion === questions.length - 1
        ? "查看成績與解析"
        : "下一題",
      width / 2,
      buttonY + layout.buttonHeight / 2
    );
  }
}

// 繪製結果頁面
function drawResultPage() {
  // 重新計算版面
  calculateLayout();

  // 設定文字置中
  textAlign(CENTER, CENTER);

  // 設定標題文字顏色
  fill(TEXT_COLOR);

  // 設定標題文字大小
  textSize(layout.titleSize);

  // 顯示結果標題
  text("測驗完成！", width / 2, 30);

  // 設定成績文字大小
  textSize(layout.subtitleSize + 4);

  // 顯示答對題數
  text(
    `答對題數：${score} / ${questions.length}`,
    width / 2,
    layout.headerHeight - 22
  );

  // 設定解析區域上方位置
  const resultTop = layout.headerHeight + 10;

  // 設定重新開始按鈕高度
  const restartHeight = layout.buttonHeight;

  // 設定重新開始按鈕位置
  const restartY = height - layout.margin - restartHeight;

  // 設定解析區域高度
  const resultHeight = restartY - resultTop - 16;

  // 設定內容寬度
  const contentWidth = layout.contentWidth;

  // 設定卡片高度
  const cardHeight = layout.optionHeight * 2 + 90;

  // 設定卡片間距
  const cardGap = 14;

  // 計算內容總高度
  const totalHeight = questions.length * (cardHeight + cardGap);

  // 限制結果捲動位置
  const maxScroll = max(0, totalHeight - resultHeight);

  // 限制捲動範圍
  resultScroll = constrain(resultScroll, 0, maxScroll);

  // 儲存畫布狀態
  push();

  // 設定內容裁切區域
  drawingContext.save();

  // 開始建立裁切路徑
  drawingContext.beginPath();

  // 設定裁切矩形
  drawingContext.rect(
    width / 2 - contentWidth / 2,
    resultTop,
    contentWidth,
    resultHeight
  );

  // 執行裁切
  drawingContext.clip();

  // 繪製每一題解析
  for (let i = 0; i < questions.length; i++) {
    // 取得目前題目
    const item = questions[i];

    // 計算卡片位置
    const cardX = width / 2 - contentWidth / 2;

    // 計算卡片位置
    const cardY =
      resultTop + 8 + i * (cardHeight + cardGap) - resultScroll;

    // 判斷是否答對
    const isCorrect = userAnswers[i] === item.answer;

    // 設定卡片背景顏色
    fill("#ffffff");

    // 設定卡片外框顏色
    stroke(isCorrect ? "#2a9d8f" : WRONG_COLOR);

    // 設定卡片外框寬度
    strokeWeight(2);

    // 繪製解析卡片
    rect(cardX, cardY, contentWidth, cardHeight, 14);

    // 關閉外框
    noStroke();

    // 設定左對齊
    textAlign(LEFT, TOP);

    // 設定結果文字大小
    textSize(layout.optionSize);

    // 設定結果文字顏色
    fill(isCorrect ? "#2a9d8f" : WRONG_COLOR);

    // 顯示答題結果
    text(
      `第 ${i + 1} 題：${isCorrect ? "答對" : "答錯"}`,
      cardX + 14,
      cardY + 12
    );

    // 設定一般文字顏色
    fill(TEXT_COLOR);

    // 設定一般文字大小
    textSize(max(14, layout.optionSize - 2));

    // 取得使用者答案
    const userAnswer =
      userAnswers[i] === -1
        ? "未作答"
        : item.options[userAnswers[i]];

    // 顯示使用者答案
    text(
      "你的答案：" + userAnswer,
      cardX + 14,
      cardY + 40,
      contentWidth - 28,
      24
    );

    // 顯示正確答案
    text(
      "正確答案：" + item.options[item.answer],
      cardX + 14,
      cardY + 66,
      contentWidth - 28,
      24
    );

    // 設定解析文字顏色
    fill("#343a40");

    // 顯示解析
    text(
      "解析：" + item.explanation,
      cardX + 14,
      cardY + 94,
      contentWidth - 28,
      cardHeight - 104
    );

    // 恢復文字置中
    textAlign(CENTER, CENTER);
  }

  // 恢復裁切狀態
  drawingContext.restore();

  // 恢復畫布狀態
  pop();

  // 設定重新開始按鈕資料
  const restartWidth = min(layout.contentWidth, 220);

  // 設定重新開始按鈕資料
  restartButton = {
    x: width / 2 - restartWidth / 2,
    y: restartY,
    width: restartWidth,
    height: restartHeight
  };

  // 設定重新開始按鈕背景色
  fill("#457b9d");

  // 繪製重新開始按鈕
  rect(
    restartButton.x,
    restartButton.y,
    restartButton.width,
    restartButton.height,
    14
  );

  // 設定按鈕文字顏色
  fill("#ffffff");

  // 設定按鈕文字大小
  textSize(layout.optionSize);

  // 顯示重新開始
  text(
    "重新開始",
    width / 2,
    restartY + restartHeight / 2
  );

  // 顯示捲動提示
  if (maxScroll > 0) {
    // 設定提示文字大小
    textSize(13);

    // 設定提示文字顏色
    fill("#457b9d");

    // 顯示捲動提示
    text("可用滑鼠滾輪或手指上下滑動查看解析", width / 2, restartY - 8);
  }
}

// 將文字依寬度切割成多行
function wrapTextLines(message, maxWidth) {
  // 將文字轉換為字串
  const textValue = String(message);

  // 建立文字行陣列
  const lines = [];

  // 建立目前文字行
  let currentLine = "";

  // 逐一處理每個字元
  for (let i = 0; i < textValue.length; i++) {
    // 取得目前字元
    const character = textValue[i];

    // 建立測試文字
    const testLine = currentLine + character;

    // 判斷測試文字是否超過寬度
    if (textWidth(testLine) > maxWidth && currentLine.length > 0) {
      // 將目前文字行加入陣列
      lines.push(currentLine);

      // 重新建立文字行
      currentLine = character;
    } else {
      // 將字元加入目前文字行
      currentLine = testLine;
    }
  }

  // 將最後一行加入陣列
  if (currentLine.length > 0) {
    lines.push(currentLine);
  }

  // 回傳文字行陣列
  return lines;
}

// 繪製置中換行文字
function drawCenteredWrappedText(message, centerX, centerY, maxWidth, lineHeight) {
  // 取得文字行陣列
  const lines = wrapTextLines(message, maxWidth);

  // 計算文字總高度
  const totalHeight = lines.length * lineHeight;

  // 逐行繪製文字
  for (let i = 0; i < lines.length; i++) {
    // 計算目前文字的 Y 座標
    const lineY = centerY - totalHeight / 2 + lineHeight / 2 + i * lineHeight;

    // 繪製文字
    text(lines[i], centerX, lineY);
  }
}

// 判斷點擊是否在按鈕內
function isInside(pointerX, pointerY, button) {
  // 確認按鈕資料存在
  if (!button) {
    // 回傳未點擊
    return false;
  }

  // 回傳點擊位置是否位於按鈕內
  return (
    pointerX >= button.x &&
    pointerX <= button.x + button.width &&
    pointerY >= button.y &&
    pointerY <= button.y + button.height
  );
}

// 處理滑鼠點擊
function mousePressed() {
  // 處理目前輸入
  handleInput(mouseX, mouseY);

  // 阻止瀏覽器預設行為
  return false;
}

// 處理觸控點擊
function touchStarted() {
  // 記錄觸控起始位置
  touchStartY = touches.length > 0 ? touches[0].y : mouseY;

  // 回傳 false 防止瀏覽器捲動
  return false;
}

// 處理觸控移動
function touchMoved() {
  // 判斷目前是否為結果頁
  if (page === "result") {
    // 取得目前觸控位置
    const currentY = touches.length > 0 ? touches[0].y : mouseY;

    // 計算觸控移動距離
    const movement = touchStartY - currentY;

    // 更新結果捲動位置
    resultScroll += movement;

    // 更新觸控起始位置
    touchStartY = currentY;

    // 限制結果捲動位置
    limitResultScroll();
  }

  // 阻止瀏覽器預設行為
  return false;
}

// 處理觸控結束
function touchEnded() {
  // 取得觸控結束位置
  const pointerX = mouseX;

  // 取得觸控結束位置
  const pointerY = mouseY;

  // 延遲避免重複觸發
  if (millis() - lastInputTime > 250) {
    // 處理觸控輸入
    handleInput(pointerX, pointerY);
  }

  // 阻止瀏覽器預設行為
  return false;
}

// 處理滑鼠滾輪
function mouseWheel(event) {
  // 只在結果頁處理滾輪
  if (page === "result") {
    // 更新結果捲動位置
    resultScroll += event.delta;

    // 限制結果捲動位置
    limitResultScroll();

    // 阻止瀏覽器捲動
    return false;
  }

  // 允許其他狀態預設行為
  return true;
}

// 統一處理輸入
function handleInput(pointerX, pointerY) {
  // 避免滑鼠與觸控重複觸發
  if (millis() - lastInputTime < 250) {
    // 結束此次輸入
    return;
  }

  // 記錄輸入時間
  lastInputTime = millis();

  // 判斷目前是否為測驗頁
  if (page === "quiz") {
    // 判斷是否已經作答
    if (answered) {
      // 判斷是否點擊下一題
      if (isInside(pointerX, pointerY, nextButton)) {
        // 前往下一題
        nextQuestion();
      }

      // 結束輸入處理
      return;
    }

    // 逐一檢查選項
    for (let i = 0; i < optionButtons.length; i++) {
      // 判斷是否點擊選項
      if (isInside(pointerX, pointerY, optionButtons[i])) {
        // 記錄答案
        chooseAnswer(i);

        // 結束選項檢查
        return;
      }
    }
  }

  // 判斷目前是否為結果頁
  if (page === "result") {
    // 判斷是否點擊重新開始
    if (isInside(pointerX, pointerY, restartButton)) {
      // 重新開始測驗
      restartQuiz();
    }
  }
}

// 選擇答案
function chooseAnswer(optionIndex) {
  // 取得目前題目
  const item = questions[currentQuestion];

  // 記錄使用者答案
  userAnswers[currentQuestion] = optionIndex;

  // 記錄目前選項
  selectedOption = optionIndex;

  // 設定已作答
  answered = true;

  // 判斷是否答對
  if (optionIndex === item.answer) {
    // 增加分數
    score++;
  }
}

// 前往下一題
function nextQuestion() {
  // 判斷是否為最後一題
  if (currentQuestion === questions.length - 1) {
    // 切換到結果頁
    page = "result";

    // 將結果捲動歸零
    resultScroll = 0;

    // 結束函式
    return;
  }

  // 題目編號加一
  currentQuestion++;

  // 清除作答狀態
  answered = false;

  // 清除選項紀錄
  selectedOption = -1;

  // 清除下一題按鈕
  nextButton = {};
}

// 重新開始測驗
function restartQuiz() {
  // 回到第一題
  currentQuestion = 0;

  // 分數歸零
  score = 0;

  // 清除答案紀錄
  userAnswers = Array(questions.length).fill(-1);

  // 清除作答狀態
  answered = false;

  // 清除選項
  selectedOption = -1;

  // 回到測驗頁
  page = "quiz";

  // 捲動位置歸零
  resultScroll = 0;

  // 清除按鈕資料
  optionButtons = [];

  // 清除下一題按鈕
  nextButton = {};

  // 清除重新開始按鈕
  restartButton = {};
}

// 限制結果頁捲動範圍
function limitResultScroll() {
  // 重新計算版面
  calculateLayout();

  // 設定結果區域上方位置
  const resultTop = layout.headerHeight + 10;

  // 設定重新開始按鈕高度
  const restartHeight = layout.buttonHeight;

  // 設定重新開始按鈕位置
  const restartY = height - layout.margin - restartHeight;

  // 計算結果區域高度
  const resultHeight = restartY - resultTop - 16;

  // 設定卡片高度
  const cardHeight = layout.optionHeight * 2 + 90;

  // 設定卡片間距
  const cardGap = 14;

  // 計算內容總高度
  const totalHeight = questions.length * (cardHeight + cardGap);

  // 計算最大捲動距離
  const maxScroll = max(0, totalHeight - resultHeight);

  // 限制結果捲動位置
  resultScroll = constrain(resultScroll, 0, maxScroll);
}

// 視窗大小改變時執行
function windowResized() {
  // 重新調整畫布大小
  resizeCanvas(windowWidth, windowHeight);

  // 重新計算版面
  calculateLayout();

  // 限制結果頁捲動
  limitResultScroll();

  // 重新設定觸控行為
  setTouchAction();
}
```
:::


---

## 學習3：設定嵌入 Google 字型，網頁文字採用這些字型

https://cfchen58.synology.me/115/week4/stage3/

**這個階段的目標：** 從 Google Fonts 嵌入繁體中文字型，並讓畫布上的題目與選項文字使用這些字型。
**這個階段會修改的檔案：** index.html、sketch.js

### 執行截圖

（把截圖拖曳到這裡，或貼上圖片連結）

![學習3截圖](請貼上截圖)

### 第一次問 AI

```tex!
（逐字貼上你第一次問 AI 的提示詞）
```

### 第二次問 AI

```tex!
（逐字貼上你第二次問 AI 的提示詞）
```

### 第三次問 AI

```tex!
（逐字貼上你第三次問 AI 的提示詞）
```

### 程式碼內容

:::info
:::spoiler 點開貼上學習3的程式碼
```javascript=
//學習3程式碼所在

```
:::


---

## 學習4：設定題庫並抽題顯示題目網頁（CSV 檔案）

https://cfchen58.synology.me/115/week4/stage4/

**這個階段的目標：** 把題目移到 questions.csv，網站讀取題庫後每次隨機抽出 5 題。
**這個階段會修改的檔案：** index.html、sketch.js、questions.csv

### 執行截圖

（把截圖拖曳到這裡，或貼上圖片連結）

![學習4截圖](請貼上截圖)

### 第一次問 AI

```tex!
（逐字貼上你第一次問 AI 的提示詞）
```

### 第二次問 AI

```tex!
（逐字貼上你第二次問 AI 的提示詞）
```

### 第三次問 AI

```tex!
（逐字貼上你第三次問 AI 的提示詞）
```

### 程式碼內容

:::info
:::spoiler 點開貼上學習4的程式碼
```javascript=
//學習4程式碼所在

```
:::


---

## 學習5：利用 Google Sheets 當題庫

https://cfchen58.synology.me/115/week4/stage5/

**這個階段的目標：** 把題庫放在 Google 試算表，網站直接讀取，老師改試算表，網站題目就跟著更新。
**這個階段會修改的檔案：** index.html、sketch.js（questions.csv 當備用題庫）

### 執行截圖

（把截圖拖曳到這裡，或貼上圖片連結）

![學習5截圖](請貼上截圖)

### 第一次問 AI

```tex!
（逐字貼上你第一次問 AI 的提示詞）
```

### 第二次問 AI

```tex!
（逐字貼上你第二次問 AI 的提示詞）
```

### 第三次問 AI

```tex!
（逐字貼上你第三次問 AI 的提示詞）
```

### 程式碼內容

:::info
:::spoiler 點開貼上學習5的程式碼
```javascript=
//學習5程式碼所在

```
:::


---

## 我的心得

這五個學習中，哪一個最困難？你是怎麼解決的？（請寫出實際發生的事）

＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿
