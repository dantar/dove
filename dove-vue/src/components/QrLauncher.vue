<script setup lang="ts">
import { ref } from "vue"
import QrScanner from "./QrScanner.vue"
import Heroicon from "./Heroicon.vue";

interface Props {
  disabled?: boolean,
}
const props = defineProps<Props>();

const emit = defineEmits<{
  (e: "decoded", value: string): void
}>()

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
  emit("decoded", value);
}

</script>
<template>
  <button class="btn" type="button" @click="launchScanner">
    <Heroicon icon="qr-code"></Heroicon>
  </button>
  <QrScanner v-if="visible"
    ref="scanner"
    @decoded="handleQr"
    @closed="closedScanner"
  />
</template>

<style scoped></style>