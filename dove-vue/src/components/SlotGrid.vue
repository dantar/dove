<script setup lang="ts">

</script>
<template>
<div class="slot-grid">
    <slot name="default"></slot>
</div>
</template>
<style scoped>

.slot-grid {
    position: relative;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
}

</style>