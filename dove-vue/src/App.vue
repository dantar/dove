<script setup lang="ts">
import { ref } from 'vue';
import Heroicon from './components/Heroicon.vue';
import LoginForm from './components/LoginForm.vue';
import PopupDialog from './components/PopupDialog.vue';
import QrLauncher from './components/QrLauncher.vue';
import { useLoggedUser } from './stores/logged-user';
import { useRouter } from 'vue-router'
import LoggedUser from './components/LoggedUser.vue';
import { useTipiSchedeOggetto } from './stores/schede-by-schema';
import { useBrowseData } from './stores/browse-data';
import type { PostoBrowseDto } from './models/browse-item';

const loggedUser = useLoggedUser();
const router = useRouter();
const repo = useTipiSchedeOggetto();

const popupUser = ref(false);
const popupCart = ref(false);

const browse = useBrowseData();

const browsed = ref<PostoBrowseDto>();
browse
.browseRootDetails()
.then((data) => {
  browsed.value = data;
});

</script>

<template>
  <div v-if="loggedUser.user.username">
    <div class="header">
      <RouterLink to="/"><button><Heroicon icon="home" /></button></RouterLink>
      <RouterLink to="/search"><button><Heroicon icon="search" /></button></RouterLink>
      <RouterLink v-if="browsed" v-for="repo in browsed.posti" :to="`/posto/${repo.id}`"><button><Heroicon icon="archive-box" /></button></RouterLink>
      <button @click="popupCart = true"><Heroicon icon="cart" /></button>
      <RouterLink :to="`/print`"><button><Heroicon icon="printer" /></button></RouterLink>
      <QrLauncher mode="one" @decoded-one="(uuid) => router.replace(`/qr/${uuid}`)">
        <Heroicon icon="qr-code-search"></Heroicon>
      </QrLauncher>
      <button @click="popupUser = true"><Heroicon icon="user" /></button>
    </div>
    <main>
      <RouterView />
      <PopupDialog v-if="popupUser" @close="popupUser = false">
        <LoggedUser></LoggedUser>
      </PopupDialog>
      <PopupDialog v-if="popupCart" @close="popupCart = false">
        Per adesso non hai carrelli. Clicca per aggiungere un carrello.
      </PopupDialog>
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
