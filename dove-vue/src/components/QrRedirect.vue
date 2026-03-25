<script setup lang="ts">
import { useBrowseData } from '@/stores/browse-data';
import { onMounted, watch } from 'vue';
import { useRouter } from 'vue-router'

interface Props {
  uuid: string,
}
const props = defineProps<Props>();
const browse = useBrowseData();
const router = useRouter();

watch(() => props.uuid, loadAny);

async function loadAny(uuid: string) {
    const dto = await browse.getAnyObj(uuid);
    if (dto.oggetto) {
        router.replace(`/oggetto/${uuid}`);
    } else {
        router.replace(`/posto/${uuid}`);
    }
}

onMounted(() => loadAny(props.uuid));

</script>

<template>
  <div>Caricamento {{ uuid }} ...</div>
</template>