<script setup lang="ts">
import { SchedaBySchema, SchedaOggetto } from '@/models/browse-item';
import SchedaBySchemaView from './SchedaBySchemaView.vue';
import { useTipiSchedeOggetto, type TipoSchedaOggetto } from '@/stores/schede-by-schema';
import { ref, watch } from 'vue';
import { useLoggedUser } from '@/stores/logged-user';
interface Props {
  scheda: SchedaOggetto,
  editable: boolean,
  saving: boolean,
  form: SchedaOggetto,
  repo: string,
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

const user = useLoggedUser();
async function init(repo: string): Promise<void> {
  user.user.repos
  .filter(r => r.root.id = repo)
  .forEach(r => schemi.value = r.schemi);
}
const schemi = ref<TipoSchedaOggetto[]>([]);
watch(() => props.repo, (n,o) => init(n));

init(props.repo)
.then(() => {});

</script>
<template>
  <div v-if="scheda && scheda.tipo">
      <SchedaBySchemaView v-if="SchedaBySchema.isThis(scheda)" 
        :scheda="(scheda as SchedaBySchema)"
        :form="(form as SchedaBySchema)"
        :editable="props.editable"
        :saving="props.saving"
        ></SchedaBySchemaView>
  </div>
  <div v-else class="empty">
      <span class="notimportant">Nessuna scheda presente. </span>
  </div>
  <div v-if="editable" class="arrayitems">
    <span>Cambia tipo scheda</span>
    <button v-if="schemi" v-for="schema in schemi" type="button" @click="impostaSchema(schema)" :disabled="saving">
      <span class="button entity entity--by-schema">{{ schema.nome }}</span>
    </button>

  </div>

</template>
<style scoped>
.empty {
  padding: 2px;
  text-align: center;
}
</style>
