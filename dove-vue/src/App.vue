<script setup lang="ts">
import { ref } from 'vue';
import LoginForm from './components/LoginForm.vue';
import QrLauncher from './components/QrLauncher.vue';
import { useLoggedUser } from './stores/logged-user';
import CameraUpload from './components/CameraUpload.vue';
const loggedUser = useLoggedUser();
const somecode = ref('(scan to get a value)');
const decoded = (code:string) => {
  somecode.value = code;
};
</script>

<template>
  <h1>Dove</h1>
  <div v-if="loggedUser.user.username">
    <div>
      {{ loggedUser.user.username }}
    </div>
    <p><strong>Current route path:</strong> {{ $route.fullPath }}</p>
    <nav>
      <RouterLink to="/">Go to Home</RouterLink>
      <RouterLink to="/browse">Go to Browse</RouterLink>
      <RouterLink to="/about">Go to About</RouterLink>
      <RouterLink to="/camera">Go to camera</RouterLink>
      <RouterLink to="/advanced">Go to advanced camera</RouterLink>
    </nav>
    <main>
      <RouterView />
    </main>
    <div>
      <CameraUpload></CameraUpload>
    </div>
    <div>
      <div>{{ somecode }}</div>
      <QrLauncher @decoded="decoded"></QrLauncher>
    </div>
  </div>
  <div v-else="">
    <LoginForm></LoginForm>
  </div>
</template>

<style scoped></style>
