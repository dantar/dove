<script setup lang="ts">
import { useBackendConfig } from '@/stores/backend-config';
import DicebearIdenticon from './DicebearIdenticon.vue';

interface Props {
  uuid: string,
  image: string,
}
const props = defineProps<Props>()
const config = useBackendConfig();
</script>

<template>
  <img v-if="props.uuid && props.image" :src="`${config.images}/${props.uuid}/${props.image}`" class="imagethumb"></img>
  <DicebearIdenticon :uuid="props.uuid"></DicebearIdenticon>
</template>

<style scoped>
.imagethumb {
    max-width:100%;
}
</style>