<script setup lang="ts">
import { useLoggedUser } from '../stores/logged-user';
import { useBackendConfig } from '../stores/backend-config';
import { useBrowseData } from '@/stores/browse-data';
import { ref } from 'vue';
import type { PostoBrowseDto } from '@/models/browse-item';
import PostoShort from './PostoShort.vue';
import CardFormat from './CardFormat.vue';
import ItemsGallery from './ItemsGallery.vue';
import ImageThumb from './ImageThumb.vue';

const loggedUser = useLoggedUser();
const backend = useBackendConfig();
const browse = useBrowseData();

const root = ref<PostoBrowseDto>();
browse
.browseRootDetails()
.then((data) => {
  root.value = data;
});

</script>

<template>
  <div v-if="root" class="pagesection">
    <ItemsGallery :items="root.posti">
      <template #item="{ item }">
        <CardFormat>
          <template #header>
            <div class="card-header">
              <PostoShort :posto="item"></PostoShort>
            </div>
          </template>
          <template #default>
            <RouterLink :to="`/posto/${item.id}`">
              <div class="card-image">
                <ImageThumb :uuid="item.id" image=""></ImageThumb>
              </div>
            </RouterLink>
          </template>
        </CardFormat>
      </template>
    </ItemsGallery>
  </div>
  <div v-else="">Loading...</div>
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
