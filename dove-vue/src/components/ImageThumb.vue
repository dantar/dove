<script setup lang="ts">
import { useBackendConfig } from '@/stores/backend-config';
import { createAvatar } from '@dicebear/core';
import * as identicon from '@dicebear/identicon';
import { ref } from 'vue';

interface Props {
  uuid: string,
  image: string,
}
const props = defineProps<Props>()
const config = useBackendConfig();

const avatar = createAvatar(identicon, {
  seed: props.uuid,
  // ... other options
});
const svg = ref(`data:image/svg+xml;utf8,${encodeURIComponent(avatar.toString())}`);

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