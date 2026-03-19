<script setup lang="ts">
import { SchedaVestiti, type SchedaAccessorio } from '@/models/browse-item';
import DataChips from './forms/DataChips.vue';
interface Props {
  scheda: SchedaVestiti,
  editable: boolean,
  saving: boolean,
  form: SchedaVestiti,
}
const props = defineProps<Props>()

</script>
<template>
  <div class="data-panel">
    <span class="data-panel-header">Età</span>
    <DataChips
      :editable="editable"
      :saving="saving"
      :chips="scheda.eta"
      :form="form.eta"
      :options="(SchedaVestiti.options.eta)"
    ></DataChips>
  </div>
  <div class="data-panel">
    <span class="data-panel-header">Sesso</span>
    <DataChips
      :editable="editable"
      :saving="saving"
      :chips="scheda.sesso"
      :form="form.sesso"
      :options="(SchedaVestiti.options.sesso)"
    ></DataChips>
  </div>
  <div class="data-panel">
    <span class="data-panel-header">Stagione</span>
    <DataChips
      :editable="editable"
      :saving="saving"
      :chips="scheda.stagione"
      :form="form.stagione"
      :options="(SchedaVestiti.options.stagione)"
    ></DataChips>
  </div>
</template>
<style scoped></style>
