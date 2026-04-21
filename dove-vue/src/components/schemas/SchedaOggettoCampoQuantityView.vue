<script setup lang="ts">
import type { SchedaBySchema } from '@/models/browse-item';
import { type SchedaOggettoCampoViewProps, type SchedaOggettoCampoQuantity } from '@/stores/schede-by-schema';

const props = defineProps<SchedaOggettoCampoViewProps>()

function getValue( data: SchedaBySchema, campo: SchedaOggettoCampoQuantity ): string {
    return data.values[campo.id] as string;
}

</script>
<template>
    <div :class="{'empty': !editable && !form.values[campo.id]}">
        <input v-if="editable" :disabled="saving" type="number" v-model.trim="form.values[campo.id]" />
        <span v-else>{{ getValue(scheda, campo as SchedaOggettoCampoQuantity) || '' }}</span>
        <span class="unit">{{ (campo as SchedaOggettoCampoQuantity).unit || '' }}</span>
    </div>
</template>
<style lang="css" scoped>

input {
    width: 2rem;
}

.unit {
    margin-left: 3px;
    color: gray;
    font-size: 0.8rem;
}

</style>