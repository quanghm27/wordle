<template>
    <div class="fixed inset-0 bg-gray-300 bg-opacity-80 overflow-y-auto h-full w-full">
        <div class="flex flex-col aligns-start w-full lg:w-1/3 mx-auto h-2/3 p-2 absolute bottom-[2px] lg:bottom-1/4 lg:left-1/3 bg-white shadow-lg">
            <div class="text-4xl text-center relative pb-2 border-b">
                <div>Make challenge</div>
                <div class="absolute right-0 top-1/4 cursor-pointer" @click="$emit('close')">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
                        <path fill="#2c3e50" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
                    </svg>
                </div>
            </div>
            <div class="flex flex-col text-3xl mt-5 mx-20 mb-auto">
                <div class="mb-1">Word*:</div>
                <div class="mb-5">
                    <input
                        v-model="word"
                        type="text"
                        placeholder="(Give extract 5 characters)"
                        maxlength="5"
                        class="w-full text-2xl px-2 border border-gray-300 bg-slate-200"
                    />
                    <span
                        v-show="showErr"
                        class="text-xl text-red-600"
                    >
                        Please give extractly 5 letters 'a-z' or 'A-Z'
                    </span>
                </div>
                <div class="mb-1">Hint (optional):</div>
                <div class="mb-5">
                    <input
                        v-model="hint"
                        type="text"
                        class="w-full text-2xl px-2 border border-gray-300 bg-slate-200"
                    />
                </div>
                <input
                    id="clipboard"
                    type="hidden"
                    class=""
                />
            </div>
            <div class="text-center mb-5">
                <button @click="handleSubmit" class="px-10 py-2 bg-gray-200 rounded text-2xl">Confirm &amp; Copy clipboard</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, nextTick } from 'vue';
import { createUrlForShare, GUESS_WORD_LENGTH } from '../game/index'

const word = ref('')
const hint = ref('')
const showErr = ref(false)

function validateChallenge() {
    showErr.value = false

    if (!word.value.length || word.value.length !== GUESS_WORD_LENGTH) {
        showErr.value = true
        return true
    } else if (!/^[A-Za-z]+$/.test(word.value)) {
        showErr.value = true
    }

    return showErr.value
}

async function handleSubmit() {
    const invalid = validateChallenge()
    if (invalid) return

    // FIXME: not use deprecated 'execCommand', change to clipboardAPI
    const hiddenInput = document.querySelector('#clipboard')
    hiddenInput.setAttribute('type', 'text')
    hiddenInput.value = createUrlForShare(word.value, hint.value)
    await nextTick()
    hiddenInput.select()
    try {
        document.execCommand('copy');
    } catch (err) {
        alert('Oops, unable to copy');
    }

    // Clear range
    hiddenInput.setAttribute('type', 'hidden')
    window.getSelection().removeAllRanges()
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
