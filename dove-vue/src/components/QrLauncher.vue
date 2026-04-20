<script setup lang="ts">
import { ref } from "vue"
import QrScanner from "./QrScanner.vue"
import Heroicon from "./Heroicon.vue";

interface Props {
  disabled?: boolean,
  mode?: 'one' | 'many'
}
const props = defineProps<Props>();

const emit = defineEmits<{
  (e: "decodedOne", code: string): void,
  (e: "decodedMany", codes: string[]): void,
  (e: "cancel"): void,
}>()

const visible = ref<boolean>(false);

const launchScanner = () => {
  visible.value = true;
}

const handleCodes = (values: string[]) => {
  visible.value = false;
  if (values.length > 0) {
    if (!props.mode || props.mode == 'one') {
      emit("decodedOne", values[0] || '');
    } else {
      emit("decodedMany", values);
    }
  } else {
    emit("cancel");
  }
}

</script>
<template>
  <button class="btn" type="button" @click="launchScanner" :disabled="disabled">
    <slot name="default"><Heroicon icon="qr-code"></Heroicon></slot>
  </button>
  <QrScanner v-if="visible"
    ref="scanner"
    :send-at="mode == 'one' ? 1 : 0"
    @decoded="handleCodes"
  />
</template>

<style scoped></style>