<script setup lang="ts">
import type { SchedaBySchema } from '@/models/browse-item';
import { type SchedaOggettoCampoText } from '@/stores/schede-by-schema';

interface Props {
  scheda: SchedaBySchema,
  editable: boolean,
  saving: boolean,
  form: SchedaBySchema,
  campo: SchedaOggettoCampoText,
}
const props = defineProps<Props>()

function getValue( data: SchedaBySchema, campo: SchedaOggettoCampoText ): string {
    return data.values[campo.id] as string;
}

</script>
<template>
    <div class="data-panel">
        <textarea v-if="editable" :disabled="saving" v-model.trim="form.values[campo.id]"></textarea>
        <div v-else>{{ getValue(scheda, campo) || '' }}</div>
    </div>
</template>
<style lang="css" scoped></style>