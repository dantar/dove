<script setup lang="ts">
import type { SchedaBySchema } from '@/models/browse-item';
import { type SchedaOggettoCampoChips, type SchedaOggettoCampoViewProps } from '@/stores/schede-by-schema';
import DataChips from '../forms/DataChips.vue';

const props = defineProps<SchedaOggettoCampoViewProps>()

function getValue( data: SchedaBySchema, campo: SchedaOggettoCampoChips ): string[] {
    return data.values[campo.id] as string[];
}

</script>
<template>
  <div class="data-panel" v-if="campo.tipo == 'chips'">
    <DataChips
      :editable="editable"
      :saving="saving"
      :chips="getValue(scheda, campo) || []"
      :form="getValue(form, campo) || []"
      :options="(campo.opzioni)"
    ></DataChips>
  </div>

</template>
<style lang="css" scoped></style>