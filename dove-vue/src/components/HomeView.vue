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
    <ItemsGallery :items="user.user.repos">
      <template #item="{ item }">
        <CardFormat>
          <template #header>
            <div class="card-header">
              <PostoShort :posto="item.root"></PostoShort>
            </div>
          </template>
          <template #default>
            <RouterLink :to="`/posto/${item.root.id}`">
              <div class="card-image">
                <ImageThumb :uuid="item.root.id" image=""></ImageThumb>
              </div>
            </RouterLink>
          </template>
        </CardFormat>
      </template>
    </ItemsGallery>
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
