<script setup lang="ts">
import type { PostoObj } from '@/models/browse-item';
import PostoShort from './PostoShort.vue';
import CardFormat from './CardFormat.vue';

interface Props {
  posti: PostoObj[],
}
const props = defineProps<Props>()

</script>
<template>
  <div class="breadcrumbs">
    <span v-for="(posto, index) in props.posti" class="postoshort">
      <span v-if="index > 0" class="separator"><slot>/</slot></span>
      <span class="breadcrumb">
        <PostoShort :posto="posto"></PostoShort>
      </span>
    </span>
  </div>
</template>
<style scoped>
.breadcrumb {
  border: 1px solid gray;
  padding: 6px;
  border-radius: 4px;
}
.postoshort {
  padding: 2px;
}
</style>
