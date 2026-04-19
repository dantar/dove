<script setup lang="ts">
import type { SchedaBySchema } from '@/models/browse-item';
import { SchedaOggettoCampoChipsHandler, type SchedaOggettoCampoChips, type SchedaOggettoCampoSearchProps, type SearchOggettoBySchemaCampoChips } from '@/stores/schede-by-schema';
import DataChips from '../forms/DataChips.vue';
import { ref } from 'vue';

const props = defineProps<SchedaOggettoCampoSearchProps>()

const criteria = ref(
    SchedaOggettoCampoChipsHandler.initSearch(props.campo as SchedaOggettoCampoChips)
);

</script>
<template>
  <div v-if="campo.tipo == 'chips'">
    <DataChips
      :editable="true"
      :saving="false"
      :chips="criteria.options"
      :form="criteria.options"
      :options="campo.opzioni"
    ></DataChips>
    <slot name="default" :data="criteria" :empty="criteria.options.length == 0"></slot>
  </div>
</template>
<style lang="css" scoped></style>