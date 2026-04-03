<script setup lang="ts">
import type { SchedaBySchema } from '@/models/browse-item';
import { useTipiSchedeOggetto, type TipoSchedaOggetto, SchedaOggettoCampoTextHandler, SchedaOggettoCampoChipsHandler, SchedaOggettoCampoStarsHandler} from '@/stores/schede-by-schema';
import { ref, watch } from 'vue';
import SchedaOggettoCampoTextView from './schemas/SchedaOggettoCampoTextView.vue';
import SchedaOggettoCampoChipsView from './schemas/SchedaOggettoCampoChipsView.vue';
import SchedaOggettoCampoStarsView from './schemas/SchedaOggettoCampoStarsView.vue';
interface Props {
  scheda: SchedaBySchema,
  editable: boolean,
  saving: boolean,
  form: SchedaBySchema,
}
const props = defineProps<Props>()

const schemas = useTipiSchedeOggetto();

const schema = ref<TipoSchedaOggetto>();

async function init(idSchema: string) {
    schema.value = await schemas.findSchema(idSchema);
}
watch(() => props.scheda.schema, async (n, o) => {
    await init(n);
});
init(props.scheda.schema);

</script>
<template>
    <div v-if="schema" class="data-panel" v-for="campo in schema.campi">
        <span class="data-panel-header">{{ campo.nome }} tipo {{ campo.id }}</span> 
        <SchedaOggettoCampoTextView 
            :scheda="scheda" :editable="editable" :saving="saving" :form="form" :campo="SchedaOggettoCampoTextHandler.digest(campo)"
            v-if="SchedaOggettoCampoTextHandler.owns(campo)">TEXT</SchedaOggettoCampoTextView>
        <SchedaOggettoCampoChipsView 
            :scheda="scheda" :editable="editable" :saving="saving" :form="form" :campo="SchedaOggettoCampoChipsHandler.digest(campo)"
            v-else-if="SchedaOggettoCampoChipsHandler.owns(campo)">CHIPS</SchedaOggettoCampoChipsView>
        <SchedaOggettoCampoStarsView
            :scheda="scheda" :editable="editable" :saving="saving" :form="form" :campo="SchedaOggettoCampoStarsHandler.digest(campo)"
            v-else-if="SchedaOggettoCampoStarsHandler.owns(campo)">STARS</SchedaOggettoCampoStarsView>
        <div v-else>Campo {{ campo.id }} ha tipo {{ campo.tipo }} che non è implementato</div>
    </div>
    <div v-else>Schema {{ scheda.schema }} loading...</div>
</template>
<style scoped></style>
