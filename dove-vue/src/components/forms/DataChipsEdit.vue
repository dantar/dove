<script setup lang="ts">
import { computed } from 'vue';
import { descendantIds, toDataChipDefinition, type DataChipDefinition, type DataChipOption } from '@/models/data-chip';

interface Props {
  options: DataChipOption[],
  form: string[],
  disabled?: boolean,
}
const props = withDefaults(defineProps<Props>(), {
  disabled: false,
});

const definitions = computed(() => props.options.map(toDataChipDefinition));

function toggleOption(def: DataChipDefinition) {
    if (props.disabled) return;
    if (props.form.includes(def.id)) {
        for (const id of [def.id, ...descendantIds(def)]) {
            const index = props.form.indexOf(id);
            if (index >= 0) props.form.splice(index, 1);
        }
    } else {
        props.form.push(def.id);
    }
}

</script>
<template>
    <ul class="data-chip-tree">
        <li v-for="def in definitions" :key="def.id">
            <span :class="`data-chip-item chip-active-${form.includes(def.id)} chip-disabled-${disabled}`"
                @click="toggleOption(def)">
                <span class="data-chip-marker">{{ def.chips?.length ? (form.includes(def.id) ? '▾' : '▸') : '' }}</span>
                {{ def.label }}
            </span>
            <DataChipsEdit v-if="def.chips?.length && form.includes(def.id)"
                :options="def.chips" :form="form" :disabled="disabled" />
        </li>
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
.data-chip-item {
    margin: 1px;
    padding: 1px 3px;
    cursor: pointer;
}
.data-chip-marker {
    display: inline-block;
    width: 1em;
    color: gray;
}
.chip-disabled-true {
    opacity: 0.5;
    cursor: default;
}
.chip-active-false {
    color: gray;
    font-size: 0.9rem;
}
.data-chip-item.chip-active-true {
    font-weight: bold;
}

</style>
