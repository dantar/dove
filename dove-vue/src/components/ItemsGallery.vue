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
    <div class="gallery-box" :class="`stacking-${mode}`" >
      <span v-for="item in items" class="gallery-item"><slot name="item" :item="item"></slot></span>
    </div>
  </div>
  <span v-else><slot name="empty">Nessun contenuto.</slot></span>
</template>
<style scoped>

.gallery-box {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  justify-content: center;
}

.gallery-item {
  width: 200px;
}

</style>
