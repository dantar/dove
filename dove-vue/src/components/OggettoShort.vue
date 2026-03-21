<script setup lang="ts">
import type { OggettoObj } from '@/models/browse-item';
import ImageThumb from './ImageThumb.vue';
interface Props {
    oggetto: OggettoObj
}
const props = defineProps<Props>()
</script>
<template>
    <RouterLink :to="`/oggetto/${oggetto.id}`">
        <span :class="`oggetto-short entity entity--${oggetto.scheda.tipo}`">
            <ImageThumb :uuid="oggetto.id" :image="oggetto.thumbnail"></ImageThumb>
            {{ oggetto.nome || oggetto.id }}
        </span>
    </RouterLink>
</template>
<style scoped>
.oggetto-short img {
    max-height: 1.2rem;
    position: relative;
    top: 0.1rem;
}
</style>
