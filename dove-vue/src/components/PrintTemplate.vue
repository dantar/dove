<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import {v4 as uuidv4} from 'uuid';
import QrcodeVue from 'qrcode.vue'
import { makeIdenticon } from '@/services/dicebear-identicon';

const rows = ref(2);
const columns = ref(2);

interface Trbl {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

const padding = ref<Trbl>({top: 5, right:5, bottom: 5, left:5});
const gapRows = ref(5);
const gapColumns = ref(5);

const codes = ref<string[][]>([[uuidv4(), uuidv4()],[uuidv4(), uuidv4()]])

function codeWidth(): number {
  const available = (210 - padding.value.left - padding.value.right);
  return ((available + gapColumns.value) / columns.value) - gapColumns.value;
}

function codeHeight(): number {
  const available = (297 - padding.value.top - padding.value.bottom);
  return ((available + gapRows.value) / rows.value) - gapRows.value;
}

function codeSize(): number {
  const w = codeWidth();
  const h = codeHeight();
  return w < h? w : h;
}

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
    <div class="controls noprint">
      <div>
        <span>Righe {{ rows }}</span>
        <button @click="rows = rows+1">+</button>
        <button @click="rows = rows-1">-</button>
      </div>
      <div>
        <span>Colonne {{ columns }}</span>
        <button @click="columns++">+</button>
        <button @click="columns--">-</button>
      </div>
      <div>
        <button @click="printCodes()">Stampa</button>
      </div>
      <div>
        <span>
          <button @click="gapRows--">-</button>
          <input class="trbl" type="number" v-model="gapRows" size="3"/>
          <button @click="gapRows++">+</button>
        </span>
        <span>
          <button @click="gapColumns--">-</button>
          <input class="trbl" type="number" v-model="gapColumns" size="3"/>
          <button @click="gapColumns++">+</button>
        </span>
      </div>
    </div>
    <div class="control-area" style="position: relative;">
      <span class="control tlbr tlbr-top noprint">
        <span>
          <button @click="padding.top--">-</button>
          <input class="trbl" type="number" v-model="padding.top" size="3"/>
          <button @click="padding.top++">+</button>
        </span>
      </span>
      <span class="control tlbr tlbr-bottom noprint">
        <span>
          <button @click="padding.bottom--">-</button>
          <input class="trbl" type="number" v-model="padding.bottom" size="3"/>
          <button @click="padding.bottom++">+</button>
        </span>
      </span>
      <span class="control tlbr tlbr-left noprint">
        <span>
          <button @click="padding.left--">-</button>
          <input class="trbl" type="number" v-model="padding.left" size="3"/>
          <button @click="padding.left++">+</button>
        </span>
      </span>
      <span class="control tlbr tlbr-right noprint">
        <span>
          <button @click="padding.right--">-</button>
          <input class="trbl" type="number" v-model="padding.right" size="3"/>
          <button @click="padding.right++">+</button>
        </span>
      </span>
      <div class="preview-area">
        <svg viewBox="0 0 210 297" preserveAspectRatio="xMidYMid meet">
          <g v-for="(row, ridx) in codes">
            <g v-for="(code, cidx) in row">
              <rect fill="yellow" class="noprint"
                v-bind="{
                  x: (padding.left + cidx * (codeWidth() + gapColumns)), 
                  y: (padding.top + ridx * (codeHeight() + gapRows)),
                  width: codeWidth(),
                  height: codeHeight(),
                  }"
              ></rect>
              <foreignObject
                v-bind="{
                  x: (padding.left + cidx * (codeWidth() + gapColumns)) + (codeWidth() - codeSize()) / 2, 
                  y: (padding.top + ridx * (codeHeight() + gapRows)) + (codeHeight() - codeSize()) / 2,
                  width: codeSize(),
                  height: codeSize(),
                  }"
              >
                <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
                  <rect x="0" y="0" width="100" height="100" fill="white"></rect>
                  <!-- QR -->
                  <foreignObject x="0" y="0" width="48" height="48">
                    <qrcode-vue :value="code" :render-as="'svg'" :size="48" />
                  </foreignObject>
                  <foreignObject x="52" y="0" width="48" height="48" v-html="makeIdenticon(code)" />
                  <!-- Testo -->
                  <text v-for="(part, index) in textrows(code)"
                    x="50" 
                    v-bind:y="70 + index*14" 
                    text-anchor="middle" 
                    v-bind:font-size="13 + (index > 0? 0: 10)"
                  >{{ part }}</text>
                </svg>
              </foreignObject>
            </g>
          </g>
        </svg>
      </div>
    </div>
  </div>
</template>
<style scoped>

input.trbl{
  width: 3em;
  text-align: center;
}

.control.tlbr {
  position: absolute;
}
.tlbr-top {
  top: 0;
  left: 50%;
}
.tlbr-bottom {
  bottom: 0;
  left: 50%;
}
.tlbr-left {
  left: 0;
  top: 50%;
}
.tlbr-right {
  right: 0;
  top: 50%;
}

.fullscreen {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.preview-area {
  width: 100%;
  display: flex;
  justify-content: center; /* centro orizzontale */
  flex-direction: column;
  background: lightgray; /* solo per vedere meglio */
}

.page-a4 {
  /* overflow: hidden; */
  background: white;
  border: 1px solid black;
  box-sizing: border-box;
}

/* PRINTABLE */

@media print {

  .page-a4 {
    left: 0;
    top: 0;
    margin: 0;
    width: 100vw;
    position: fixed;
    /* border: 1px solid gray; */
  }

  .controls, .noprint, .header {
    display: none;
  }

  #vue-inspector-container, #__vue-devtools-container__ {
    display: none !important;
  }

}

</style>