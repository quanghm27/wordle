import { meaningWords, allWords } from './wordbank' 

const GUESS_WORD_LENGTH = 5 //FIXME: will add feature choose word length

class WordToken {
    constructor(letter, status) {
        this.letter = letter
        this.status = status // one of: ['Present', 'Absent', 'Correct', 'Init']
    }
}

class WordLengthException {
    constructor(message) {
        this.message = message
    }
}

class WordBankException {
    constructor(message) {
        this.message = message
    }
}

function validateChallengeWord() {
    // Friend challenge
    let query = window.location.search
    if (query) {
        query =  query.slice(1)
        try {
            const wordToday = window.atob(query)
            if (wordToday.length !== GUESS_WORD_LENGTH) { //FIXME: will add feature choose word length
                throw(new WordLengthException('Challenge word incorrect length (must be 5 characters)'))
            }
            return true
        } catch(e) {
            if (typeof e === WordLengthException) {
                alert(e)
                return false
            }
            alert ('Challenge word incorrect encode')
        }
    }
}

function getChallengeWord() {
    // Friend challenge
    let query = window.location.search
    if (query) {
        query =  query.slice(1)
        try {
            const wordToday = window.atob(query)
            if (wordToday.length !== GUESS_WORD_LENGTH) { //FIXME: will add feature choose word length
                throw(new WordLengthException('Challenge word incorrect length (must be 5 characters)'))
            }
            return wordToday
        } catch(e) {
            if (typeof e === WordLengthException) {
                alert(e)
                return ''
            }
            alert ('Challenge word incorrect encode')
        }
    }

    return null
}

function getWordToday() {
    const now = new Date()
    const todayStr = now.getDate() + '' + (now.getMonth() + 1) + '' + now.getFullYear()
    const todayIndex = +todayStr % meaningWords.length
    return meaningWords[todayIndex] // Random word by today mod length of word bank
}

function getAnswer() {
    const challengeWord = getChallengeWord()
    const wordToday = getWordToday()

    return challengeWord || wordToday
}

function checkWord(guessWord) {
    if (guessWord.length !== GUESS_WORD_LENGTH) { //FIXME: will add feature choose word length
        alert('incorrect word length')
        return
    }

    if (allWords.indexOf(guessWord) === -1) { //FIXME: will add feature choose word length
        throw(new WordBankException('Not exist in word list'))
    }

    let answer = getAnswer()
    const guessWordTokens = guessWord.split('')

    // Perfect case: match all letters
    if (guessWord === answer) {
        return guessWordTokens.map(letter => {
            return new WordToken(letter, 'correct')
        })
    }

    // Match some letters
    return guessWordTokens.map((letter, index) => {
        const indexInAnswer = answer.indexOf(letter)
        if (indexInAnswer === index) {
            answer = answer.substring(0, indexInAnswer) + answer.substring(indexInAnswer + 1)
            return new WordToken(letter, 'correct')
        } else if (indexInAnswer > -1) {
            answer = answer.substring(0, indexInAnswer) + answer.substring(indexInAnswer + 1)
            return new WordToken(letter, 'present')
        } else {
            return new WordToken(letter, 'absent')
        }
    })
}

function guess(letter) {
    return new WordToken(letter, 'init')
}

export { GUESS_WORD_LENGTH, checkWord, guess, WordBankException}