<script setup lang="ts">
</script>
<template>
<div class="card-box">
    <slot name="header"></slot>
    <slot name="default"></slot>
    <slot name="footer"></slot>
</div>
</template>
<style scoped>

.card-box {
    position: relative;
    border: 1px solid #ccc;
    border-radius: 6px;
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
    min-width: 300px;
}

</style>