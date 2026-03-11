<script setup lang="ts">
import LoginForm from './components/LoginForm.vue';
import { useLoggedUser } from './stores/logged-user';
const loggedUser = useLoggedUser();

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
  </div>
  <div v-else="">
    <LoginForm></LoginForm>
  </div>
</template>

<style scoped></style>
