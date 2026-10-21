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