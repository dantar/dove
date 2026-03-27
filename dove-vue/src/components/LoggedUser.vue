<script setup lang="ts">
import { useLoggedUser } from '@/stores/logged-user';

const user = useLoggedUser();

</script>
<template>
    <div>Utente loggato: {{ user.user.username }}</div>
    <div><button @click="user.logout()" :disabled="user.loading">Logout</button></div>
</template>
<style scoped></style>