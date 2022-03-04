<script setup>
import WordleHeader from "./components/WordleHeader.vue";
import WordleBoard from "./components/WordleBoard.vue";
import WordleKeyboard from "./components/WordleKeyboard.vue";
import WordleChallengeModal from "./components/WordleChallengeModal.vue"
import { ref, onBeforeMount } from 'vue'
import { getHint, isChallengeMode } from "./game";

onBeforeMount(() => {
  if (isChallengeMode()) {
    hint.value = getHint()
  }
})

const word = ref([])
const hint = ref('')
const guessCount = ref(0)
const records = ref(Array.from({ length: 6 }, () => //FIXME: add feature custom wordlength and guess time
  Array.from({ length: 5 }, () => ({
    letter: '',
    status: ''
  }))
))
const showChallengeModal = ref(false)
const vituralKeyboard = ref(true)

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
  <wordle-challenge-modal
    v-show="showChallengeModal"
    @close="closeModal"
  >
  </wordle-challenge-modal>
  <wordle-header @make-challenge="showModal" />
  <div class="app-wrapper flex flex-col justify-between">
    <wordle-board :records="records" />
    <div v-if="hint" class="text-center text-3xl mb-3">Hint for you:
      {{ `"${hint}"` }}
    </div>
    <wordle-keyboard
      v-model:guessWord="word"
      :vituralKeyboard="vituralKeyboard"
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
