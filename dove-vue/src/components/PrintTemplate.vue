<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import {v4 as uuidv4} from 'uuid';
import QrcodeVue from 'qrcode.vue'
import ImageThumb from './ImageThumb.vue';
import DicebearIdenticon from './DicebearIdenticon.vue';

const rows = ref(2);
const columns = ref(2);

const codes = ref<string[][]>([[uuidv4(), uuidv4()],[uuidv4(), uuidv4()]])

function newRow() {
  const row: string[] = [];
  for (let index = 0; index < columns.value; index++) {
    row.push(uuidv4());
  }
  codes.value.push(row);
}

function addRows(count: number) {
  for (let index = 0; index < count; index++) {
    newRow();
  }
}

function delRows(count: number) {
  codes.value.splice(codes.value.length - count, count);
}

function addColumns(count: number) {
  codes.value.forEach(row => {
    for (let index = 0; index < count; index++) {
      row.push(uuidv4());
    }
  });
}

function delColumns(count: number) {
  codes.value.forEach(row => {
    row.splice(row.length - count, count);
  });
}

watch(() => rows.value, (n,o) => {
  if (n > o) {
    addRows(n-o);
  } else {
    delRows(o-n);
  }
});

watch(() => columns.value, (n,o) => {
  if (n > o) {
    addColumns(n-o);
  } else {
    delColumns(o-n);
  }
});

const flatCodes = computed(() => codes.value.flat());

function textrows(uuid: string): string[] {
  const parts = uuid.split("-");
  // Controllo minimo (UUID v4 ha 5 parti)
  if (parts.length !== 5) {
    return ["xxxxxxxx", "xxxx-xxxx-xxxx", "xxxxxxxxxxxx"];
  }
  return [parts[0] || '', `${parts[1]}-${parts[2]}-${parts[3]}`, parts[4] || ''];
}

function printCodes() {
  window.print();
}

</script>
<template>
  <div class="fullscreen">
    <div class="controls">
      <div>
        <span>Righe {{ rows }}</span>
        <button @click="rows = rows+1">+</button>
        <button @click="rows = rows-1">-</button>
      </div>
      <div>
        <span>Colonne {{ columns }}</span>
        <button @click="columns = columns+1">+</button>
        <button @click="columns = columns-1">-</button>
      </div>
      <div>
        <button @click="printCodes()">Stampa</button>
      </div>
    </div>
    <div class="preview-area">
      <div class="page-a4 page-a4-portrait">
        <div class="grid"
          :style="{
            gridTemplateRows: `repeat(${rows}, 1fr)`,
            gridTemplateColumns: `repeat(${columns}, 1fr)`
          }"
          >
          <div class="cell" v-for="code in flatCodes">
            <svg viewBox="0 0 100 145" preserveAspectRatio="xMidYMid meet">
              <!-- QR -->
              <foreignObject x="0" y="0" width="100" height="100">
                <qrcode-vue :value="code" :render-as="'svg'" />
              </foreignObject>
              <DicebearIdenticon :uuid="code" format="svg" />
              <!-- Testo -->
              <text v-for="(part, index) in textrows(code)"
                x="50" 
                v-bind:y="120 + index*10" 
                text-anchor="middle" 
                v-bind:font-size="10 + (index > 0? 0: 10)"
              >{{ part }}</text>
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>

.fullscreen {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: auto;
}
.grid {
  flex: 1;
  display: grid;
  /* opzionale: spazio tra etichette */
  gap: 5px;

  /* utile per stampa */
  box-sizing: border-box;
}
.cell {
  border: 1px solid blue;
  display: flex;
  align-items: center;
  justify-content: center;
  /* evita overflow */
  overflow: hidden;
}
.cell svg {
  width: 100%;
  height: 100%;
}

.preview-area {
  width: 100%;
  display: flex;
  justify-content: center; /* centro orizzontale */
  background: lightgray; /* solo per vedere meglio */
}

.page-a4 {
  overflow: hidden;
  background: white;
  border: 1px solid black;
  box-sizing: border-box;
  padding: 25px 10px 25px 2px;
}

.page-a4-portrait {
  /* aspect-ratio: 210 / 297; */
  width: 90vw;
  /* height: 90 * 210 / 297vw; */
  height: 127.28vw;
  max-height: 127.28vw;
}

/* PRINTABLE */

@media print {

  .page-a4 {
    left: 0;
    top: 0;
    margin: 0;
    position: absolute;
    border: 2px solid green;
  }

  .page-a4-portrait {
    width: 100vw;
    height: 141.43vw;
    max-height: 141.43vw;
  }
  
  .controls {
    display: none;
  }

  .cell {
    border: 0;
    /* border: 1px solid yellow; */
  }

  #vue-inspector-container, #__vue-devtools-container__ {
    display: none !important;
  }

}

</style>