<script setup lang="ts">
import { createAvatar, type Result } from '@dicebear/core';
import * as identicon from '@dicebear/identicon';
import { ref, watch } from 'vue';

interface Props {
  uuid: string,
  format?: string;
}
const props = defineProps<Props>();

const svg = ref(makeIdenticon(props.uuid));
const base64 = ref(window.btoa(
  new TextEncoder().encode(makeAvatar(props.uuid).toString()).reduce((data, byte) => data + String.fromCharCode(byte), '')
));

function makeAvatar(uuid: string): Result {
  const avatar = createAvatar(identicon, {
    seed: props.uuid,
    // ... other options
  });
  return avatar;
  //return `data:image/svg+xml;utf8,${encodeURIComponent(avatar.toDataUri.toString())}`;
}

function makeIdenticon(uuid: string): string {
  const avatar = createAvatar(identicon, {
    seed: props.uuid,
    // ... other options
  });
  return avatar.toDataUri();
  //return `data:image/svg+xml;utf8,${encodeURIComponent(avatar.toDataUri.toString())}`;
}
watch(() => props.uuid, (newuuid) => svg.value = makeIdenticon(newuuid));

</script>

<template>
  <span :html="svg"></span>
  <image v-if="format == 'svg'" x="0" y="0" width="100" height="100" class="identicon" :src="`data:image/svg+xml;base64,${base64}`" />
  <img v-else class="identicon" :src="svg" />
</template>

<style scoped>
.imagethumb {
    max-width:100%;
}
</style>