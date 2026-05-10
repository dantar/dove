<script setup lang="ts">
import { ref, Transition } from 'vue';
import Heroicon from './Heroicon.vue';

const open = ref(false);

</script>
<template>
  <div class="drawer-header">
    <slot name="title"></slot>
    <button @click="open = !open" type="button" class="menu-button">
      <Heroicon icon="menu"></Heroicon>
    </button>
  </div>
  <transition name="fade">
    <div v-if="open" class="drawer-content">
      <div class="floatingmenu">
        <slot></slot>
     </div>
    </div>
  </transition>
</template>
<style>

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  z-index: 10;
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
  z-index: 10;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.drawer-content {
  position: relative;
}
.floatingmenu {
  position: absolute;
  z-index: 10;
  top: -0.2rem;
  right: 10px;
  display: flex;
  flex-direction: column;
  align-items: end;
}
.floatingmenu button {
  display: flex;
}
.drawer-header {
  position: relative;
  width: 100%;
  text-align: right;
  background-color: white  ;
  border-top: 1px solid gray;
  margin-top: 1rem;
  margin-bottom: -0.4rem;
}
.drawer-header span {
  position: absolute;
  top: -0.5rem;
  left: 10px;
  background-color: white;
  font-size: 0.9rem;
  color: gray;
  border: 1px solid gray;
  padding: 2px;
  border-radius: 4px;
}

.drawer-header .menu-button {
    position: relative;
    top: -0.6rem;
    background-color: white;
    margin-right: 10px;
}

</style>
