<template>
  <div class="board-wrapper">
    <div class="board-tile-area">
      <div class="tile-row" v-for="row in maxGuess">
        <tile />
        <tile />
        <tile />
        <tile />
        <tile />
      </div>
    </div>
  </div>
</template>

<script>
import Tile from "./Tile.vue";
export default {
  name: "WordleBoard",
  components: {Tile},
  props: {
    maxGuess: {
      type: Number,
      default: 6
    },
    wordLength: {
      type: Number,
      default: 5
    },
  }
}
</script>

<style scoped>
.board-wrapper {
  min-height: calc(100vh - 350px);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
  overflow: hidden;
}

.board-tile-area {
  display: grid;
  grid-template-rows: repeat(6, 1fr);
  grid-gap: 5px;
  padding: 10px;
  box-sizing: border-box;
}

.tile-row {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-gap: 5px;
}

</style>
