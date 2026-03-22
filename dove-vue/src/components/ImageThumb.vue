<script setup lang="ts">
import { useBackendConfig } from '@/stores/backend-config';
import { createAvatar } from '@dicebear/core';
import * as identicon from '@dicebear/identicon';
import { ref, watch } from 'vue';

interface Props {
  uuid: string,
  image: string,
}
const props = defineProps<Props>()
const config = useBackendConfig();

const svg = ref(makeIdenticon(props.uuid));

function makeIdenticon(uuid: string): string {
  const avatar = createAvatar(identicon, {
    seed: props.uuid,
    // ... other options
  });
  return `data:image/svg+xml;utf8,${encodeURIComponent(avatar.toString())}`;
}
watch(() => props.uuid, (newuuid) => svg.value = makeIdenticon(newuuid));

</script>

<template>
  <img v-if="props.uuid && props.image" :src="`${config.images}/${props.uuid}/${props.image}`" class="imagethumb"></img>
  <img v-else class="avatar" :src="svg">
</template>

<style scoped>
.imagethumb {
    max-width:100%;
}
</style>