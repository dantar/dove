<script setup lang="ts">
import { ref } from 'vue';
import Heroicon from './components/Heroicon.vue';
import LoginForm from './components/LoginForm.vue';
import PopupDialog from './components/PopupDialog.vue';
import QrLauncher from './components/QrLauncher.vue';
import { useLoggedUser } from './stores/logged-user';
import { useRouter } from 'vue-router'
import LoggedUser from './components/LoggedUser.vue';
import { useBrowseData } from './stores/browse-data';
import { SchedaOggettoCampoStarsHandler } from './stores/schede-by-schema';
import UndoableActionsStack from './components/UndoableActionsStack.vue';

const loggedUser = useLoggedUser();
const router = useRouter();

const popupUser = ref(false);
const popupCart = ref(false);
const popupMain = ref(false);

const browse = useBrowseData();

console.log(SchedaOggettoCampoStarsHandler.KEY);



</script>

<template>
  <div v-if="loggedUser.user.username">
    <div class="header">
      <button @click="popupMain = true"><Heroicon icon="menu" />Menu</button>
    </div>
    <main>
      <UndoableActionsStack></UndoableActionsStack>
      <RouterView />
      <PopupDialog v-if="popupMain" @close="popupMain = false">
        <QrLauncher v-if="browse.repo" mode="one" @decoded-one="(uuid) => router.replace(`/qr/${uuid}`)">
          <Heroicon icon="qr-code-search" />
          Cerca codice QR
        </QrLauncher>
        <RouterLink v-if="browse.repo" to="/search"><button><Heroicon icon="search" />Ricerca avanzata</button></RouterLink>
        <button v-if="false" @click="popupCart = true"><Heroicon icon="cart" /></button>
        <RouterLink v-if="browse.repo" :to="`/posto/${browse.repo}`"><button><Heroicon icon="archive-box" />Archivio</button></RouterLink>
        <button @click="popupUser = true"><Heroicon icon="user" />Utente</button>
      </PopupDialog>
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
