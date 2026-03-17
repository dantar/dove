<script setup lang="ts">
import { SchedaAccessorio, SchedaOggetto, SchedaVestiti } from '@/models/browse-item';
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
  const proto = SchedaOggetto.protos[tipo];
  if (proto) {
    proto(props.scheda);
    proto(props.form);
  }
  console.log("props", props.scheda, props.form)
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
      <SchedaVestitiView v-if="SchedaVestiti.isThis(scheda)" 
        :scheda="(scheda as SchedaVestiti)"
        :form="(form as SchedaVestiti)"
        :editable="props.editable"
        :saving="props.saving"
        ></SchedaVestitiView>
  </div>
  <div v-else>
      <span>Nessuna scheda presente. </span>
      <span v-if="editable">
        Crea una scheda:
        <button type="button" @click="impostaTipo('accessorio')" :disabled="saving">Accessorio</button>
        <button type="button" @click="impostaTipo('vestiti')" :disabled="saving">Vestiti</button>
      </span>
  </div>

</template>
<style scoped></style>
