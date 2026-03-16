<script setup lang="ts">
import type { SchedaAccessorio, SchedaVestiti } from '@/models/browse-item';
interface Props {
  scheda: SchedaVestiti
}
const props = defineProps<Props>()
</script>
<template>
    Vestiti
    <div>Età: {{ scheda.eta }}</div>
    <div>Sesso: {{ scheda.sesso }}</div>
    <div>Stagione: {{ scheda.stagione }}</div>
</template>
<style scoped></style>
