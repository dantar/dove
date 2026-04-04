<script setup lang="ts">
import { SchedaBySchema } from '@/models/browse-item';
import { useTipiSchedeOggetto, type TipoSchedaOggetto, type SchedaOggettoCampoViewProps, type SchedaOggettoCampo} from '@/stores/schede-by-schema';
import { ref, watch } from 'vue';
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

function viewProps(campo: SchedaOggettoCampo): SchedaOggettoCampoViewProps {
    return {
        scheda: props.scheda,
        editable: props.editable,
        saving: props.saving,
        form: props.form,
        campo: campo,
    }
}

</script>
<template>
    <div v-if="schema" class="data-panel" v-for="campo in schema.campi">
        <span class="data-panel-header">{{ campo.nome }} tipo {{ campo.id }}</span> 
        <component :is="SchedaBySchema.handler[campo.tipo]?.component()" v-bind="viewProps(campo)" />
    </div>
    <div v-else>Schema {{ scheda.schema }} loading...</div>
</template>
<style scoped></style>
