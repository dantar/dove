<script setup lang="ts">
import { ref } from "vue"
import QrScanner from "./QrScanner.vue"
import {v4 as uuidv4} from 'uuid';

interface Props {
  disabled: boolean,
}
const props = defineProps<Props>();

const emit = defineEmits<{
  (e: "decoded", value: string): void
}>()

const visible = ref<boolean>(false);
const showInput = ref<boolean>(false);
const currentCode = ref<string>('');

const launchScanner = () => {
  console.log("launchScanner")
  visible.value = true;
}

const doShowInput = (b:boolean) => {
  showInput.value = b;
}

const closedScanner = () => {
  console.log("closedScanner")
  visible.value = false;
}

const handleQr = (value: string) => {
  console.log("QR letto:", value)
  visible.value = false;
  emit("decoded", value);
}
const emitInputCode = () => {
  showInput.value = false;
  emit("decoded", currentCode.value);
  currentCode.value = '';
}

</script>
<template>
  <button type="button" @click="launchScanner">Scanner</button>
  <button type="button" @click="() => doShowInput(!showInput)">▽</button>
  <div v-if="showInput">
    <form @submit.prevent="emitInputCode()">
      <input type="text" v-model.trim="currentCode" />
      <button type="button" @click="() => currentCode = uuidv4()" >▣</button>
      <button type="submit" :disabled="!currentCode || disabled">✓</button>
    </form>
  </div>
  <QrScanner v-if="visible"
    ref="scanner"
    @decoded="handleQr"
    @closed="closedScanner"
  />
</template>

<style scoped></style>