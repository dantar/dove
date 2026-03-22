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
import HeroiconTrash from '@/heroicons/HeroiconTrash.vue';
import HeroiconPencil from '@/heroicons/HeroiconPencil.vue';
import HeroiconCircle from '@/heroicons/HeroiconCircle.vue';
import HeroiconCheckCircle from '@/heroicons/HeroiconCheckCircle.vue';
import HeroiconPhoto from '@/heroicons/HeroiconPhoto.vue';
import HeroiconCheck from '@/heroicons/HeroiconCheck.vue';

interface Props {
  uuid: string,
}
const props = defineProps<Props>();

const browse = useBrowseData();

const browsed = ref<OggettoBrowseDto>();
const editable = ref(false);
const freeze = ref(false);
const trash = ref<string[]>([]);

async function loadOggetto(uuid: string) {
    freeze.value = true;
    const bo = await browse.browseOggettoDetails(uuid);
    setOggetto(bo.oggetto);
    browsed.value = bo;
    freeze.value = false;
}
loadOggetto(props.uuid)

watch(() => props.uuid, loadOggetto);

function setOggetto(o: OggettoObj) {
    form.value = {...o};
    (form.value as OggettoObj).scheda = {...o.scheda};
    trash.value = [];
}

const saveData = async () => {
  freeze.value = true;
  const browse = useBrowseData();
  const updated = await browse.updateOggetto(form.value as OggettoObj);
  for (let index = 0; index < trash.value.length; index++) {
    const image = trash.value[index] as string;
    await browse.deletePicture(updated.id, image);
  }
  await loadOggetto(updated.id);
  freeze.value = false;
  editable.value = false;
}

const form = ref<OggettoObj>();

async function refreshThumbnail() {
    if (browsed.value && browsed.value.oggetto.immagini) {
        browsed.value.oggetto.thumbnail = browsed.value.oggetto.immagini[0] as string;
    }
}

function selectThumbnail(image:string) {
    if (form.value) {
        form.value.thumbnail = (form.value.thumbnail == image? '': image);
    }
}

function deleteThumbnail(image:string) {
    if (form.value && form.value.thumbnail == image) {
        form.value.thumbnail = '';
    }
    if (trash.value.includes(image)) {
        trash.value.splice(trash.value.indexOf(image), 1);
    } else {
        trash.value.push(image);
    }
}

</script>

<template>
    <div v-if="browsed">
        <div class="pagesection">
            <PostoBreadcrumbs :posti="browsed.breadcrumbs.concat(browsed.posto)"></PostoBreadcrumbs>
        </div>
        <div class="pagesection pagesection-with-buttons">
            <form @submit.prevent="saveData()">
            <div>
                <OggettoHeader 
                    :oggetto="editable ? form || browsed.oggetto : browsed.oggetto"
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
            </div>
            <div class="overbuttons overbuttons--up">
                <span>
                    <button v-if="editable" type="submit" :disabled="freeze"><HeroiconCheck/></button>
                    <button @click="editable = !editable" type="button" :disabled="freeze"><HeroiconPencil></HeroiconPencil></button>
                </span>
            </div>
            </form>
        </div>
        <div class="pagesection pagesection-with-buttons">
            <ItemsGallery :items="browsed.oggetto.immagini">
                <template #item="{ item }">
                    <div style="position: relative;">
                        <ImageThumb :uuid="`${uuid}`" :image="`${item}`"></ImageThumb>
                        <span class="overbuttons overbuttons--up">
                            <button v-if="editable" @click="deleteThumbnail(item)">
                                <HeroiconTrash></HeroiconTrash>
                                <HeroiconCheckCircle v-if="trash.includes(item)"></HeroiconCheckCircle>
                                <HeroiconCircle v-else></HeroiconCircle>
                            </button>
                            <button v-if="editable && !trash.includes(item)" @click="selectThumbnail(item)">
                                <HeroiconPhoto></HeroiconPhoto>
                                <HeroiconCheckCircle v-if="form?.thumbnail == item"></HeroiconCheckCircle>
                                <HeroiconCircle v-else></HeroiconCircle>
                            </button>
                        </span>
                    </div>
                </template>
            </ItemsGallery>
            <div class="overbuttons overbuttons--up">
                <AddPhotosButton @upload="refreshThumbnail()" :uuid="browsed.oggetto.id" :gallery="browsed.oggetto.immagini"></AddPhotosButton>
            </div>
        </div>
    </div>
    <div v-else="">Loading...</div>
</template>

<style scoped>
.card-title {
    font-size: 1.4rem;
}
</style>
