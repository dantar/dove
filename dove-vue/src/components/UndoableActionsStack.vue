<script setup lang="ts">
import { useUndoableActions } from '@/stores/undoable-actions';
import UndoableActionInfo from './UndoableActionInfo.vue';
import { ref } from 'vue';

const undoables = useUndoableActions();
const all = ref(undoables.undoables);

</script>
<template>
    <div>Undoables: {{ undoables.undoables.length }}</div>
    <UndoableActionInfo v-for="undoable in undoables.undoables" :undoable="undoable"></UndoableActionInfo>
</template>
<style scoped>

</style>