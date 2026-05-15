<script setup lang="ts">
import { useUndoableActions } from '@/stores/undoable-actions';
import UndoableActionInfo from './UndoableActionInfo.vue';
import { ref } from 'vue';

const undoables = useUndoableActions();
const all = ref(undoables.undoables);

</script>
<template>

<div class="toast-container">
  <UndoableActionInfo v-for="undoable in undoables.undoables" :undoable="undoable" class="toast"></UndoableActionInfo>
</div>
    
</template>
<style scoped>

.toast-container {
  position: fixed;
  bottom: 16px;
  left: 16px;

  display: flex;
  flex-direction: column;
  gap: 8px;

  /* fondamentale */
  pointer-events: none;

  z-index: 1000;
}

</style>