<script setup lang="ts">
import { useBackendConfig } from '@/stores/backend-config';
interface Props {
  uuid: string,
  image: string,
}
const props = defineProps<Props>()
const config = useBackendConfig();
</script>

<template>
    <img v-if="props.uuid && props.image" :src="`${config.images}/${props.uuid}/${props.image}`" class="imagethumb"></img>
</template>

<style scoped>
.imagethumb {
    max-width:180px;
}
</style>