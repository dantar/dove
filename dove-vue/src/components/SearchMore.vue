<script setup lang="ts">
import { useSearchData } from '@/stores/search-data';
import { onMounted, onUnmounted, ref } from 'vue';

const search = useSearchData();

let observer: IntersectionObserver | null = null;

function attachObserver() {
  console.log(more, more.value);
  if (observer) {
    observer.observe(more.value as HTMLDivElement);
  };
}

const more = ref<HTMLDivElement>();
onMounted(() => {
  observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        search.oneMorePage().then(
          (p) => {
            if (p.last && observer) {
              observer.disconnect();
            }
          }
        );
      }
    });
  });
  observer.observe(more.value as HTMLDivElement);
});
onUnmounted(() => {
  if (observer) {
    observer.disconnect();
  }
});

</script>
<template>
  <div ref="more">Loading...</div>
</template>
<style scoped></style>