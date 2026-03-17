<script setup lang="ts">
import { useBrowseData } from '@/stores/browse-data';
import { useRoute } from 'vue-router';
import OggettoHeader from './OggettoHeader.vue';
import PhotoGallery from './PhotoGallery.vue';
import { ref, watch } from 'vue';
import type { OggettoBrowseDto, OggettoObj } from '@/models/browse-item';
import AddPhotosButton from './AddPhotosButton.vue';
import PostoBreadcrumbs from './PostoBreadcrumbs.vue';
import PostoHeader from './PostoHeader.vue';
import SchedaAccessorioView from './SchedaAccessorioView.vue';
import SchedaOggettoView from './SchedaOggettoView.vue';

interface Props {
  uuid: string,
}
const props = defineProps<Props>();

const route = useRoute();
const browse = useBrowseData();

const browsed = ref<OggettoBrowseDto>();

async function loadOggetto(uuid?: string) {
  if (uuid) {
    const bo = await browse.browseOggettoDetails(uuid);
    browsed.value = bo;
    form.value = {...bo.oggetto};
    (form.value as OggettoObj).scheda = {...bo.oggetto.scheda};
  }
}
loadOggetto(props.uuid)

watch(() => props.uuid, loadOggetto);


const editable = ref(false);
const saving = ref(false);

const saveData = async () => {
  saving.value = true;
  const browse = useBrowseData();
  const updated = await browse.updateOggetto(form.value as OggettoObj);
  if (browsed.value) {
      browsed.value.oggetto.nome = updated.nome;
      browsed.value.oggetto.scheda = updated.scheda;
  }
  saving.value = false;
  editable.value = false;
}

const form = ref<OggettoObj>();

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
                    :saving="saving"
                    ></OggettoHeader>
                <SchedaOggettoView v-if="form?.scheda"
                    :scheda="browsed.oggetto.scheda"
                    :form="form?.scheda"
                    :editable="editable"
                    :saving="saving"
                    ></SchedaOggettoView>
                <button @click="editable = !editable" type="button" :disabled="saving">🖉</button>
                <button v-if="editable" type="submit" :disabled="saving">✓</button>
            </form>
        </div>
        <div>Galleria</div>
        <PhotoGallery :id="browsed.oggetto.id" :images="browsed.oggetto.immagini"></PhotoGallery>
        <AddPhotosButton :uuid="browsed.oggetto.id" :gallery="browsed.oggetto.immagini"></AddPhotosButton>
    </div>
    <div v-else="">Loading...</div>
</template>

<style scoped></style>
