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
import Heroicon from './Heroicon.vue';
import QrLauncher from './QrLauncher.vue';
import CardFormat from './CardFormat.vue';

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
    form.value = JSON.parse(JSON.stringify(o));
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

async function spostaOggettoIn(code: string) {
    freeze.value = true;
    const destination = await browse.getAnyObj(code);
    if (destination.posto && !destination.oggetto) {
        const o = (form.value as OggettoObj);
        o.idPosto = destination.id;
        await saveData();
    } else {
        freeze.value = false;
    }
}

</script>

<template>
    <div v-if="browsed">
        <div class="pagesection pagesection-with-buttons">
            <PostoBreadcrumbs :posti="browsed.breadcrumbs.concat(browsed.posto)"></PostoBreadcrumbs>
            <div class="overbuttons overbuttons--up" v-if="editable">
                <span>
                    <QrLauncher @decoded="(code) => spostaOggettoIn(code)"></QrLauncher>
                </span>
            </div>
        </div>
        <div class="pagesection pagesection-with-buttons">
            <form @submit.prevent="saveData()">
            <CardFormat class="oggetto-details">
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
                    :repo="browsed.repo"
                    ></SchedaOggettoView>
            </CardFormat>
            <div class="overbuttons overbuttons--up">
                <span>
                    <button v-if="editable" type="submit" :disabled="freeze"><Heroicon icon="check"/></button>
                    <button @click="editable = !editable" type="button" :disabled="freeze"><Heroicon icon="pencil"/></button>
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
                                <Heroicon icon="trash" />
                                <Heroicon icon="checked" v-if="trash.includes(item)" />
                                <Heroicon icon="unchecked" v-else></Heroicon>
                            </button>
                            <button v-if="editable && !trash.includes(item)" @click="selectThumbnail(item)">
                                <Heroicon icon="photo" />
                                <Heroicon icon="checked" v-if="form?.thumbnail == item" />
                                <Heroicon icon="unchecked" v-else></Heroicon>
                            </button>
                        </span>
                    </div>
                </template>
                <template #empty>Questo oggetto non ha foto.</template>
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
.oggetto-details {
    padding: 5px;
    margin: 5px;
}
.imagethumb {
    max-width:100px;
}

</style>
