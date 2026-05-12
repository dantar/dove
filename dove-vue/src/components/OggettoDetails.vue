<script setup lang="ts">
import { useBrowseData } from '@/stores/browse-data';
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
import OggettoShort from './OggettoShort.vue';
import PopupDialog from './PopupDialog.vue';
import SlidingDrawer from './SlidingDrawer.vue';
import { useRouter } from 'vue-router';

interface Props {
  uuid: string,
}
const props = defineProps<Props>();

const browse = useBrowseData();
const router = useRouter();

const selectedImage = ref('');

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
    if (browsed.value && !browsed.value.oggetto.thumbnail && browsed.value.oggetto.immagini) {
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

function clickImage(id: string) {
    if (selectedImage.value == id) {
        selectedImage.value = '';
    } else {
        selectedImage.value = id;
    }
}

async function deleteOggetto() {
    freeze.value = true;
    if (browsed.value) {
        const deleted = await browse.deleteOggetto(browsed.value.oggetto.id);
        router.replace(`/posto/${browsed.value.posto.id}`);
    }
    freeze.value = false;
}

</script>

<template>
    <div v-if="browsed">
        <SlidingDrawer>
            <template #title>Posizione</template>
            <QrLauncher @decoded-one="(code) => spostaOggettoIn(code)">
                <Heroicon icon="qr-code"></Heroicon> Sposta
            </QrLauncher>
            <template #content>
                <div>
                    <PostoBreadcrumbs :posti="browsed.breadcrumbs.concat(browsed.posto)"></PostoBreadcrumbs>
                </div>
            </template>
        </SlidingDrawer>
        <SlidingDrawer>
            <template #title>Oggetto</template>
            <button @click="editable = !editable" type="button" :disabled="freeze">
                <Heroicon icon="pencil"/> Modifica
            </button>
            <button type="button" :disabled="freeze" @click="deleteOggetto()">
                <Heroicon icon="trash"></Heroicon> Elimina
            </button>
            <template #content>
                <div>
                    <form @submit.prevent="saveData()">
                    <CardFormat class="oggetto-details">
                        <template #header>
                            <div class="card-header">
                                <OggettoShort :oggetto="browsed.oggetto"></OggettoShort>
                                <div class="notimportant">ID: {{ browsed.oggetto.id }}</div>
                                <span v-if="editable">
                                    <input type="text" :placeholder="`Oggetto ${browsed.oggetto.id.split('-')[0]}`" v-model="(form as OggettoObj).nome" :disabled="freeze"/>
                                </span>
                            </div>
                        </template>
                        <template #image>
                        </template>
                        <div class="oggetto-img">
                            <ImageThumb class="mainthumb" :uuid="browsed.oggetto.id" :image="browsed.oggetto.thumbnail"></ImageThumb>
                        </div>
                        <SchedaOggettoView v-if="form?.scheda"
                            :scheda="browsed.oggetto.scheda"
                            :form="form?.scheda"
                            :editable="editable"
                            :saving="freeze"
                            :repo="browsed.repo"
                            ></SchedaOggettoView>
                        <div>
                            <button v-if="editable" @click="editable = false" type="button" :disabled="freeze"><Heroicon icon="cancel"/> </button>
                            <button v-if="editable" type="submit" :disabled="freeze"><Heroicon icon="check"/> Salva </button>
                        </div>
                    </CardFormat>
                    </form>
                </div>
            </template>
        </SlidingDrawer>
        <SlidingDrawer>
            <template #title>Galleria</template>
            <AddPhotosButton @upload="refreshThumbnail()" :uuid="browsed.oggetto.id" :gallery="browsed.oggetto.immagini"></AddPhotosButton>
            <template #content>
                <div>
                    <ItemsGallery :items="browsed.oggetto.immagini" :class="{expanded: editable}">
                        <template #item="{ item }">
                            <div style="position: relative;" v-if="editable || item != browsed.oggetto.thumbnail">
                                <ImageThumb @click="clickImage(item)" :uuid="`${uuid}`" :image="`${item}`" :class="{tobedeleted: trash.includes(item), expanded: selectedImage == item}"></ImageThumb>
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
                </div>
            </template>
        </SlidingDrawer>
        <PopupDialog @click="selectedImage = ''" v-if="selectedImage != ''">
            <ImageThumb :uuid="`${uuid}`" :image="`${selectedImage}`"" style="width: 100%;"></ImageThumb>
        </PopupDialog>
    </div>
    <div v-else="">Loading...</div>
</template>

<style scoped>

.imagefullview {
    
}

.oggetto-img {
    text-align: center;
}
.slot-grid {
    background-color: green;
}
.card-header {
    margin: 5px;
    display: flex;
    flex-direction: column;
    text-align: center;
}
    
.card-title {
    font-size: 1.4rem;
}
.oggetto-details {
    padding: 5px;
    margin: 5px;
}
.expanded .imagethumb {
    width:200px;
}
.imagethumb {
    width:100px;
}
.mainthumb {
    width: 100%;
}
.tobedeleted {
    opacity: 0.5;
}

</style>
