<script setup lang="ts">
import { useBrowseData } from '@/stores/browse-data';
import OggettoHeader from './OggettoHeader.vue';
import { ref, watch } from 'vue';
import type { OggettoBrowseDto, OggettoObj } from '@/models/browse-item';
import AddPhotosButton from './AddPhotosButton.vue';
import PostoBreadcrumbs from './PostoBreadcrumbs.vue';
import SchedaOggettoView from './SchedaOggettoView.vue';
import ItemsGallery from './ItemsGallery.vue';
import ImageThumb from './ImageThumb.vue';

interface Props {
  uuid: string,
}
const props = defineProps<Props>();

const browse = useBrowseData();

const browsed = ref<OggettoBrowseDto>();
const editable = ref(false);
const freeze = ref(false);

async function loadOggetto(uuid: string) {
    freeze.value = true;
    const bo = await browse.browseOggettoDetails(uuid);
    browsed.value = bo;
    form.value = {...bo.oggetto};
    (form.value as OggettoObj).scheda = {...bo.oggetto.scheda};
    freeze.value = false;
}
loadOggetto(props.uuid)

watch(() => props.uuid, loadOggetto);


const saveData = async () => {
  freeze.value = true;
  const browse = useBrowseData();
  const updated = await browse.updateOggetto(form.value as OggettoObj);
  if (browsed.value) {
      browsed.value.oggetto.nome = updated.nome;
      browsed.value.oggetto.scheda = updated.scheda;
  }
  freeze.value = false;
  editable.value = false;
}

const form = ref<OggettoObj>();

async function refreshThumbnail() {
    if (browsed.value && browsed.value.oggetto.immagini) {
        browsed.value.oggetto.thumbnail = browsed.value.oggetto.immagini[0] as string;
    }
}

</script>

<template>
    <div v-if="browsed">
        <PostoBreadcrumbs :posti="browsed.breadcrumbs.concat(browsed.posto)"></PostoBreadcrumbs>
        <div>
            <form @submit.prevent="saveData()">
                <OggettoHeader 
                    :oggetto="browsed.oggetto"
                    :form="(form as OggettoObj)"
                    :editable="editable"
                    :saving="freeze"
                    ></OggettoHeader>
                <SchedaOggettoView v-if="form?.scheda"
                    :scheda="browsed.oggetto.scheda"
                    :form="form?.scheda"
                    :editable="editable"
                    :saving="freeze"
                    ></SchedaOggettoView>
                <button @click="editable = !editable" type="button" :disabled="freeze">🖉</button>
                <button v-if="editable" type="submit" :disabled="freeze">✓</button>
            </form>
        </div>
        <div>Galleria</div>
        <ItemsGallery :items="browsed.oggetto.immagini">
            <template #item="{ item }">
                <ImageThumb :uuid="`${uuid}`" :image="`${item}`"></ImageThumb>
            </template>
        </ItemsGallery>
        <AddPhotosButton @upload="refreshThumbnail()" :uuid="browsed.oggetto.id" :gallery="browsed.oggetto.immagini"></AddPhotosButton>
    </div>
    <div v-else="">Loading...</div>
</template>

<style scoped></style>
