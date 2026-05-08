<script setup lang="ts">
import { useBrowseData } from '@/stores/browse-data';
import { useLoggedUser } from '@/stores/logged-user';
import PostoShort from './PostoShort.vue';
import Heroicon from './Heroicon.vue';

const user = useLoggedUser();
const browse = useBrowseData();

</script>
<template>
    <div>Utente loggato: {{ user.user.username }}</div>
    <div>
        <button @click="user.logout()" :disabled="user.loading">Logout</button>
        <RouterLink :to="`/print`"><button><Heroicon icon="printer" /></button></RouterLink>
    </div>
    <div v-for="access in user.user.repos">
        <div>{{ access.root.id }}</div>
        <button type="button" @click="browse.switchToRepo(access)">
            <PostoShort :posto="access.root"></PostoShort>
        </button>
    </div>
</template>
<style scoped></style>