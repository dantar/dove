<template>
  <div class="camera">

    <div class="preview">
      <video ref="video" autoplay playsinline></video>
      <canvas ref="canvas" class="hidden"></canvas>
    </div>

    <div class="controls">
      <button @click="takePhoto">📸 Scatta</button>
      <button @click="stopCamera">⛔ Stop</button>
    </div>

    <div class="gallery">
      <div
        v-for="(photo, index) in photos"
        :key="index"
        class="thumb"
      >
        <img :src="photo"/>
        <button class="delete" @click="removePhoto(index)">❌</button>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">

import { ref, onMounted, onBeforeUnmount } from 'vue'

const video = ref<HTMLVideoElement | null>(null)
const canvas = ref<HTMLCanvasElement | null>(null)

const stream = ref<MediaStream | null>(null)
const photos = ref<string[]>([])

async function startCamera(): Promise<void> {

  stream.value = await navigator.mediaDevices.getUserMedia({
    video: {
      facingMode: "environment"
    },
    audio: false
  })

  if (video.value) {
    video.value.srcObject = stream.value
  }
}

function stopCamera(): void {

  if (!stream.value) return

  stream.value.getTracks().forEach(track => track.stop())
}

function takePhoto(): void {

  if (!video.value || !canvas.value) return

  const v = video.value
  const c = canvas.value

  const ctx = c.getContext("2d")
  if (!ctx) return

  const size = Math.min(v.videoWidth, v.videoHeight)

  c.width = size
  c.height = size

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
    size,
    size
  )

  const data = c.toDataURL("image/jpeg", 0.9)

  photos.value.push(data)
}

function removePhoto(index: number): void {
  photos.value.splice(index, 1)
}

onMounted(() => {
  startCamera()
})

onBeforeUnmount(() => {
  stopCamera()
})

</script>

<style scoped>

.camera {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.preview {
  width: 100%;
  max-width: 400px;
  aspect-ratio: 1 / 1;
  overflow: hidden;
}

video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hidden {
  display: none;
}

.controls {
  display: flex;
  gap: 10px;
}

.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, 100px);
  gap: 10px;
}

.thumb {
  position: relative;
}

.thumb img {
  width: 100px;
  height: 100px;
  object-fit: cover;
}

.delete {
  position: absolute;
  top: 0;
  right: 0;
}

</style>