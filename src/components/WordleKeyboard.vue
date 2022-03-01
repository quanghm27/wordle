<template>
  <div class="keyboard-wrapper">
    <div class="flex mb-1">
      <KeyboardButton v-for="(btn, index) in firstRow" :key="index">
        {{ btn }}
      </KeyboardButton>
    </div>
    <div class="flex mb-1">
      <div class="a-half">
      </div>
      <KeyboardButton v-for="(btn, index) in secondRow" :key="index">
        {{ btn }}
      </KeyboardButton>
      <div class="a-half">
      </div>
    </div>
    <div class="flex">
      <KeyboardButton class="one-a-half">
        Enter
      </KeyboardButton>
      <KeyboardButton v-for="(btn, index) in thirdRow" :key="index">
        {{ btn }}
      </KeyboardButton>
      <KeyboardButton class="one-a-half">
        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24">
          <path fill="#2c3e50" d="M22 3H7c-.69 0-1.23.35-1.59.88L0 12l5.41 8.11c.36.53.9.89 1.59.89h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H7.07L2.4 12l4.66-7H22v14zm-11.59-2L14 13.41 17.59 17 19 15.59 15.41 12 19 8.41 17.59 7 14 10.59 10.41 7 9 8.41 12.59 12 9 15.59z"></path>
        </svg>
      </KeyboardButton>
    </div>
  </div>
</template>

<script setup>
import KeyboardButton from "./KeyboardButton.vue";
import { ref } from 'vue'

const firstRow = ref(['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'])
const secondRow = ref(['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'])
const thirdRow = ref(['Z', 'X', 'C', 'V', 'B', 'N', 'M'])

</script>

<style scoped>
.keyboard-wrapper {
  height: 184px;
  @apply mx-auto px-2 pb-2 w-full md:w-3/4 lg:w-full
}
.a-half {
  flex: 0.5;
}
.one-a-half {
  flex: 1.5;
}
</style>
