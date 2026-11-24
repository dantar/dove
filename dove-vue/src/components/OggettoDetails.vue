<script setup lang="ts">
import { useBrowseData } from '@/stores/browse-data';
import { ref, watch } from 'vue';
import { oggettoName, SchedaBySchema, SchedaOggetto, type OggettoBrowseDto, type OggettoObj } from '@/models/browse-item';
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
import { UndoableAction, useUndoableActions } from '@/stores/undoable-actions';
import type { TipoSchedaOggetto } from '@/stores/schede-by-schema';
import SchedaBySchemaView from './SchedaBySchemaView.vue';

interface Props {
  uuid: string,
}
const props = defineProps<Props>();

const browse = useBrowseData();
const router = useRouter();

const selectedImage = ref('');

const browsed = ref<OggettoBrowseDto>();
const editing = ref(false);
const freeze = ref(false);

const undoables = useUndoableActions();

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
}

function iniziaModifica() {
    if (browsed.value) {
        setOggetto(browsed.value.oggetto);
    }
    editing.value = true;
}

function annullaModifica() {
    if (browsed.value) {
        setOggetto(browsed.value.oggetto);
    }
    editing.value = false;
}

const saveData = async () => {
  freeze.value = true;
  const browse = useBrowseData();
  const updated = await browse.updateOggetto(form.value as OggettoObj);
  await loadOggetto(updated.id);
  freeze.value = false;
  editing.value = false;
}

const form = ref<OggettoObj>();

async function refreshThumbnail() {
    if (browsed.value && !browsed.value.oggetto.thumbnail && browsed.value.oggetto.immagini) {
        browsed.value.oggetto.thumbnail = browsed.value.oggetto.immagini[0] as string;
        if (form.value) {
            form.value.thumbnail = browsed.value.oggetto.thumbnail;
        }
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

function deleteOggetto() {
    freeze.value = true;
    const b = browsed.value as OggettoBrowseDto;
    const undoable = undoables.newUndoable( async () => {
        const deleted = await browse.deleteOggetto(b.oggetto.id);
        freeze.value = false;
    });
    undoable.text = `Eliminazione ${oggettoName(b.oggetto)}`;
    UndoableAction.start(undoable)
    .then((done: string) => {
        console.log(`Done: ${done}`);
    })
    .catch(error => {
        console.log(error);
    })
    ;
    router.replace(`/posto/${b.posto.id}`);
}

async function toggleThumbnail(uuid: string) {
    freeze.value = true;
    if (form.value || form.value == '') {
        form.value.thumbnail = form.value.thumbnail == uuid ? '' : uuid;
        const updated = await browse.updateOggetto(form.value as OggettoObj);
        await loadOggetto(updated.id);
    }
    freeze.value = false;
}

async function trashThumbnail(uuid: string) {
    freeze.value = true;
    if (form.value || form.value == '') {
        form.value.thumbnail = form.value.thumbnail == uuid ? '' : form.value.thumbnail;
        await browse.deletePicture(form.value.id, uuid);
        await loadOggetto(form.value.id);
    }
    freeze.value = false;
}

const checkoutSchema = ref<TipoSchedaOggetto>();
const checkoutData = ref<SchedaBySchema>();

function iniziaCheckout(schema: TipoSchedaOggetto) {
    if (checkoutSchema.value) {
        annullaCheckout();
    } else {
        checkoutSchema.value = schema;
        const scheda: SchedaBySchema = new SchedaOggetto(SchedaBySchema.KEY) as SchedaBySchema;
        const proto = SchedaOggetto.protos[SchedaBySchema.KEY];
        if (proto) {
            proto(scheda);
            SchedaBySchema.init(scheda);
            SchedaBySchema.initWithSchema(schema, scheda);
        }
        checkoutData.value = scheda;
    }
}

function annullaCheckout() {
    checkoutSchema.value = undefined;
    checkoutData.value = undefined;
}

function saveCheckout() {
    freeze.value = true;
    const b = browsed.value as OggettoBrowseDto;
    const undoable = undoables.newUndoable( async () => {
        const deleted = await browse.checkoutOggetto(b.oggetto.id, checkoutData.value as SchedaBySchema);
        freeze.value = false;
    });
    undoable.text = `Checkout ${oggettoName(b.oggetto)}`;
    UndoableAction.start(undoable)
    .then((done: string) => {
        console.log(`Done: ${done}`);
    })
    .catch(error => {
        console.log(error);
    })
    ;
    router.replace(`/posto/${b.posto.id}`);
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
            <template #menubuttons>
                <button @click="iniziaModifica()" type="button" :disabled="freeze">
                    <Heroicon icon="pencil"/> Modifica
                </button>
                <button type="button" :disabled="freeze" @click="deleteOggetto()">
                    <Heroicon icon="trash"></Heroicon> Elimina
                </button>
                <button v-for="schema in browse.currentRepo().checkout" type="button" :disabled="freeze" @click="iniziaCheckout(schema)">
                    <Heroicon icon="archive-checkout"></Heroicon> {{ schema.nome }} 
                </button>
            </template>
            <template #content>
                <div>
                    <form @submit.prevent="saveData()">
                    <CardFormat class="oggetto-details">
                        <template #header>
                            <div class="card-header">
                                <OggettoShort :oggetto="browsed.oggetto">
                                    <template #nome v-if="browsed.oggetto.nome == ''">
                                        <input type="text" :placeholder="`Oggetto ${browsed.oggetto.id.split('-')[0]}`" v-model="(form as OggettoObj).nome" :disabled="freeze"/>
                                    </template>
                                </OggettoShort>
                                <div class="notimportant">ID: {{ browsed.oggetto.id }}</div>
                                <span v-if="!editing && browsed.oggetto.nome == '' && form?.nome != ''">
                                    <button type="submit" :disabled="freeze"><Heroicon icon="check"/> Salva </button>
                                </span>
                            </div>
                        </template>
                        <template #image>
                        </template>
                        <div class="oggetto-img">
                            <ImageThumb @click="selectedImage = browsed.oggetto.thumbnail" class="mainthumb" :uuid="browsed.oggetto.id" :image="browsed.oggetto.thumbnail"></ImageThumb>
                        </div>
                        <SchedaOggettoView v-if="form?.scheda"
                            :scheda="browsed.oggetto.scheda"
                            :form="form?.scheda"
                            :editable="false"
                            :saving="freeze"
                            :repo="browsed.repo"
                            ></SchedaOggettoView>
                    </CardFormat>
                    </form>
                </div>
            </template>
        </SlidingDrawer>
        <SlidingDrawer>
            <template #title>Galleria</template>
            <AddPhotosButton @upload="refreshThumbnail()" :uuid="browsed.oggetto.id" :gallery="browsed.oggetto.immagini" :freeze="freeze"></AddPhotosButton>
            <template #content>
                <div>
                    <ItemsGallery :items="browsed.oggetto.immagini.filter(
                        item => item != browsed?.oggetto.thumbnail
                    )">
                        <template #item="{ item }">
                            <div style="position: relative;" v-if="true">
                                <ImageThumb @click="clickImage(item)" :uuid="`${uuid}`" :image="`${item}`" :class="{expanded: selectedImage == item}"></ImageThumb>
                            </div>
                        </template>
                        <template #empty>
                            <div>
                                Questo oggetto non ha foto.
                            </div>
                            <AddPhotosButton @upload="refreshThumbnail()" :uuid="browsed.oggetto.id" :gallery="browsed.oggetto.immagini" :freeze="freeze"></AddPhotosButton>
                        </template>
                    </ItemsGallery>
                </div>
            </template>
        </SlidingDrawer>
        <PopupDialog @click="selectedImage = ''" v-if="selectedImage != ''">
            <ImageThumb :uuid="`${uuid}`" :image="`${selectedImage}`"" style="width: 100%;"></ImageThumb>
            <div class="img-buttons">
                <button @click="toggleThumbnail(selectedImage)" :disabled="freeze">
                    <Heroicon icon="photo" /> Copertina
                </button>
                <button @click="trashThumbnail(selectedImage)" :disabled="freeze">
                    <Heroicon icon="trash" /> Elimina
                </button>
            </div>
        </PopupDialog>
        <PopupDialog v-if="editing && form" @close="annullaModifica()">
            <form class="edit-form" @submit.prevent="saveData()">
                <label class="data-panel">
                    <span class="data-panel-header">Nome</span>
                    <input type="text" :placeholder="`Oggetto ${browsed.oggetto.id.split('-')[0]}`" v-model="form.nome" :disabled="freeze"/>
                </label>
                <SchedaOggettoView v-if="form.scheda"
                    :scheda="form.scheda"
                    :form="form.scheda"
                    :editable="true"
                    :saving="freeze"
                    :repo="browsed.repo"
                    ></SchedaOggettoView>
                <div class="edit-buttons">
                    <button @click="annullaModifica()" type="button" :disabled="freeze"><Heroicon icon="cancel"/> Annulla</button>
                    <button type="submit" :disabled="freeze"><Heroicon icon="check"/> Salva</button>
                </div>
            </form>
        </PopupDialog>
        <PopupDialog v-if="checkoutSchema && checkoutData" @close="checkoutSchema = undefined">
            <SchedaBySchemaView 
                :scheda="checkoutData" 
                :form="checkoutData" 
                :editable="true"
                :saving="false"
                :schema="checkoutSchema"></SchedaBySchemaView>
            <div>
                <button @click="saveCheckout()" :disabled="freeze">
                    <Heroicon icon="archive-checkout" /> Checkout
                </button>
            </div>
        </PopupDialog>
    </div>
    <div v-else="">Loading...</div>
</template>

<style scoped>

.img-buttons {
  position: absolute;
  bottom: 16px;
  left: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  pointer-events: none;
  z-index: 1000;
}

.img-buttons button {
  pointer-events: auto;
  position: relative;
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
.edit-form {
    display: flex;
    flex-direction: column;
    gap: 8px;
}
.edit-form input[type="text"] {
    width: 100%;
    box-sizing: border-box;
}
.edit-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
}

</style>
