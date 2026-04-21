<script setup lang="ts">
import { SchedaOggettoCampoTextHandler, type SchedaOggettoCampoSearchProps, type SchedaOggettoCampoText, type SearchOggettoBySchemaCampoText } from '@/stores/schede-by-schema';
import { ref } from 'vue';

const props = defineProps<SchedaOggettoCampoSearchProps>()

const criteria = ref(
    SchedaOggettoCampoTextHandler.initSearch(props.campo as SchedaOggettoCampoText)
);

</script>
<template>
    <div v-if="criteria">
        <input type="text" v-model.trim="criteria.text" /> 
        <input type="checkbox" v-model.trim="criteria.case" /> 
        <slot name="default" :data="criteria" :empty="criteria.text.length == 0"></slot>
    </div>
</template>
<style lang="css" scoped></style>