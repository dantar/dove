<script setup lang="ts">
</script>
<template>
<div class="card-box">
    <div class="card-layout">
        <div class="card-image">
            <slot name="image"></slot>
        </div>
        <div class="card-content">
            <slot name="header"></slot>
            <slot name="default"></slot>
            <slot name="footer"></slot>
        </div>
    </div>
</div>
</template>
<style scoped>

.card-image {
    flex: 1;
    max-width: 100px;
    background-color: beige;
    align-content: center;
}
.card-image:empty {
    display: none;
}

.card-layout {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
}

.card-content {
    flex: 3;
}

.card-box {
    position: relative;
    border: 1px solid #ccc;
    border-radius: 6px;
    background-color: white;
    display: flex;
    flex-direction: column;
    box-shadow: 0 4px 10px rgba(0,0,0,0.1);
    width: 96vw;
}

.content {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 24px;
    min-width: 200px;
}

@media (min-width: 768px) {
    .gallery-item .card-box {
        width: 48vw;
    }    
}
@media (min-width: 1024px) {
    .gallery-item .card-box {
        width: 32vw;
    }    
}
@media (min-width: 1280px) {
    .gallery-item .card-box {
        width: 24vw;
    }    
}

</style>