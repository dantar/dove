<template>
  <div class="camera">

    <div
      class="preview"
      ref="preview"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="onPointerUp"
      @pointercancel="onPointerUp"
    >
      <video ref="video" autoplay playsinline></video>

      <div class="flash" v-if="flash"></div>

      <canvas ref="canvas" class="hidden"></canvas>
    </div>

    <div class="controls">
      <button @click="takePhoto">📸 Scatta</button>
      <button @click="stopCamera">⛔ Stop</button>
    </div>

    <div class="gallery">
      <div v-for="(photo,index) in photos" :key="index" class="thumb">
        <img :src="photo" />
        <button class="delete" @click="removePhoto(index)">❌</button>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

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
const OUTPUT_SIZE = 1024

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

function removePhoto(i:number) {
  photos.value.splice(i,1)
}

onMounted(startCamera)
onBeforeUnmount(stopCamera)

</script>

<style scoped>

.camera {
  display:flex;
  flex-direction:column;
  gap:15px;
}

.preview {
  position:relative;
  max-width:420px;
  aspect-ratio:1;
  overflow:hidden;
  touch-action:none;
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
  display:flex;
  gap:10px;
}

.gallery{
  display:grid;
  grid-template-columns:repeat(auto-fill,100px);
  gap:10px;
}

.thumb{
  position:relative;
}

.thumb img{
  width:100px;
  height:100px;
  object-fit:cover;
}

.delete{
  position:absolute;
  top:0;
  right:0;
}

</style>