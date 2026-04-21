<script setup lang="ts">
import type { SchedaBySchema } from '@/models/browse-item';
import { type SchedaOggettoCampo, type SchedaOggettoCampoStars, type SchedaOggettoCampoViewProps } from '@/stores/schede-by-schema';

const props = defineProps<SchedaOggettoCampoViewProps>()

function getValue( data: SchedaBySchema, campo: SchedaOggettoCampoStars ): number {
    return data.values[campo.id] as number;
}

function starShape(value: number, star: number): string {
  return value < star ? 'empty': 'full';
}
function starFill(value: number, star: number): string {
  return value < star ? 'none': 'currentColor';
}

function c(campo: SchedaOggettoCampo): SchedaOggettoCampoStars {
  return campo as SchedaOggettoCampoStars
}

</script>
<template>
  <svg xmlns="http://www.w3.org/2000/svg" v-bind:viewBox="`0 0 ${24 * c(campo).max} 24`" stroke-width="1.5" stroke="currentColor" class="size-6">
    <defs>
      <path
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
        id="star-empty" />
      <path
        fill="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
        id="star-full" />
    </defs>
    <g v-for="star in Array.from(Array(c(campo).max).keys())" @click="() => { if (editable) {form.values[campo.id] = star +1 }}">
      <rect
        fill="white" stroke="none"
        width="24" height="24"
        v-bind:x="24 * star" y="0" ry="0"
         />
      <rect></rect>
      <use v-bind:x="24 * star" y="0" 
        v-bind:href="`#star-${starShape(getValue(editable ? form : scheda, c(campo)), star +1)}`"
         />
    </g>
  </svg>
</template>
<style lang="css" scoped>
svg {
  height: 1rem;
}
</style>