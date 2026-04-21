<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import Heroicon from './Heroicon.vue';
import ItemsGallery from './ItemsGallery.vue';
import CardFormat from './CardFormat.vue';

const emit = defineEmits<{
  (e: "done", value: string[]): void
}>()

const video = ref<HTMLVideoElement | null>(null)
const canvas = ref<HTMLCanvasElement | null>(null)
const preview = ref<HTMLDivElement | null>(null)

const stream = ref<MediaStream | null>(null)
const track = ref<MediaStreamTrack | null>(null)

const photos = ref<string[]>([])
const flash = ref(false)

/* zoom software */
const zoom = ref(1)
let startDistance = 0
let startZoom = 1

/* controlla risoluzione finale */
const OUTPUT_SIZE = 600

async function startCamera(): Promise<void> {
  stream.value = await navigator.mediaDevices.getUserMedia({
    video: {
      facingMode: { ideal: "environment" },
      width: { ideal: 1920 },
      height: { ideal: 1920 }
    },
    audio: false
  })
  const tracks = stream.value.getVideoTracks();
  if (tracks.length > 0 && tracks[0]) {
      track.value = tracks[0];
      if (video.value) {
        video.value.srcObject = stream.value
      }
  }
}

function donePictures(): void {
    stopCamera();
    emit('done', photos.value);
}

function stopCamera(): void {

  if (!stream.value) return
  stream.value.getTracks().forEach(t => t.stop())
}

/* ------------------- PHOTO ------------------- */

function takePhoto(): void {

  if (!video.value || !canvas.value) return

  const v = video.value
  const c = canvas.value

  const ctx = c.getContext("2d")
  if (!ctx) return

  const size = Math.min(v.videoWidth, v.videoHeight)

  c.width = OUTPUT_SIZE
  c.height = OUTPUT_SIZE

  const sx = (v.videoWidth - size) / 2
  const sy = (v.videoHeight - size) / 2

  ctx.drawImage(
    v,
    sx,
    sy,
    size,
    size,
    0,
    0,
    OUTPUT_SIZE,
    OUTPUT_SIZE
  )

  const img = c.toDataURL("image/jpeg", 0.85)

  flashAnimation()

  photos.value.push(img)
}

function flashAnimation() {
  flash.value = true
  setTimeout(() => flash.value = false, 120)
}

/* ------------------- PINCH ZOOM ------------------- */

const pointers = new Map<number, PointerEvent>()

function distance(a: PointerEvent, b: PointerEvent) {
  return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY)
}

function onPointerDown(e: PointerEvent) {
  pointers.set(e.pointerId, e)
}

function onPointerMove(e: PointerEvent) {

  if (!pointers.has(e.pointerId)) return

  pointers.set(e.pointerId, e)

  if (pointers.size === 2) {

    const [a,b] = Array.from(pointers.values())
    if (a && b) {

        const d = distance(a,b)
    
        if (!startDistance) {
          startDistance = d
          startZoom = zoom.value
        }
    
        zoom.value = Math.min(3, Math.max(1, startZoom * (d/startDistance)))
    
        if (video.value)
          video.value.style.transform = `scale(${zoom.value})`

    }
  }
}

function onPointerUp(e: PointerEvent) {
  pointers.delete(e.pointerId)
  startDistance = 0
}

/* ------------------- TAP FOCUS ------------------- */

// async function focusAt(e: MouseEvent) {
//   if (!track.value) return
//   const capabilities: any = track.value.getCapabilities?.()
//   if (!capabilities?.focusMode) return
//   try {
//     await track.value.applyConstraints({
//       advanced: [{ focusMode: "single-shot" }]
//     })
//   } catch (err) {
//     console.log("focus not supported")
//   }
// }

/* ------------------- GALLERY ------------------- */

function removePhoto(photo: string) {
  photos.value.splice(photos.value.indexOf(photo),1);
}

onMounted(startCamera)
onBeforeUnmount(stopCamera)

</script>
<template>

<div class="fullpage">
  <div class="container">
    
    <!-- Preview fissa -->
    <div
      class="preview"
      ref="preview"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="onPointerUp"
      @pointercancel="onPointerUp"
      @click="takePhoto"
    >
      <div class="controls">
        <button @click.stop="takePhoto"><Heroicon icon="camera"/></button>
        <button @click.stop="donePictures"><Heroicon icon="check"/></button>
      </div>
      <video ref="video" autoplay playsinline></video>
      <div class="flash" v-if="flash"></div>
      <canvas ref="canvas" class="hidden"></canvas>
    </div>

    <!-- Gallery scrollabile -->
    <div class="gallery">
      <ItemsGallery :items="photos">
        <template #item="{item}">
          <CardFormat>
            <img class="new-picture" :src="item" />
            <button class="top-right-button" @click="removePhoto(item)"><Heroicon icon="trash"/></button>
          </CardFormat>
        </template>
      </ItemsGallery>
    </div>

  </div>
</div>
</template>

<style scoped>

.new-picture {
  max-width: 150px;
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
  padding: 10px;
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
  top:0;
  right:0;
}

</style>