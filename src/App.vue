<script>
import WordleHeader from "./components/WordleHeader.vue";
import WordleBoard from "./components/WordleBoard.vue";
import WordleKeyboard from "./components/WordleKeyboard.vue";
export default {
  components: {WordleKeyboard, WordleBoard, WordleHeader }
}
</script>

<template>
  <wordle-header/>
  <div class="app-wrapper flex flex-col justify-between">
    <wordle-board />
    <wordle-keyboard/>
  </div>
</template>

<style>
#app {
  font-family: 'Comic Sans MS', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  overflow: hidden;
}
.app-wrapper {
  /*min-height: calc(100vh - 180px);*/
  max-width: 800px;
  margin: 0 auto;
}
</style>
