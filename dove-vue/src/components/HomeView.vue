<script setup lang="ts">

import { onMounted, reactive, ref } from 'vue'
import NodeDetails from '../components/NodeDetails.vue';
import { MinionItem } from '../models/minion-item';
import LoginForm from '../components/LoginForm.vue';
import { useLoggedUser } from '../stores/logged-user';
import { useBackendConfig } from '../stores/backend-config';

const loggedUser = useLoggedUser();
const backend = useBackendConfig();
const countervalue = {
  count: 0
};
const counter = reactive(countervalue)

console.log(counter.count) // 0

countervalue.count = 10;
//counter.count++

const minions: MinionItem[] = reactive([])

function addOne() {
  if (newMinion.name) {
    minions.push(newMinion.clone());
    newMinion.name = '';
  }
}

const newMinion: MinionItem = new MinionItem('');
const theMinionNameInput = ref(null);
const theListOfMinions = ref(null);

onMounted(() => {
  console.log('onMounted 1', theMinionNameInput);
  console.log(theMinionNameInput, theListOfMinions);
  console.log(theMinionNameInput.value);
});

onMounted(() => {
  console.log('onMounted 2', theMinionNameInput);
  console.log(theMinionNameInput, theListOfMinions);
});

function minionSpeaks(minion: MinionItem) {
  console.log('minionSpeaks', minion);
}

</script>

<template>
  <h1>You did it!</h1>

  <div>{{ backend.backend }}</div>
  <div v-if="loggedUser.user.username">
    {{ loggedUser.user.username }}
  </div>
  <div v-else="">
    <LoginForm></LoginForm>
  </div>

  <p>
    Visit <a href="https://vuejs.org/" target="_blank" rel="noopener">vuejs.org</a> to read the
    documentation
  </p>
  <div>Counter: {{counter.count}}</div>
  <div>Minion name <input ref="theMinionNameInput" v-model.trim="newMinion.name" type="text" placeholder="Pick a name" /></div>
  <div ref="theListOfMinions">
    <div v-for="m in minions">
      <span>{{ m.name }}</span>
      <span v-if="m.name == 'Dave'">(Oh, this is a famous name)</span>
      <NodeDetails :minion="m" @speaks="(event) => minionSpeaks(event)">
        <span>a vortigon Gun</span>
      </NodeDetails>
    </div>
  </div>

  <button @click="addOne">Aggiungi +1</button>

</template>

<style scoped></style>
