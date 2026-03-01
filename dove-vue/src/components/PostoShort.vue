<script setup lang="ts">
import { PostoObj } from '@/models/browse-item';
const props = defineProps({
  posto: PostoObj
})
</script>

<template>
  <div>{{ posto?.nome || posto?.id }}</div>
</template>

<style scoped></style>
