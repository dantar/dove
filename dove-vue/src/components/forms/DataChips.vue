<script setup lang="ts">
import { ref } from 'vue';

interface Props {
  options: string[],
  chips: string[],
  form: string[],
  editable: boolean,
  saving: boolean,
}
const props = defineProps<Props>();

function toggleOption(option: string) {
    if (props.form.includes(option)) {
        props.form.splice(props.form.indexOf(option), 1);
    } else {
        props.form.push(option);
    }
}

</script>
<template>
    <span v-if="editable" class="arrayitems">
        <span v-for="option in options" 
            :class="`data-chip-item chip-active-${form.includes(option)} chip-disabled-${saving}`"
            @click="toggleOption(option)"> {{ option }} </span>
    </span>
    <span v-else class="arrayitems">
        <span v-for="option in options.filter(o => chips.includes(o))" class="chip-active-true"> {{ option }} </span>
        <span v-if="chips.length == 0">&nbsp;</span>
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