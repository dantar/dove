<script setup lang="ts">
import type { OggettoObj } from '@/models/browse-item';
interface Props {
    oggetto: OggettoObj
}
const props = defineProps<Props>()
</script>

<template>
  <div>{{ oggetto?.nome || oggetto?.id }}</div>
</template>

<style scoped></style>
