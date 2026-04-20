<script setup lang="ts">
import { ref, nextTick, onBeforeUnmount, onMounted } from "vue"
import {
  Html5Qrcode,
  type CameraDevice,
  type Html5QrcodeCameraScanConfig,
} from "html5-qrcode"
import {v4 as uuidv4} from 'uuid';
import Heroicon from "./Heroicon.vue";
import ItemsGallery from "./ItemsGallery.vue";
import CardFormat from "./CardFormat.vue";
import DicebearIdenticon from "./DicebearIdenticon.vue";

const emit = defineEmits<{
  (e: "decoded", values: string[]): void
}>()

interface Props {
  sendAt: number;
}
const props = defineProps<Props>();

const codes = ref<string[]>([]);

const visible = ref<boolean>(false)
const qrRegion = ref<HTMLElement | null>(null)
const cameras = ref<CameraDevice[]>([])
const selectedCameraId = ref<string | null>(null)
const error = ref<string | null>(null)
const torchSupported = ref<boolean>(false)

let html5QrCode: Html5Qrcode | null = null
let isScanning = false

const openScanner = async (): Promise<void> => {
  visible.value = true
  await nextTick()
  await initScanner()
}

const closeScanner = async (): Promise<void> => {
  await stopScanner();
  visible.value = false;
  emit("decoded", []);
}

/* ---------------------------
   Core logic
---------------------------- */

const initScanner = async (): Promise<void> => {
  error.value = null

  try {
    cameras.value = await Html5Qrcode.getCameras()

    if (!cameras.value || !cameras.value.length) {
      throw new Error("Nessuna fotocamera trovata")
    }

    // Preferisci camera posteriore se disponibile
    const backCamera = cameras.value.find((c) =>
      c.label.toLowerCase().includes("back")
    )

    if (backCamera) {
        selectedCameraId.value = backCamera.id;
    } else if (cameras.value[0]) {
        selectedCameraId.value = cameras.value[0].id;
    } else {
        throw new Error("Nessuna fotocamera disponibile")
    }

    if (!qrRegion.value) return

    if (!qrRegion.value.id) {
      qrRegion.value.id = "qr-reader-fullscreen"
    }

    html5QrCode = new Html5Qrcode(qrRegion.value.id)

    await startScanner()
  } catch (err) {
    console.error(err)
    error.value = "Errore accesso fotocamera"
  }
}

function addCode(code: string) {
  codes.value.push(code);
  if (props.sendAt > 0 && codes.value.length >= props.sendAt) {
    emitAllCodes();
  }
}

const startScanner = async (): Promise<void> => {
  if (!html5QrCode || !selectedCameraId.value) return

  const config:Html5QrcodeCameraScanConfig = {
    fps: 4,
    qrbox: { width: 250, height: 250 },
    aspectRatio: 1.0
  }

  await html5QrCode.start(
    selectedCameraId.value,
    config,
    (decodedText: string) => {
      const parts = decodedText.split('/');
      const code = parts[parts.length - 1] || '';
      addCode(code);
    },
    () => {}
  )

  isScanning = true

  await checkTorchSupport()
}

const stopScanner = async (): Promise<void> => {
  if (html5QrCode && isScanning) {
    await html5QrCode.stop()
    await html5QrCode.clear()
    isScanning = false
  }
}

const restartScanner = async (): Promise<void> => {
  if (!isScanning) return
  await stopScanner()
  await startScanner()
}

const toggleTorch = async (): Promise<void> => {
  if (!html5QrCode) return

  try {
    const settings = html5QrCode.getRunningTrackSettings()
    const torch = html5QrCode.getRunningTrackCameraCapabilities().torchFeature();
    const isTorchOn = settings?.torch ?? false
    torch.apply(isTorchOn);
  } catch {
    console.warn("Torcia non supportata")
  }
}

const checkTorchSupport = async (): Promise<void> => {
  if (!html5QrCode) return
  try {
    const torch = html5QrCode.getRunningTrackCameraCapabilities().torchFeature();
    torchSupported.value = torch.isSupported();
  } catch {
    torchSupported.value = false;
  }
}

onBeforeUnmount(() => {
  stopScanner()
})

onMounted(() => {
  openScanner();
})

const showInput = ref<boolean>(false);
const currentCode = ref<string>('');
const emitInputCode = () => {
  addCode(currentCode.value);
  currentCode.value = '';
  showInput.value = false;
}

function emitAllCodes() {
  emit("decoded", codes.value);
}

function removeCode(code: string) {
  codes.value.splice(codes.value.indexOf(code), 1);
}

</script>

<template>

<div class="fullpage">
  <div class="container">
    
    <!-- Preview fissa -->
    <div class="preview">
      <div ref="qrRegion"></div>
      <div class="qr-controls">
        <div>
          <input type="text" v-model.trim="currentCode" />
        </div>
        <div>
          <form @submit.prevent="emitInputCode()">
            <button type="button" @click="() => currentCode = uuidv4()" ><Heroicon icon="qr-code"/></button>
            <button type="submit" :disabled="!currentCode"><Heroicon icon="check"/></button>
          </form>
        </div>
      </div>
    </div>

    <div class="top-left">
      <select
        v-model="selectedCameraId"
        class="camera-select"
        @change="restartScanner"
      >
        <option
          v-for="camera in cameras"
          :key="camera.id"
          :value="camera.id"
        >
          {{ camera.label || "Camera" }}
        </option>
      </select>
    </div>

    <div class="top-right">
      <button type="button" @click="closeScanner"><Heroicon icon="cancel" /></button>
    </div>

    <!-- Gallery scrollabile -->
    <div class="gallery" v-if="sendAt != 1">
      <div>
        <button
          v-if="torchSupported"
          class="control-btn"
          @click="toggleTorch"
        >🔦</button>
        <button v-if="codes.length > 0" type="button" @click="emitAllCodes"><Heroicon icon="check" /></button>
      </div>
      <ItemsGallery :items="codes">
        <template #item="{item}">
          <CardFormat>
            <div class="qrcode">
              <DicebearIdenticon :uuid="item"></DicebearIdenticon>
              <span>{{ item }}</span>
            </div>
            <button class="top-right-button" @click="removeCode(item)"><Heroicon icon="trash"/></button>
          </CardFormat>
        </template>
      </ItemsGallery>
    </div>

  </div>
</div>
<div v-if="error" class="error">
  {{ error }}
</div>

</template>

<style scoped>

.qr-controls {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  z-index: 100;
  bottom: 10px;
}

.top-left {
  position: fixed;
  top: 10px;
  left: 10px;
  z-index: 100;
}

.top-right {
  position: fixed;
  top: 10px;
  right: 10px;
  z-index: 100;
}

.qrcode {
  display: flex;
  flex-direction: row;
  gap: 5px;
  padding: 5px;
}

.identicon {
  width: 50px;
}

.fullpage {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #15151584;
  z-index: 100;
}

/* contenitore verticale */
.container {
  display: flex;
  flex-direction: column;

  background-color: white;
  width: 100%;
  height: 100%;
  max-width: 600px; /* opzionale */
}

/* preview in alto */
.preview {
  position: sticky;
  top: 0;
  z-index: 10;
  aspect-ratio: 1 / 1; /* quadrato */
  width: 100%;
}

/* video che riempie */
.preview video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* gallery scrollabile */
.gallery {
  flex: 1;
  overflow: auto;
  gap: 8px;
  padding: 8px;
}

video {
  width:100%;
  height:100%;
  object-fit:cover;
  transition:transform .1s;
}

.flash{
  position:absolute;
  inset:0;
  background:white;
  opacity:.8;
  animation:flash .15s ease-out;
}

@keyframes flash{
  from{opacity:.9}
  to{opacity:0}
}

.hidden{
  display:none;
}

.controls{
  position: absolute;
  bottom: 20px;
  width: 100%;
  display:flex;
  justify-content: center;
  gap:10px;
}

.top-right-button{
  position:absolute;
  top: 2;
  right:0;
}


</style>