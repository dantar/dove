<script setup lang="ts">
import type { SchedaBySchema } from '@/models/browse-item';
import { type SchedaOggettoCampoChips, type SchedaOggettoCampoStars } from '@/stores/schede-by-schema';
import DataChips from '../forms/DataChips.vue';
import { computed } from 'vue';

interface Props {
  scheda: SchedaBySchema,
  editable: boolean,
  saving: boolean,
  form: SchedaBySchema,
  campo: SchedaOggettoCampoStars,
}
const props = defineProps<Props>()

function getValue( data: SchedaBySchema, campo: SchedaOggettoCampoStars ): number {
    return data.values[campo.id] as number;
}

function starShape(value: number, star: number): string {
  return value < star ? '.': 'O';
}

</script>
<template>
  <div class="data-panel">
    <button type="button" v-if="editable" v-for="star in Array.from(Array(campo.max).keys())" @click="form.values[campo.id] = star +1">{{ starShape(getValue(form, campo), star +1) }}</button>
    <span v-else v-for="star in Array.from(Array(campo.max).keys())">{{ starShape(getValue(scheda, campo), star +1) }}</span>
  </div>
</template>
<style lang="css" scoped></style>