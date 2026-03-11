<script setup lang="ts">
import type { OggettoObj } from '@/models/browse-item';
interface Props {
    oggetto: OggettoObj
}
const props = defineProps<Props>()
</script>
<template><span>{{ oggetto?.nome || oggetto?.id }}</span></template>
<style scoped></style>
