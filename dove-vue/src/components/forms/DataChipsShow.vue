<script setup lang="ts">
import { computed } from 'vue';
import { toDataChipDefinition, type DataChipDefinition, type DataChipOption } from '@/models/data-chip';

interface Props {
  options: DataChipOption[],
  chips: string[],
}
const props = defineProps<Props>();

const definitions = computed(() => props.options.map(toDataChipDefinition));

function hasSelectedChildren(def: DataChipDefinition): boolean {
    return (def.chips ?? []).some(child => props.chips.includes(toDataChipDefinition(child).id));
}

</script>
<template>
    <ul class="data-chip-tree">
        <li v-for="def in definitions.filter(d => chips.includes(d.id))" :key="def.id">
            <span class="chip-active-true">{{ def.label }}</span>
            <DataChipsShow v-if="hasSelectedChildren(def)" :options="def.chips!" :chips="chips" />
        </li>
        <li v-if="chips.length == 0">&nbsp;</li>
    </ul>
</template>

<style scoped>
.data-chip-tree {
    list-style: none;
    margin: 0;
    padding: 0;
}
.data-chip-tree .data-chip-tree {
    padding-left: 1.2rem;
}

</style>
