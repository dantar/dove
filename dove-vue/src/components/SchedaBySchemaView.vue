<script setup lang="ts">
import type { SchedaBySchema } from '@/models/browse-item';
import { useTipiSchedeOggetto, type TipoSchedaOggetto, SchedaOggettoCampoTextHandler, SchedaOggettoCampoChipsHandler} from '@/stores/schede-by-schema';
import { ref } from 'vue';
import SchedaOggettoCampoTextView from './schemas/SchedaOggettoCampoTextView.vue';
import SchedaOggettoCampoChipsView from './schemas/SchedaOggettoCampoChipsView.vue';
interface Props {
  scheda: SchedaBySchema,
  editable: boolean,
  saving: boolean,
  form: SchedaBySchema,
}
const props = defineProps<Props>()

const schemas = useTipiSchedeOggetto();

const schema = ref<TipoSchedaOggetto>();

async function init() {
    schema.value = await schemas.findSchema(props.scheda.schema);
}

init();



</script>
<template>
    <div v-if="schema" class="data-panel" v-for="campo in schema.campi">
        <span class="data-panel-header">{{ campo.nome }} tipo {{ campo.id }}</span> 
        <SchedaOggettoCampoTextView v-if="SchedaOggettoCampoTextHandler.owns(campo)">TEXT</SchedaOggettoCampoTextView>
        <SchedaOggettoCampoChipsView 
            :scheda="scheda" :editable="editable" :saving="saving" :form="form" :campo="SchedaOggettoCampoChipsHandler.digest(campo)"
            v-if="SchedaOggettoCampoChipsHandler.owns(campo)">CHIPS</SchedaOggettoCampoChipsView>
        <span v-if="editable">Versione editabile del campo {{ campo.id }} di tipo {{ campo.tipo }}</span>
        <span v-else>versione non editabile del campo</span>
    </div>
    <div v-else>Schema {{ scheda.schema }} loading...</div>
</template>
<style scoped></style>
