<template>
  <!-- <p class="font-bold text-3xl">{{ guessWord.map(x => x.letter).join('') }}</p> -->
  <div class="keyboard-wrapper" ref="$keyboard">
    <div class="flex"
      v-for="{row, value: buttons} in rows"
      :class="{ 'mb-1' : row !== 'thirdRow' }"
      :key="row"
    >
      <div v-if="row === 'secondRow'" class="spacer"></div>
      <template v-for="(btnLetter, index) in buttons">
        <KeyboardButton
          v-if="btnLetter === 'enter'"
          class="bigger"
          @click="submitWord"
          :key="index"
        >
          {{ btnLetter }}
        </KeyboardButton>
        <KeyboardButton
          v-else-if="btnLetter !== 'enter' && btnLetter !== 'undo'"
          :class="getStatus(btnLetter)"
          @click="typing(btnLetter)"
          :key="btnLetter"
        >
          {{ btnLetter.toUpperCase() }}
        </KeyboardButton>
        <KeyboardButton
          v-else
          class="bigger"
          @click="undo"
        >
          <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24">
            <path fill="#2c3e50" d="M22 3H7c-.69 0-1.23.35-1.59.88L0 12l5.41 8.11c.36.53.9.89 1.59.89h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H7.07L2.4 12l4.66-7H22v14zm-11.59-2L14 13.41 17.59 17 19 15.59 15.41 12 19 8.41 17.59 7 14 10.59 10.41 7 9 8.41 12.59 12 9 15.59z"></path>
          </svg>
        </KeyboardButton>
      </template>
      <div v-if="row === 'secondRow'" class="spacer"></div>
    </div>
  </div>
</template>

<script setup>
import KeyboardButton from "./KeyboardButton.vue";
import { computed, onMounted, onUnmounted, toRefs, ref } from 'vue'
import { GUESS_WORD_LENGTH, checkWord, guess, WordBankException } from "../game/index"

const props = defineProps({
  guessWord: {
    type: Array,
    default: () => []
  }
})
const { guessWord } = toRefs(props)
const emit = defineEmits(['update:guessWord', 'enter'])
const $keyboard = ref(null)

const firstRow = 'qwertyuiop'.split('')
const secondRow = 'asdfghjkl'.split('')
const thirdRow = ['enter', ...'zxcvbnm'.split(''), 'undo']

const rows = [
  { row: 'firstRow', value: firstRow },
  { row: 'secondRow', value: secondRow },
  { row: 'thirdRow', value: thirdRow },
]

const letterPool = []

// Button Enter
const disabledEnter = computed(() => {
  return guessWord.value.length !== GUESS_WORD_LENGTH
})

function submitWord() {
  if (disabledEnter.value) return
  try {
    const guessWordString = guessWord.value.map(x => x.letter).join('')
    const result = checkWord(guessWordString.toLowerCase())

    letterPool.forEach(item => {
      const storedLetter = result.find(x => x.letter === item.letter)
      if (storedLetter) item.status = storedLetter.status
    })
    emit('enter', result)
  } catch (e) {
    if (e instanceof WordBankException) {
      alert(e.message)
    }
  }
}

// Button Undo
const disabledUndo = computed(() => {
  return guessWord.value.length === 0
})

function undo() {
  if (disabledUndo.value) return
  guessWord.value.pop()
  if (letterPool.find(x => x.status === 'init')) letterPool.pop()
  emit('update:guessWord', guessWord.value)
}

// Letter Buttons 
const disabledButton = computed(() => {
  return guessWord.value.length === GUESS_WORD_LENGTH
})
function typing(letter) {
  if (disabledButton.value) return
  if (letterPool.findIndex(x => x.letter === letter) === -1) letterPool.push(guess(letter))
  guessWord.value.push(guess(letter))
  emit('update:guessWord', guessWord.value)
}

function getStatus(letter) {
  // console.log(letterPool)
  const item = letterPool.find(x => x.letter === letter)
  return item?.status
}

// Handle enter by keyboard
onMounted(() => {
  // $keyboard.value.addEventListener('keydown', onkeydown)
  window.addEventListener('keydown', onkeydown)
})

onUnmounted(() => {
  window.addEventListener('keydown', onkeydown)
  // $keyboard.value.removeEventListener('keydown', onkeydown)
})

function onkeydown(event) {
  const key = event.key
  if (key === 'Enter') {
    submitWord()
  } else if (key === 'Backspace') {
    undo()
  } else if (/^[a-zA-Z]$/.test(key)) {
    typing(key)
  } else {
    return
  }
}
</script>

<style scoped>
.keyboard-wrapper {
  height: 184px;
  @apply mx-auto px-2 pb-2 w-full lg:w-1/2 md:w-1/2
}
.spacer {
  flex: 0.5;
}
.bigger {
  flex: 1.5;
  text-transform:capitalize;
}
</style>
