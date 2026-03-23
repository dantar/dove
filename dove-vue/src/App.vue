<script setup lang="ts">
import LoginForm from './components/LoginForm.vue';
import { useLoggedUser } from './stores/logged-user';
const loggedUser = useLoggedUser();

</script>

<template>
  <div v-if="loggedUser.user.username">
    <div class="header">
      <RouterLink :to="`/browse`">Archivio</RouterLink>
      <RouterLink :to="`/print`">Stampa</RouterLink>
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
