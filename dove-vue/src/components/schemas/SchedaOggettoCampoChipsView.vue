<script setup lang="ts">
import type { SchedaBySchema } from '@/models/browse-item';
import { type SchedaOggettoCampoChips } from '@/stores/schede-by-schema';
import DataChips from '../forms/DataChips.vue';

interface Props {
  scheda: SchedaBySchema,
  editable: boolean,
  saving: boolean,
  form: SchedaBySchema,
  campo: SchedaOggettoCampoChips,
}
const props = defineProps<Props>()

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