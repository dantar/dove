<script setup lang="ts">
import type { OggettoObj } from '@/models/browse-item';
interface Props {
    oggetto: OggettoObj
}
const props = defineProps<Props>()
</script>
<template>
    <RouterLink :to="`/oggetto/${oggetto.id}`">
        <span>{{ oggetto?.nome || oggetto?.id }}</span>
    </RouterLink>
</template>
<style scoped></style>
