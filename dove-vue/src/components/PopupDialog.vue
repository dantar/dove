<script setup lang="ts">
import Heroicon from './Heroicon.vue';

    const emit = defineEmits(['close']);
</script>
<template>
<div class="fullpage popup">
    <div class="dialog">
        <div class="buttons">
            <slot name="buttons"><button @click="emit('close')"><heroicon icon="cancel"></heroicon></button></slot>
        </div>
        <div class="content">
            <slot></slot>
        </div>
    </div>
</div>
</template>
<style scoped>

.popup {
    z-index: 10;
}

.fullpage {
    display: flex;
    flex-direction: column;
    justify-content: center;   /* centro orizzontale */
    align-items: center;       /* centro verticale */
    width: 100vw;
    height: 100vh;
    background-color: #a5a5a5a5; /* opzionale */
    position: fixed;
    top: 0;
    left: 0;
}

.dialog {
    position: relative;
    max-height: calc(100vh - 32px);
    max-width: calc(100vw - 16px);
    border: 1px solid #ccc;
    border-radius: 8px;
    background-color: white;
    display: flex;
    flex-direction: column;
    box-shadow: 0 4px 10px rgba(0,0,0,0.1);
}

.content {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 24px;
    min-width: min(300px, calc(100vw - 16px));
    box-sizing: border-box;
    overflow-y: auto;
}

.buttons {
    width: 100%;
    display: flex;
    flex-direction: row-reverse;
    top: -20px;
    position: absolute;
    padding-right: 10px;
}

</style>