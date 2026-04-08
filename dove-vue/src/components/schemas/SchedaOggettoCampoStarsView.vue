<script setup lang="ts">
import type { SchedaBySchema } from '@/models/browse-item';
import { type SchedaOggettoCampo, type SchedaOggettoCampoStars, type SchedaOggettoCampoViewProps } from '@/stores/schede-by-schema';

const props = defineProps<SchedaOggettoCampoViewProps>()

function getValue( data: SchedaBySchema, campo: SchedaOggettoCampoStars ): number {
    return data.values[campo.id] as number;
}

function starShape(value: number, star: number): string {
  return value < star ? '.': 'O';
}

function c(campo: SchedaOggettoCampo): SchedaOggettoCampoStars {
  return campo as SchedaOggettoCampoStars
}

</script>
<template>
  <div>
    <button type="button" v-if="editable" v-for="star in Array.from(Array(c(campo).max).keys())" @click="form.values[campo.id] = star +1">{{ starShape(getValue(form, c(campo)), star +1) }}</button>
    <span v-else v-for="star in Array.from(Array(c(campo).max).keys())">{{ starShape(getValue(scheda, c(campo)), star +1) }}</span>
  </div>
</template>
<style lang="css" scoped></style>