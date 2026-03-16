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
    Accessorio
    <div>
        Condizioni: 
        <span v-if="editable"><input type="number" v-model="props.form.condizioni"></span>
        <span v-else>{{ scheda.condizioni }}</span>
    </div>
    <div>
        Descrizione: 
        <span v-if="editable"><textarea v-model="props.form.descrizione"></textarea></span>
        <span v-else>{{ scheda.descrizione }}</span>
    </div>
    <div>
        Note: 
        <span v-if="editable"><textarea v-model="props.form.note"></textarea></span>
        <span v-else>{{ scheda.note }}</span>
    </div>
</template>
<style scoped></style>
