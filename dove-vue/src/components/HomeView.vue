<script setup lang="ts">
import { useLoggedUser } from '../stores/logged-user';
import PostoShort from './PostoShort.vue';
import CardFormat from './CardFormat.vue';
import ItemsGallery from './ItemsGallery.vue';
import ImageThumb from './ImageThumb.vue';

const user = useLoggedUser();

</script>

<template>
  <div class="pagesection">
    Home
  </div>
</template>

<style scoped>
.card-header {
  text-align: center;
  font-size: 1.1em;
}
.card-image .identicon {
  padding: 15%;
}
</style>
