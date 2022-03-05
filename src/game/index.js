import { meaningWords, allWords } from './wordbank' 
import { encode, decode, makeKeyFrom } from '../utils'

const GUESS_WORD_LENGTH = 5 //FIXME: will add feature choose word length

class WordToken {
    constructor(letter, status) {
        this.letter = letter
        this.status = status // one of: ['Present', 'Absent', 'Correct', 'Init']
    }
}

class WordBankException {
    constructor(message) {
        this.message = message
    }
}

export function isChallengeMode() {
    const params = document.location.search
    return params.includes('?challenge=') && validateChallengeWord()
}

function getChallenge() {
    // Friend challenge
    let challenge = document.location.search
    challenge = challenge.replace('?challenge=', '')
    const wordToday = getWordToday()
    if (challenge) {
        try {
            const jsonString = decode(makeKeyFrom(wordToday), challenge)
            return JSON.parse(jsonString)
        } catch(e) {
            console.error(e)
            alert('Challenge incorrect encode')
        }
    }
    return null
}

export function createChallenge(jsonString) {
    const wordToday = getWordToday()
    const challengeEncode = encode(makeKeyFrom(wordToday), jsonString)
    return challengeEncode
}

function validateChallengeWord() {
    const word = getChallengeWord()
    if (!word) {
        return false
    } else if (word && word.length !== GUESS_WORD_LENGTH) { //FIXME: will add feature choose word length
        return false
        // throw(new WordBankException('Challenge word incorrect length (must be 5 characters)'))
    }
    return true
}

function getChallengeWord() {
    const { word } = getChallenge() || {}
    return word
}

export function getHint() {
    const { hint } = getChallenge() || {}
    return hint
}

function getWordToday() {
    const now = new Date()
    const todayStr = now.getDate() + '' + (now.getMonth() + 1) + '' + now.getFullYear()
    const todayIndex = +todayStr % meaningWords.length
    return meaningWords[todayIndex] // Random word by today mod length of word bank
}

function getAnswer() {
    const challengeWord = validateChallengeWord() && getChallengeWord()
    const wordToday = getWordToday()

    return challengeWord || wordToday
}

export function checkWord(guessWord) {
    if (guessWord.length !== GUESS_WORD_LENGTH) { //FIXME: will add feature choose word length
        throw(new WordBankException('incorrect word length'))
    }

    if (!validateChallengeWord() && allWords.indexOf(guessWord) === -1) { //FIXME: will add feature choose word length
        throw(new WordBankException('Not exist in word list'))
    }

    let answer = getAnswer()
    // console.log('answer', answer)
    
    // Perfect case: match all letters
    if (guessWord === answer) {
        return guessWord.split('').map(letter => {
            return new WordToken(letter, 'correct')
        })
    }

    // Initial result array, mark all letter absent.
    let guessWordTokens = guessWord.split('')
                                     .map(letter => new WordToken(letter, 'absent'))

    // Mark the correct letters
    guessWordTokens = guessWordTokens.map((item, index) => {
        const letterAtIndex = answer.charAt(index)
        if (letterAtIndex === item.letter) {
            answer = answer.substring(0, index) + '-' + answer.substring(index + 1)
            return new WordToken(item.letter, 'correct')
        }
        return item
    })

    // Mark the presents letters
    guessWordTokens = guessWordTokens.map((item) => {
        const indexInAnswer = answer.indexOf(item.letter)
        if (indexInAnswer > -1 && item.status !== 'correct') {
            answer = answer.substring(0, indexInAnswer) + '-' + answer.substring(indexInAnswer + 1)
            return new WordToken(item.letter, 'present')
        }
        return item
    })

    return guessWordTokens
}

export function createUrlForShare(word, hint) {
    word = word.toLocaleLowerCase()
    hint = hint.toLocaleLowerCase()

    const { origin, pathname } = window.location
    const jsonString = JSON.stringify({ word, hint })
    const challengeEncode = createChallenge(jsonString)
    return `${origin}${pathname}?challenge=${challengeEncode}`
}

export function guess(letter) {
    return new WordToken(letter, 'init')
}

export { GUESS_WORD_LENGTH, WordBankException }