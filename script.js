const wordDisplay = document.getElementById("word-display");
const meaningDisplay = document.getElementById("meaning-display");
const nextButton = document.getElementById("next-btn");

let words = [];
let currentIndex = 0;

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
        showWord(currentIndex);
    })

function showWord(index){
    wordDisplay.textContent = words[index].word;
    meaningDisplay.textContent = words[index].meaning;
}

nextButton.addEventListener("click", () => {
    currentIndex += 1;
    if(currentIndex >= words.length) {
        currentIndex = 0;
    }
    showWord(currentIndex);
});