<script setup lang="ts">

import { ref } from 'vue';

interface Props {
  items: any[],
}
const props = defineProps<Props>()

const mode = ref('double');
</script>
<template>
  <div v-if="items && items.length > 0" >
    <div>
      <button type="button" @click="mode = 'single'">x1</button>
      <button type="button" @click="mode = 'double'">x2</button>
      <button type="button" @click="mode = 'triple'">x3</button>
      <button type="button" @click="mode = 'quadruple'">x4</button>
    </div>
    <div class="gallery-box" :class="`stacking-${mode}`" >
      <span v-for="item in items"><slot name="item" :item="item"></slot></span>
    </div>
  </div>
  <span v-else><slot name="empty">Nessun contenuto.</slot></span>
</template>
<style scoped>

.gallery-box {
  display: grid;
  gap: 6px;
  grid-template-columns: repeat(var(--cols), 1fr);
}

.stacking-single { --cols: 1; }
.stacking-double { --cols: 2; }
.stacking-triple { --cols: 3; }
.stacking-quadruple { --cols: 4; }

</style>
