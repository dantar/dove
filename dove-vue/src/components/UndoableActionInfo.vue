<script setup lang="ts">
import { UndoableAction, useUndoableActions } from '@/stores/undoable-actions';
import { ref } from 'vue';
import Heroicon from './Heroicon.vue';

interface Props {
    undoable: UndoableAction,
}
const props = defineProps<Props>();

function aboutUndoable() {
    UndoableAction.abort(props.undoable);
}

</script>
<template>
    <div>Undo? {{ undoable.countdown }}
        <button type="button" @click="aboutUndoable()">
            <Heroicon icon="cancel"></Heroicon> annulla
        </button>
    </div>
</template>
<style scoped>

</style>