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
    Vestiti
    <div>
      Età:
      <DataChips
        :editable="editable"
        :saving="saving"
        :chips="scheda.eta"
        :form="form.eta"
        :options="(SchedaVestiti.options.eta)"
      ></DataChips>
    </div>
    <div>
      Sesso: 
      <DataChips
        :editable="editable"
        :saving="saving"
        :chips="scheda.sesso"
        :form="form.sesso"
        :options="(SchedaVestiti.options.sesso)"
      ></DataChips>
    </div>
    <div>
      Stagione: 
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
