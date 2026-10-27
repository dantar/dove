<script setup lang="ts">
import { computed } from 'vue';
import { toDataChipDefinition, type DataChipOption } from '@/models/data-chip';

interface Props {
  options: DataChipOption[],
  chips: string[],
}
const props = defineProps<Props>();

const definitions = computed(() => props.options.map(toDataChipDefinition));

</script>
<template>
    <span class="arrayitems">
        <span v-for="def in definitions.filter(d => chips.includes(d.id))" :key="def.id" class="chip-active-true"> {{ def.label }} </span>
        <span v-if="chips.length == 0">&nbsp;</span>
    </span>
</template>
