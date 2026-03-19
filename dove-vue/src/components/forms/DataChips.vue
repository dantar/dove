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
    if (data.value.includes(option)) {
        data.value.splice(data.value.indexOf(option), 1);
    } else {
        data.value.push(option);
    }
}

const data = ref(props.form);

</script>
<template>
    <span v-if="editable" class="arrayitems">
        <span v-for="option in options" 
            :class="`data-chip-item chip-active-${data.includes(option)} chip-disabled-${saving}`"
            @click="toggleOption(option)"> {{ option }} </span>
    </span>
    <span v-else class="arrayitems">
        <span v-for="option in options.filter(o => chips.includes(o))" class="chip-active-true"> {{ option }} </span>
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
.chip-active-true {
    padding: 0px 2px;
    border: 1px solid black;
}
</style>