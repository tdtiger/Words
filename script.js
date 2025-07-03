const wordDisplay = document.getElementById("word-display");
const choicesContainer = document.getElementById("choices-container");
const resultDisplay = document.getElementById("result-display");
const nextButton = document.getElementById("next-btn");
const scoreDisplay = document.getElementById("score-display");

let words = [];
let currentIndex = 0;
let correct = 0;
let isJudged = false;

fetch("words.csv")
    .then(response => response.text())
    .then(data => {
        const rows = data.trim().split("\n");
        words = rows.slice(1).map(row => {
            const columns = row.split(",");
            return {
                word: columns[0], meaning: columns[1]
            };
        });
        showQuiz(currentIndex);
    })

function calculateScore() {
    const score = Math.round((correct / (currentIndex + 1)) * 100);
    scoreDisplay.textContent = `ここまでの正解率: ${score}%`;
}

function shuffleArray(array) {
    // Fisher-Yatesアルゴリズムというやつ
    for(let i = array.length - 1; i > 0; i--){
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function showQuiz(index){
    // いったん初期化
    resultDisplay.textContent = "";
    choicesContainer.innerHTML = "";

    // 問題をとってくる
    const question = words[index];
    wordDisplay.textContent = question.word;

    const correctAnswer = question.meaning;
    // 不正解択をランダムに３つ生成
    const wrongAnswers = words
        .filter(word => word.meaning !== correctAnswer)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map(word => word.meaning);

    // 選択肢をランダムに並べる
    const choices = shuffleArray([correctAnswer, ...wrongAnswers]);

    // 各選択肢をボタンとして表示
    choices.forEach(choice => {
        const button = document.createElement("button");
        button.textContent = choice;
        choicesContainer.appendChild(button);

        // 正誤判定
        button.addEventListener("click", () => {
            if(choice === correctAnswer){
                resultDisplay.textContent = "正解！";
                resultDisplay.style.color = "green";
                correct += 1;
            }
            else{
                resultDisplay.textContent = `不正解。正しい答えは「${correctAnswer}」です。`;
                resultDisplay.style.color = "red";
            }
            nextButton.style.display = "block";

            if(!isJudged){
                isJudged = true;
                calculateScore();
            }
        });
    });
    // 答えを選ぶまでは次の単語に進めない
    nextButton.style.display = "none";
}

nextButton.addEventListener("click", () => {
    currentIndex += 1;
    // 最後までいったらもう一度初めから
    if(currentIndex >= words.length) {
        currentIndex = 0;
    }
    isJudged = false;
    showQuiz(currentIndex);
});