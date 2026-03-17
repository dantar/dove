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
    <span v-if="editable">
        <span v-for="option in options" 
            :class="`chip-active-${data.includes(option)} chip-disabled-${saving}`"
            @click="toggleOption(option)"> {{ option }} </span>
    </span>
    <span v-else>
        <span v-for="option in options.filter(o => chips.includes(o))" class="chip-active-true"> {{ option }} </span>
    </span>
</template>

<style scoped>
.chip-disabled-true {
    opacity: 0.5;
}
.chip-active-true {
    border: 1px solid black;
}
</style>