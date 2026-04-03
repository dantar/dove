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
        <span :class="`title-short entity entity--${oggetto.scheda.tipo}`">
            <ImageThumb :uuid="oggetto.id" :image="''"></ImageThumb>
            {{ oggetto.nome || `Oggetto ${oggetto.id.split('-')[0]}` }}
        </span>
    </RouterLink>
</template>
<style scoped>
</style>
