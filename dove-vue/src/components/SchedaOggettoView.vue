<script setup lang="ts">
import { SchedaAccessorio, SchedaBySchema, SchedaOggetto, SchedaVestiti } from '@/models/browse-item';
import SchedaAccessorioView from './SchedaAccessorioView.vue';
import SchedaVestitiView from './SchedaVestitiView.vue';
import SchedaBySchemaView from './SchedaBySchemaView.vue';
import { useTipiSchedeOggetto, type TipoSchedaOggetto } from '@/stores/schede-by-schema';
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
}

function impostaSchema(schema: TipoSchedaOggetto) {
  impostaTipo(SchedaBySchema.KEY);
  SchedaBySchema.initWithSchema(schema, props.scheda as SchedaBySchema);
  SchedaBySchema.initWithSchema(schema, props.form as SchedaBySchema);
}

const schede = useTipiSchedeOggetto();

</script>
<template>
  <div v-if="scheda && scheda.tipo">
      <SchedaBySchemaView v-if="SchedaBySchema.isThis(scheda)" 
        :scheda="(scheda as SchedaBySchema)"
        :form="(form as SchedaBySchema)"
        :editable="props.editable"
        :saving="props.saving"
        ></SchedaBySchemaView>
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
  </div>
  <div v-if="editable" class="arrayitems">
    <span>Cambia tipo scheda</span>
    <button v-for="schema in schede.tipi" type="button" @click="impostaSchema(schema)" :disabled="saving">
      <span class="button entity entity--by-schema">{{ schema.nome }}</span>
    </button>

  </div>

</template>
<style scoped></style>
