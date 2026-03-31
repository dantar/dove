<script setup lang="ts">
import { SchedaAccessorio, SchedaBySchema, SchedaOggetto, SchedaVestiti } from '@/models/browse-item';
import SchedaAccessorioView from './SchedaAccessorioView.vue';
import SchedaVestitiView from './SchedaVestitiView.vue';
import SchedaBySchemaView from './SchedaBySchemaView.vue';
import { useTipiSchedeOggetto } from '@/stores/schede-by-schema';
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

function impostaSchema(id: string) {
  impostaTipo(SchedaBySchema.KEY);
  (props.scheda as SchedaBySchema).schema = id;
  (props.form as SchedaBySchema).schema = id;
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
  <div v-if="editable || !(scheda && scheda.tipo)" class="arrayitems">
    <button type="button" @click="impostaTipo('accessorio')" :disabled="saving">
      <span class="button entity entity--accessorio">Accessorio</span>
    </button>
    <button type="button" @click="impostaTipo('vestiti')" :disabled="saving">
      <span class="button entity entity--vestiti">Vestiti</span>
    </button>
    <button v-for="schema in schede.tipi" type="button" @click="impostaSchema(schema.id)" :disabled="saving">
      <span class="button entity entity--by-schema">{{ schema.nome }}</span>
    </button>

  </div>

</template>
<style scoped></style>
