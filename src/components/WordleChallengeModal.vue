<template>
    <div class="fixed inset-0 bg-gray-300 bg-opacity-80 overflow-y-auto h-full w-full">
        <div class="flex flex-col w-full lg:w-1/3 mx-auto h-1/2 px-2 absolute bottom-[2px] lg:left-1/3 bg-white shadow-lg">
            <div class="text-4xl text-center relative">
                <div>Make challenge</div>
                <div class="absolute right-0 top-1/4 cursor-pointer" @click="$emit('close')">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
                        <path fill="#2c3e50" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
                    </svg>
                </div>
            </div>
            <div class="flex flex-col text-3xl m-5">
                <div class="mb-2">Word*:</div>
                <div class="mb-5">
                    <input
                        v-model="word"
                        placeholder="(Give extract 5 characters)"
                        maxlength="5"
                        class="w-3/4 text-2xl px-2 border border-gray-300"
                    />
                </div>
                <div class="mb-2">Hint (optional):</div>
                <div class="mb-5">
                    <input v-model="hint" class="w-3/4 text-2xl px-2 border border-gray-300" />
                </div>
            </div>
            <div class="text-center">
                <button @click="handleSubmit" class="px-10 py-2 bg-gray-200 rounded text-2xl">Confirm &amp; Copy clipboard</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const word = ref('')
const hint = ref('')

function makeChallenge() {
    const challenge = JSON.stringify({ word: word.value, hint: hint.value })
    return btoa(challenge)
}

async function handleSubmit() {
    const { origin, pathname } = window.location
    const challengeEncode = makeChallenge()
    const content = `${origin}${pathname}?challenge=${challengeEncode}`

    const result = await navigator.permissions.query({name: "clipboard-write"})
    if (result.state == "granted" || result.state == "prompt") {
        /* write to the clipboard now */
        await navigator.clipboard.writeText(content)
        alert(await navigator.clipboard.readText())
    }

    // // https://developer.apple.com/forums/thread/691873
    // const clipboardItem = new ClipboardItem({
    //     'text/plain': () => {
    //         const copyText = content
    //         return new Promise(async (resolve) => {
    //             resolve(new Blob([copyText]))
    //         })
    //     },
    // })

    // await navigator.clipboard.write([clipboardItem])
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
  border: 2px solid #c3c3c3;
}
</style>
