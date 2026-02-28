<script setup lang="ts">
import { ref } from "vue"
import QrScanner from "./QrScanner.vue"

const scanner = ref<InstanceType<typeof QrScanner> | null>(null)
const visible = ref<boolean>(false);

const launchScanner = () => {
  console.log("launchScanner")
  visible.value = true;
}

const closedScanner = () => {
  console.log("closedScanner")
  visible.value = false;
}

const handleQr = (value: string) => {
  console.log("QR letto:", value)
  visible.value = false;
}
</script>
<template>
  <button @click="launchScanner">Scanner</button>

  <QrScanner v-if="visible"
    ref="scanner"
    @decoded="handleQr"
    @closed="closedScanner"
  />
</template>

<style scoped></style>