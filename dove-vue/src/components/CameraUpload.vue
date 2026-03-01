<template>
  <div class="camera-upload">
    <h2>Scatta una foto</h2>

    <!-- Input fotocamera -->
    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      capture="environment"
      @change="onFileSelected"
    />

    <!-- Anteprima -->
    <div v-if="previewUrl" class="preview">
      <img :src="previewUrl" alt="Anteprima foto" />
    </div>

    <!-- Pulsante invio -->
    <button
      :disabled="!selectedFile || isUploading"
      @click="uploadPhoto"
    >
      {{ isUploading ? 'Invio in corso...' : 'Invia foto' }}
    </button>

    <p v-if="message" class="message">{{ message }}</p>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import axios from 'axios'

const selectedFile = ref<File | null>(null)
const previewUrl = ref<string | null>(null)
const isUploading = ref(false)
const message = ref<string | null>(null)

const onFileSelected = (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]

  if (!file) return

  selectedFile.value = file

  // Genera anteprima
  previewUrl.value = URL.createObjectURL(file)
}

const uploadPhoto = async () => {
  if (!selectedFile.value) return

  isUploading.value = true
  message.value = null

  const formData = new FormData()
  formData.append('photo', selectedFile.value)

  try {
    await axios.post(
      'https://tuo-backend.it/api/upload', // <-- cambia con il tuo endpoint
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    )

    message.value = 'Foto caricata con successo!'
    selectedFile.value = null
    previewUrl.value = null
  } catch (error) {
    console.error(error)
    message.value = 'Errore durante il caricamento.'
  } finally {
    isUploading.value = false
  }
}
</script>

<style scoped>
.camera-upload {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 400px;
}

.preview img {
  width: 100%;
  border-radius: 8px;
}

button {
  padding: 0.8rem;
  font-size: 1rem;
  border-radius: 6px;
  border: none;
  background-color: #42b883;
  color: white;
}

button:disabled {
  background-color: #ccc;
}
</style>