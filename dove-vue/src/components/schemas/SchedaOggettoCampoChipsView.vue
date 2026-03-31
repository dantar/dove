<script setup lang="ts">
import type { SchedaBySchema } from '@/models/browse-item';
import { useTipiSchedeOggetto, type SchedaOggettoCampo, type SchedaOggettoCampoChips, type TipoSchedaOggetto } from '@/stores/schede-by-schema';
import { ref } from 'vue';

interface Props {
  scheda: SchedaBySchema,
  editable: boolean,
  saving: boolean,
  form: SchedaBySchema,
  campo: SchedaOggettoCampoChips,
}
const props = defineProps<Props>()
const schemas = useTipiSchedeOggetto();
const schema = ref<TipoSchedaOggetto>();

async function init() {
    schema.value = await schemas.findSchema(props.scheda.schema);
}

function getValue( data: SchedaBySchema, campo: SchedaOggettoCampoChips ): string[] {
    return (data.values as any)[campo.id] as string[];
}

init();

</script>
<template>
  <div class="data-panel">
    <span class="data-panel-header">Età</span>
    <DataChips
      :editable="editable"
      :saving="saving"
      :chips="getValue(scheda, campo)"
      :form="getValue(form, campo)"
      :options="(campo.opzioni)"
    ></DataChips>
  </div>

</template>
<style lang="css" scoped></style>