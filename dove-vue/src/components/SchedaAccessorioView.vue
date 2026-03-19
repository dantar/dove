<script setup lang="ts">
import type { SchedaAccessorio } from '@/models/browse-item';
interface Props {
  scheda: SchedaAccessorio,
  editable: boolean,
  saving: boolean,
  form: SchedaAccessorio,
}
const props = defineProps<Props>()

</script>
<template>
    <div class="data-panel">
        <span class="data-panel-header">Condizioni</span> 
        <span v-if="editable"><input type="number" v-model="props.form.condizioni"></span>
        <span v-else>{{ scheda.condizioni }}</span>
    </div>
    <div class="data-panel">
        <span class="data-panel-header">Descrizione</span> 
        <span v-if="editable" class="data-panel-line"><textarea v-model="props.form.descrizione"></textarea></span>
        <span v-else>{{ scheda.descrizione }}</span>
    </div>
    <div class="data-panel">
        <span class="data-panel-header">Note</span> 
        <span v-if="editable" class="data-panel-line"><textarea v-model="props.form.note"></textarea></span>
        <span v-else>{{ scheda.note }}</span>
    </div>
</template>
<style scoped></style>
