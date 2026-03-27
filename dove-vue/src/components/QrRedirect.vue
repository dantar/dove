<script setup lang="ts">
import { useBrowseData } from '@/stores/browse-data';
import { onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router'

interface Props {
  uuid: string,
}
const props = defineProps<Props>();
const browse = useBrowseData();
const router = useRouter();

const loading = ref(true);

watch(() => props.uuid, loadAny);

async function loadAny(uuid: string) {
    const dto = await browse.getAnyObj(uuid);
    if (dto.tipo) {
        if (dto.oggetto) {
            router.replace(`/oggetto/${uuid}`);
        } else {
            router.replace(`/posto/${uuid}`);
        }
    } 
    loading.value=false;
}

onMounted(() => loadAny(props.uuid));

</script>

<template>
    <div class="notice pagesection">
        <span v-if="loading">Caricamento {{ uuid }} ...</span>
        <span v-else>Il codice {{ uuid }} non esiste.</span>
    </div>
</template>
<style lang="css" scoped>
.notice {
    display: flex;
    width: 100%;
    min-height: 100vh;
    justify-content: center;
    align-items: center;
    text-align: center;
}
</style>