<script setup lang="ts">
import { ref, nextTick, onBeforeUnmount, onMounted } from "vue"
import {
  Html5Qrcode,
  type CameraDevice,
  type Html5QrcodeCameraScanConfig,
} from "html5-qrcode"
import {v4 as uuidv4} from 'uuid';

const emit = defineEmits<{
  (e: "decoded", value: string): void
  (e: "closed"): void
}>()

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
  await stopScanner()
  visible.value = false
  emit("closed")
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

const startScanner = async (): Promise<void> => {
  if (!html5QrCode || !selectedCameraId.value) return

  const config:Html5QrcodeCameraScanConfig = {
    fps: 4,
    //qrbox: { width: 250, height: 250 },
    //aspectRatio: 1.0
  }

  await html5QrCode.start(
    selectedCameraId.value,
    config,
    (decodedText: string) => {
      emit("decoded", decodedText)
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
  emit("decoded", currentCode.value);
  currentCode.value = '';
  showInput.value = false;
}

function toggleShowInput() {
  showInput.value = !showInput.value;
}

</script>

<template>
  <div v-if="visible" class="qr-overlay">
    <!-- Top bar -->
    <div class="top-bar">
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

      <button class="close-btn" @click="closeScanner">✕</button>
    </div>

    <!-- Scanner -->
    <div ref="qrRegion" class="qr-region"></div>

    <!-- Bottom bar -->
    <div class="bottom-bar">
      <button
        v-if="torchSupported"
        class="control-btn"
        @click="toggleTorch"
      >
        🔦
      </button>

      <button type="button" @click="toggleShowInput()">▽</button>
      <span v-if="showInput">
        <form @submit.prevent="emitInputCode()">
          <input type="text" v-model.trim="currentCode" />
          <button type="button" @click="() => currentCode = uuidv4()" >▣</button>
          <button type="submit" :disabled="!currentCode">✓</button>
        </form>
      </span>

    </div>

    <div v-if="error" class="error">
      {{ error }}
    </div>
  </div>
</template>

<style scoped>
.qr-overlay {
  position: fixed;
  inset: 0;
  background: black;
  z-index: 9999;
  display: flex;
  flex-direction: column;
}

.qr-region {
  flex: 1;
}

.top-bar,
.bottom-bar {
  position: absolute;
  left: 0;
  right: 0;
  display: flex;
  padding: 1rem;
  z-index: 10;
}

.top-bar {
  top: 0;
  justify-content: space-between;
}

.bottom-bar {
  bottom: 0;
  justify-content: center;
  gap: 1rem;
}

.camera-select {
  padding: 0.5rem;
  font-size: 1rem;
}

.close-btn {
  font-size: 1.5rem;
  background: transparent;
  color: white;
  border: none;
}

.control-btn {
  padding: 0.8rem 1.2rem;
  font-size: 1rem;
  border-radius: 8px;
  border: none;
}

.stop {
  background: red;
  color: white;
}

.error {
  position: absolute;
  bottom: 80px;
  width: 100%;
  text-align: center;
  color: red;
}
</style>