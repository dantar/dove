<script setup lang="ts">
import { MinionItem } from '@/models/minion-item';

const props = defineProps({
  minion: MinionItem
})

const emit = defineEmits(['speaks']);

function heyYou() {
    emit('speaks', props.minion);
}

</script>
<template>
    <div>
        <span>Nodo Minion</span>
        <span>{{ props.minion?.name }}</span>
        <button @click="heyYou">hey you</button>
    </div>
    <div><slot>Nothing</slot></div>
</template>

<style scoped></style>