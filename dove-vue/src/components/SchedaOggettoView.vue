<script setup lang="ts">
import { SchedaAccessorio, SchedaVestiti, type SchedaOggetto } from '@/models/browse-item';
import SchedaAccessorioView from './SchedaAccessorioView.vue';
import SchedaVestitiView from './SchedaVestitiView.vue';
interface Props {
  scheda: SchedaOggetto,
  editable: boolean,
  saving: boolean,
  form: SchedaOggetto,
}
const props = defineProps<Props>();

function impostaTipo(tipo: string) {
  props.scheda.tipo = tipo;
  props.form.tipo = tipo
}

</script>
<template>
  <div v-if="scheda && scheda.tipo">
      Scheda!
      <SchedaAccessorioView v-if="SchedaAccessorio.isThis(scheda)" 
        :scheda="(scheda as SchedaAccessorio)"
        :form="(form as SchedaAccessorio)"
        :editable="props.editable"
        :saving="props.saving"
        ></SchedaAccessorioView>
      <SchedaVestitiView v-if="SchedaVestiti.isThis(scheda)" :scheda="(scheda as SchedaVestiti)"></SchedaVestitiView>
  </div>
  <div v-else>
      Nessuna scheda presente. Crea una scheda:
      <button type="button" @click="impostaTipo('accessorio')">Accessorio</button>
      <button type="button" @click="impostaTipo('vestiti')">Vestiti</button>
  </div>

</template>
<style scoped></style>
