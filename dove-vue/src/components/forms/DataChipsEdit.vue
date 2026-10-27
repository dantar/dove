<script setup lang="ts">
import { computed } from 'vue';
import { toDataChipDefinition, type DataChipOption } from '@/models/data-chip';

interface Props {
  options: DataChipOption[],
  form: string[],
  disabled?: boolean,
}
const props = withDefaults(defineProps<Props>(), {
  disabled: false,
});

const definitions = computed(() => props.options.map(toDataChipDefinition));

function toggleOption(option: string) {
    if (props.disabled) return;
    if (props.form.includes(option)) {
        props.form.splice(props.form.indexOf(option), 1);
    } else {
        props.form.push(option);
    }
}

</script>
<template>
    <span class="arrayitems">
        <span v-for="def in definitions" :key="def.id"
            :class="`data-chip-item chip-active-${form.includes(def.id)} chip-disabled-${disabled}`"
            @click="toggleOption(def.id)"> {{ def.label }} </span>
    </span>
</template>

<style scoped>
.data-chip-item {
    margin: 1px;
    padding: 1px 3px;
}
.chip-disabled-true {
    opacity: 0.5;
}
.chip-active-false {
    color: gray;
    font-size: 0.9rem;
}
.data-chip-item.chip-active-true {
    font-weight: bold;
}

</style>
