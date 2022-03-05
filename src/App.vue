<script setup>
import WordleHeader from "./components/WordleHeader.vue";
import WordleBoard from "./components/WordleBoard.vue";
import WordleKeyboard from "./components/WordleKeyboard.vue";
import WordleChallengeModal from "./components/WordleChallengeModal.vue"
import { ref, onBeforeMount, reactive, nextTick } from 'vue'
import { getHint, isChallengeMode } from "./game";

onBeforeMount(() => {
  if (isChallengeMode()) {
    hint.value = getHint()
  }
})

const guessWord = ref([])
const hint = ref('')
const guessCount = ref(0)
const gameManager = reactive({ end: false, status: 'playing' }) // status: 'playing', 'win', 'lose'
const MAX_GUESS = 6
const records = ref(Array.from({ length: MAX_GUESS }, () => //FIXME: add feature custom wordlength and guess time
  Array.from({ length: 5 }, () => ({
    letter: '',
    status: ''
  }))
))
const showChallengeModal = ref(false)
const vituralKeyboard = ref(true)

function handleTypingLetter(word) {
  if (gameManager.end) {
    return
  }
  const newWord = [...word]
  while (newWord.length < 5) {
    newWord.push({ letter: '', status: ''}) // Padding letter
  }
  records.value[guessCount.value].splice(0, newWord.length, ...newWord)
}

async function handleGuessing(guessResult) {
  if (gameManager.end) return
  // Replace word each time submit
  records.value.splice(guessCount.value, 1, guessResult)
  guessCount.value += 1

  // End game or not
  gameManagerCheck(guessResult)
  await nextTick()
  gameManagerShowMessage()

  // Reset guessword
  guessWord.value = []
}

function gameManagerCheck(guessWord) {
  const win = guessWord.every(letter => letter.status === 'correct')
  const outOfGuess = guessCount.value === MAX_GUESS

  if (win) {
    gameManager.end = true
    gameManager.status = 'win'
  } else if (outOfGuess) {
    gameManager.end = true
    gameManager.status = 'lose'
  }
}

function gameManagerShowMessage() {
  if (!gameManager.end) return
  const resultTile = genResultTiles()

  if (gameManager.status === 'win') {
    const winWords = ['✨ Genius! ✨', 'Yay!! 👍', 'You\'re the best! 🦸']
    const random = Math.floor(Math.random() * 3)
    alert(`${winWords[random]}\n${resultTile}`)
  }

  if (gameManager.status === 'lose') {
    const loseWords = ['Sorry...', '🥲 Game over.', 'Guess again! 😄']
    const random = Math.floor(Math.random() * 3)
    alert(`${loseWords[random]}\n${resultTile}`)
  }
}

const TILE_RESULT = {
  'absent': '⬛',
  'present': '🟨',
  'correct': '🟩',
}

function genResultTiles() {
  return records.value.map(record => {
    return record.map(tile => {
      return tile.letter ? TILE_RESULT[tile.status] : '⬜'
    }).join('')
  }).join('\n')
}

function showModal() {
  showChallengeModal.value = true
  vituralKeyboard.value = false
}

function closeModal() {
  showChallengeModal.value = false
  vituralKeyboard.value = true
}
</script>

<template>
  <wordle-challenge-modal v-show="showChallengeModal" @close="closeModal" />
  <wordle-header @challenge="showModal" />
  <div class="app-wrapper flex flex-col justify-between">
    <wordle-board :records="records" />
    <div v-if="hint" class="text-center text-3xl mb-3">Hint for you:
      {{ `"${hint}"` }}
    </div>
    <wordle-keyboard
      :guessWord="guessWord"
      :vituralKeyboard="vituralKeyboard && gameManager.status === 'playing'"
      @update:guessWord="handleTypingLetter" 
      @enter="handleGuessing"
    />
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Permanent+Marker&family=Road+Rage&family=Shizuru&display=swap');
#app {
  font-family: 'Road Rage', cursive;
  color: #2c3e50;
  overflow: hidden;
}
.app-wrapper {
  /*min-height: calc(100vh - 180px);*/
  max-width: 800px;
  margin: 0 auto;
}
</style>
