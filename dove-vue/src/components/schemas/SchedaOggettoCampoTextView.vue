<script setup lang="ts">
import type { SchedaBySchema } from '@/models/browse-item';
import { type SchedaOggettoCampoViewProps, type SchedaOggettoCampoText } from '@/stores/schede-by-schema';

const props = defineProps<SchedaOggettoCampoViewProps>()

function getValue( data: SchedaBySchema, campo: SchedaOggettoCampoText ): string {
    return data.values[campo.id] as string;
}

</script>
<template>
    <div :class="{'empty': !editable && !form.values[campo.id]}">
        <textarea v-if="editable" :disabled="saving" v-model.trim="form.values[campo.id]"></textarea>
        <div v-else>{{ getValue(scheda, campo as SchedaOggettoCampoText) || '' }}</div>
    </div>
</template>
<style lang="css" scoped></style>