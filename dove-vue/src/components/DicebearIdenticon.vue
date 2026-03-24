<script setup lang="ts">
import { makeIdenticon } from '@/services/dicebear-identicon';
import { ref, watch } from 'vue';

interface Props {
  uuid: string,
}
const props = defineProps<Props>();

const svg = ref(makeIdenticon(props.uuid).toDataUri());

watch(() => props.uuid, (newuuid) => svg.value = makeIdenticon(newuuid).toDataUri());

</script>

<template>
  <img class="identicon" :src="svg" />
</template>

<style scoped>
.imagethumb {
    max-width:100%;
}
</style>