<script setup lang="ts">
import { ref, Transition } from 'vue';
import Heroicon from './Heroicon.vue';

const menu = ref(false);
const content = ref(true);

function beforeEnter(e: Element) {
  const el = e as HTMLElement;
  el.style.height = '0'
  el.style.transform = 'scaleY(0)'
  el.style.transformOrigin = 'top'
  el.style.opacity = '0'
}

function enter(e: Element) {
  const el = e as HTMLElement;
  el.style.transition = 'height 0.3s ease, transform 0.3s ease, opacity 0.2s ease'

  // altezza reale
  const height = el.scrollHeight

  el.style.height = height + 'px'
  el.style.transform = 'scaleY(1)'
  el.style.opacity = '1'
}

function leave(e: Element) {
  const el = e as HTMLElement;
  // imposta stato iniziale (aperto)
  el.style.height = el.scrollHeight + 'px'
  el.style.transform = 'scaleY(1)'
  el.style.opacity = '1'

  // forza reflow
  void el.offsetHeight

  el.style.transition = 'height 0.3s ease, transform 0.3s ease, opacity 0.2s ease'

  // stato finale (chiuso)
  el.style.height = '0'
  el.style.transform = 'scaleY(0)'
  el.style.opacity = '0'
}

</script>
<template>
  <div class="drawer-header" :class="{collapsed: !content}">
    <span @click="content = !content; menu = menu && content;">
      <slot name="title"></slot>
    </span>
    <transition name="fade">
      <slot name="menu">
        <button v-if="content" @click="menu = !menu" type="button" class="menu-button">
          <Heroicon icon="menu"></Heroicon>
        </button>
      </slot>
    </transition>
  </div>
  <transition name="fade">
    <div v-if="menu" class="drawer-buttons">
      <div class="floatingmenu">
        <slot></slot>
     </div>
    </div>
  </transition>
  <transition
    @before-enter="beforeEnter"
    @enter="enter"
    @leave="leave"
  >
    <div v-if="content" class="drawer-content">
      <slot name="content"></slot>
    </div>
  </transition>
</template>
<style>

.drawer-content {
  overflow: hidden;
}
.rollup-enter-from,
.rollup-leave-to {
  opacity: 0;
  transform: scaleY(0);
}
.rollup-enter-to,
.rollup-leave-from {
  opacity: 1;
  transform: scaleY(1);
}
.rollup-enter-active,
.rollup-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

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

.drawer-buttons {
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
.drawer-header.collapsed {
  border-top-style: dashed;
}
.drawer-header {
  position: relative;
  width: 100%;
  height: 1.3rem;
  text-align: right;
  background-color: white  ;
  border-top: 1px solid gray;
  margin-top: 1rem;
  /* margin-bottom: -0.4rem; */
}
.drawer-header.collapsed span {
  border-style: dashed;
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
