<script setup lang="ts">
import type { SchedaBySchema } from '@/models/browse-item';
import { type SchedaOggettoCampoChips, type SchedaOggettoCampoViewProps } from '@/stores/schede-by-schema';
import DataChipsEdit from '../forms/DataChipsEdit.vue';
import DataChipsShow from '../forms/DataChipsShow.vue';

const props = defineProps<SchedaOggettoCampoViewProps>()

function getValue( data: SchedaBySchema, campo: SchedaOggettoCampoChips ): string[] {
    return data.values[campo.id] as string[];
}

</script>
<template>
  <div v-if="campo.tipo == 'chips'" :class="{'empty': !editable && getValue(scheda, campo).length == 0}">
    <DataChipsEdit v-if="editable"
      :disabled="saving"
      :form="getValue(form, campo) || []"
      :options="campo.opzioni"
    ></DataChipsEdit>
    <DataChipsShow v-else
      :chips="getValue(scheda, campo) || []"
      :options="campo.opzioni"
    ></DataChipsShow>
  </div>

</template>
<style lang="css" scoped></style>