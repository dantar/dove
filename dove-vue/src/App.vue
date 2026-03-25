<script setup lang="ts">
import Heroicon from './components/Heroicon.vue';
import LoginForm from './components/LoginForm.vue';
import QrLauncher from './components/QrLauncher.vue';
import { useLoggedUser } from './stores/logged-user';
import { useRouter } from 'vue-router'

const loggedUser = useLoggedUser();
const router = useRouter();

</script>

<template>
  <div v-if="loggedUser.user.username">
    <div class="header">
      <RouterLink :to="`/browse`"><button><Heroicon icon="archive-box" /></button></RouterLink>
      <RouterLink :to="`/print`"><button><Heroicon icon="printer" /></button></RouterLink>
      <QrLauncher @decoded="(uuid) => router.replace(`/qr/${uuid}`)"></QrLauncher>
      {{ loggedUser.user.username }}
    </div>
    <main>
      <RouterView />
    </main>
  </div>
  <div v-else="">
    <LoginForm></LoginForm>
  </div>
</template>

<style scoped>
.header {
  text-align: right;
}
@media print {
  .header {
    display: none;
  }
}
</style>
