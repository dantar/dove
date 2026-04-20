<script setup lang="ts">
import { SchedaBySchema } from '@/models/browse-item';
import { useTipiSchedeOggetto, type TipoSchedaOggetto, type SchedaOggettoCampoViewProps, type SchedaOggettoCampo} from '@/stores/schede-by-schema';
import { ref, watch } from 'vue';
import SlotGrid from './SlotGrid.vue';
import CardFormat from './CardFormat.vue';
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
    <div class="scheda-box">
        <div v-if="schema" class="scheda-header">
            <span>{{ schema.nome }}</span>
        </div>
        <SlotGrid>
            <div v-if="schema" class="data-panel" v-for="campo in schema.campi">
                <span class="data-panel-header">{{ campo.nome }}</span> 
                <span class="data-panel-content">
                    <component :is="SchedaBySchema.handler[campo.tipo]?.component()" v-bind="viewProps(campo)" />
                </span>
            </div>
            <div v-else>Schema {{ scheda.schema }} loading...</div>
        </SlotGrid>
    </div>
</template>
<style scoped>

.data-panel:has(.empty) {
    display: none;
}

.scheda-box{
    margin-top: 0.5rem;
    margin-left: 4px;
    margin-right: 4px;
    margin-bottom: 2px;
    border-top: 1px solid green;
    border-left: 0;
    border-right: 0;
    border-bottom: 0;
}

.scheda-header {
    width: 100%;
    text-align: center;
    height: 0.8rem;
}
.scheda-header span {
    position: relative;
    top: -0.6rem;
    background-color: white;
    font-size: 0.7rem;
    color: green;
    border: 1px solid green;
    padding: 2px;
    border-radius: 4px;
}
</style>
