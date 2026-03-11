<script setup lang="ts">
import type { PostoObj } from '@/models/browse-item';
interface Props {
  posto: PostoObj
}
const props = defineProps<Props>()
</script>
<template><span>{{ posto?.nome || posto?.id }}</span></template>
<style scoped></style>
