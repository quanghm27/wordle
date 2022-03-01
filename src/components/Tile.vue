<template>
  <div class="tile tile--empty"></div>
</template>

<script>
export default {
  name: "Tile"
}
</script>

<style scoped>
.tile {
  width: 50px;
  height: 50px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  line-height: 2rem;
  font-weight: bold;
  vertical-align: middle;
  box-sizing: border-box;
  color: #2c3e50;
  text-transform: uppercase;
  user-select: none;
}

.tile--empty {
  @apply border-2 border-gray-300
}
</style>
