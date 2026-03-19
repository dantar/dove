<script setup lang="ts">
import type { OggettoObj } from '@/models/browse-item';
interface Props {
    oggetto: OggettoObj
}
const props = defineProps<Props>()
</script>
<template>
    <RouterLink :to="`/oggetto/${oggetto.id}`">
        <span :class="`oggetto-short entity entity--${oggetto.scheda.tipo}`">{{ oggetto.nome || oggetto.id }}</span>
    </RouterLink>
</template>
<style scoped></style>
