<script setup>
import WordleHeader from "./components/WordleHeader.vue";
import WordleBoard from "./components/WordleBoard.vue";
import WordleKeyboard from "./components/WordleKeyboard.vue";
import WordleChallengeModal from "./components/WordleChallengeModal.vue"
import { ref, onBeforeMount } from 'vue'
import { validateChallengeWord, WordBankException, getHint, isChallengeMode } from "./game";

onBeforeMount(() => {
  if (isChallengeMode()) {
    const challenge = validateChallengeWord()
    console.log('Challenge mode: ', challenge)
    if (challenge) {
      const hint = ref('')
      hint.value = getHint()
    } else {
      alert('Wrong word encoded, switch "Challenge Word" to "Daily word".')
    }
  }
})

const word = ref([])
const guessCount = ref(0)
const records = ref(Array.from({ length: 6 }, () => //FIXME: add feature custom wordlength and guess time
  Array.from({ length: 5 }, () => ({
    letter: '',
    status: ''
  }))
))
const showChallengeModal = ref(false)

function handleTypingLetter(word) {
  const newWord = [...word]
  while (newWord.length < 5) {
    newWord.push({ letter: '', status: ''}) // Padding letter
  }
  records.value[guessCount.value].splice(0, newWord.length, ...newWord)
}

function handleGuessing(event) {
  // Replace word each time submit
  records.value.splice(guessCount.value, 1, event)
  guessCount.value += 1
  word.value = []
}

</script>

<template>
  <wordle-challenge-modal
    v-if="showChallengeModal"
    @close="showChallengeModal = false"
  >
  </wordle-challenge-modal>
  <wordle-header @make-challenge="showChallengeModal = true" />
  <div class="app-wrapper flex flex-col justify-between">
    <wordle-board :records="records" />
    <wordle-keyboard
      v-model:guessWord="word"
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
