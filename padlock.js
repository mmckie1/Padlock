const fs = require('fs');

// Function to load valid words from the file
function loadValidWords(filePath) {
    const data = fs.readFileSync(filePath, 'utf8');
    return new Set(data.split('\n').map(word => word.trim().toUpperCase()));
}

// Function to compute the letters on each disc
function getDiscLetters(word1, word2, word3) {
    const discs = [];
    for (let i = 0; i < 5; i++) {
        discs.push(new Set([word1[i], word2[i], word3[i]]));
    }
    return discs;
}

// Function to count valid words that can be generated
function countValidWords(discLetters, validWords) {
    const combinations = new Set();

    function generateWords(index, currentWord) {
        if (index === discLetters.length) {
            const word = currentWord.join('');
            if (validWords.has(word)) {
                combinations.add(word);
            }
            return;
        }
        for (let letter of discLetters[index]) {
            currentWord.push(letter);
            generateWords(index + 1, currentWord);
            currentWord.pop();
        }
    }

    generateWords(0, []);
    return combinations.size;
}

// Function to find the best third word
function findBestThirdWord(bella, loves, validWords) {
    let maxCount = 0;
    let bestWord = null;

    validWords.forEach(candidate => {
        if (candidate === bella || candidate === loves) return;

        const discLetters = getDiscLetters(bella, loves, candidate);
        const validCount = countValidWords(discLetters, validWords);

        if (validCount > maxCount) {
            maxCount = validCount;
            bestWord = candidate;
        }
    });

    return { bestWord, maxCount };
}

// Main execution
const bella = "BELLA";
const loves = "LOVES";
const validWords = loadValidWords('/Projects/valid_words.txt'); // Path to valid_words.txt file

const { bestWord, maxCount } = findBestThirdWord(bella, loves, validWords);

console.log(`The best third word is '${bestWord}' which allows ${maxCount} valid words.`);
