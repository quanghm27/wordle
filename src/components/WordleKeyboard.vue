<template>
  <!-- <p class="font-bold text-3xl">{{ guessWord.map(x => x.letter).join('') }}</p> -->
  <div class="keyboard-wrapper">
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
          :class="keyboardStates.get(btnLetter)"
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
import { computed, watch, toRefs, ref, onMounted } from 'vue'
import { GUESS_WORD_LENGTH, checkWord, guess, WordBankException } from "../game/index"

const props = defineProps({
  guessWord: {
    type: Array,
    default: () => []
  },
  vituralKeyboard: {
    type: Boolean,
    default: true
  }
})
const { guessWord, vituralKeyboard } = toRefs(props)
const emit = defineEmits(['update:guessWord', 'enter'])
const keyboardStates = ref(new Map())

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

    result.forEach(item => {
      evaluateKeyboardState(item.letter, item.status)
    })
    emit('enter', result)
  } catch (e) {
    if (e instanceof WordBankException) {
      alert(e.message)
    }
  }
}

function evaluateKeyboardState(letter, status) {
  const currentState = keyboardStates.value.get(letter)

  const letterStateNew = currentState === 'init'
  const letterStateAbsent = currentState === 'absent'
  const letterStatePresent = currentState === 'present'

  if ( letterStateNew ||
       letterStateAbsent ||
      (letterStatePresent && status === 'correct')) {
    keyboardStates.value.set(letter, status)
  }
}

// Button Undo
const disabledUndo = computed(() => {
  return guessWord.value.length === 0
})

function undo() {
  if (disabledUndo.value) return
  const token = guessWord.value.pop()
  undoKeyboardState(token.letter)
  emit('update:guessWord', guessWord.value)
}


function undoKeyboardState(letter) {
  const exist = guessWord.value.find( x => x.letter === letter)
  const currentState = keyboardStates.value.get(letter)
  if (!exist && currentState === 'init') {
    keyboardStates.value.delete(letter)
  }
}

// Letter Buttons 
const disabledButton = computed(() => {
  return guessWord.value.length === GUESS_WORD_LENGTH
})

function typing(letter) {
  if (disabledButton.value) return
  const token = guess(letter)

  guessWord.value.push(token)
  setLetterState(letter, token.status)
  emit('update:guessWord', guessWord.value)
}

function setLetterState(letter, status) {
  if (isNewLetter(letter)) {
    keyboardStates.value.set(letter, status)
  }
}

// Check this letter evaluated or not
function isNewLetter(letter) {
  return !keyboardStates.value.get(letter)
}

// Regist vitural keyboard
onMounted(() => {
  window.addEventListener('keydown', onkeydown)
})

watch(vituralKeyboard, (turnOn) => {
  if (turnOn) {
    console.log('vitural keyboad ON')
    window.addEventListener('keydown', onkeydown)
  } else {
    console.log('vitural keyboard OFF')
    window.removeEventListener('keydown', onkeydown)
  }
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
