<script setup lang="ts">
import { UndoableAction, useUndoableActions } from '@/stores/undoable-actions';
import { ref } from 'vue';
import Heroicon from './Heroicon.vue';
import CardFormat from './CardFormat.vue';

interface Props {
    undoable: UndoableAction,
}
const props = defineProps<Props>();

function aboutUndoable() {
    UndoableAction.abort(props.undoable);
}

</script>
<template>
    <div class="undoable-action">
        <span>{{ undoable.text }}</span>
        <span>{{ undoable.countdown / 1000 }}s</span>
        <button type="button" @click="aboutUndoable()">
            <Heroicon icon="cancel"></Heroicon> annulla
        </button>
    </div>
</template>
<style scoped>
.undoable-action {
    pointer-events: auto;
    border: 1px solid #ccc;
    border-radius: 6px;
    background-color: white;
    display: flex;
    flex-direction: column;
    justify-content: center;
    box-shadow: 0 4px 10px rgba(0,0,0,0.1);
    padding: 10px;
}
</style>