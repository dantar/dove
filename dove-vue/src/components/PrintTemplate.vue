<script setup lang="ts">
import { ref, watch } from 'vue';
import {v4 as uuidv4} from 'uuid';
import QrcodeVue from 'qrcode.vue'
import { makeIdenticon } from '@/services/dicebear-identicon';
import { useBackendConfig } from '@/stores/backend-config';

const rows = ref(2);
const columns = ref(2);
const pages = ref(1);
const prefix = ref( '' + useBackendConfig().backend );

function prefixCode(uuid: string): string {
  return `${prefix.value}/qr/${uuid}`;
}

interface Trbl {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

const padding = ref<Trbl>({top: 5, right:5, bottom: 5, left:5});
const gapRows = ref(5);
const gapColumns = ref(5);

const codes = ref<string[][][]>([[[uuidv4(), uuidv4()],[uuidv4(), uuidv4()]]])

const qrFormat = ref('landscape');
const qrBaseWidth = ref(100);
const qrBaseHeight = ref(60);

function toggleFormat() {
  if (qrFormat.value == 'landscape') {
    qrFormat.value = 'square';
    qrBaseHeight.value = 100;
    qrBaseWidth.value = 100;
  } else if (qrFormat.value == 'square') {
    qrFormat.value = 'portrait';
    qrBaseHeight.value = 80;
    qrBaseWidth.value = 60;
  } else if (qrFormat.value == 'portrait') {
    qrFormat.value = 'landscape';
    qrBaseHeight.value = 60;
    qrBaseWidth.value = 100;
  } 
}

function cellWidth(): number {
  const available = (210 - padding.value.left - padding.value.right);
  return ((available + gapColumns.value) * 1.0 / columns.value) - gapColumns.value;
}

function cellHeight(): number {
  const available = (297 - padding.value.top - padding.value.bottom);
  return ((available + gapRows.value) * 1.0 / rows.value) - gapRows.value;
}

function codeWidth(): number {
  const w = cellWidth();
  const h = cellHeight();
  return (w * qrBaseHeight.value > h * qrBaseWidth.value) ? (qrBaseWidth.value * h * 1.0 / qrBaseHeight.value): w;
}

function codeHeight(): number {
  const w = cellWidth();
  const h = cellHeight();
  return (w * qrBaseHeight.value > h * qrBaseWidth.value) ? h : ((qrBaseHeight.value * w * 1.0) / qrBaseWidth.value);
}

function newRow() {
  for (let pidx = 0; pidx < pages.value; pidx++) {
    const row: string[] = [];
    for (let index = 0; index < columns.value; index++) {
      row.push(uuidv4());
    }
    codes.value[pidx]?.push(row);
  }
}

function addRows(count: number) {
  for (let index = 0; index < count; index++) {
    newRow();
  }
}

function delRows(count: number) {
  for (let pidx = 0; pidx < pages.value; pidx++) {
    codes.value[pidx]?.splice(codes.value[pidx]?.length || 0 - count, count);
  }
}

function addColumns(count: number) {
  for (let pidx = 0; pidx < pages.value; pidx++) {
    codes.value[pidx]?.forEach(row => {
      for (let index = 0; index < count; index++) {
        row.push(uuidv4());
      }
    });
  }
}

function delColumns(count: number) {
  for (let pidx = 0; pidx < pages.value; pidx++) {
    codes.value[pidx]?.forEach(row => {
      row.splice(row.length - count, count);
    });
  }
}

function addPage() {
  const page:string[][] = [];
  for (let pidx = 0; pidx < rows.value; pidx++) {
    const row:string[] = [];
    for (let cidx = 0; cidx < columns.value; cidx++) {
      row.push(uuidv4());
    }
    page.push(row);
  }
  codes.value.push(page);
}

function addPages(count: number) {
  for (let pidx = 0; pidx < count; pidx++) {
    addPage();
  }
}

function delPages(count: number) {
  codes.value.splice(codes.value.length - count, count);
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

watch(() => pages.value, (n,o) => {
  if (n > o) {
    addPages(n-o);
  } else {
    delPages(o-n);
  }
});

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
  <div>
    <div class="controls noprint">
      <div>
        <span>Prefisso</span>
        <input type="text" v-model="prefix"/>
        <span>Formato</span>
        <button @click="toggleFormat()">{{ qrFormat }}</button>
      </div>
      <div>
        <span>Pagine</span>
        <button @click="pages--">-</button>
        <input class="trbl" type="number" v-model="pages" size="2"/>
        <button @click="pages++">+</button>
        <span>Righe</span>
        <button @click="rows--">-</button>
        <input class="trbl" type="number" v-model="rows" size="2"/>
        <button @click="rows++">+</button>
        <span>Colonne</span>
        <button @click="columns--">-</button>
        <input class="trbl" type="number" v-model="columns" size="2"/>
        <button @click="columns++">+</button>
      </div>
      <div>
        <span>
          <span>Gap righe</span>
          <button @click="gapRows--">-</button>
          <input class="trbl" type="number" v-model="gapRows" size="3"/>
          <button @click="gapRows++">+</button>
        </span>
        <span>
          <span>Gap colonne</span>
          <button @click="gapColumns--">-</button>
          <input class="trbl" type="number" v-model="gapColumns" size="3"/>
          <button @click="gapColumns++">+</button>
        </span>
      </div>
      <div>
        <span>
          <span>top</span>
          <button @click="padding.top--">-</button>
          <input class="trbl" type="number" v-model="padding.top" size="3"/>
          <button @click="padding.top++">+</button>
        </span>
        <span>
          <span>bottom</span>
          <button @click="padding.bottom--">-</button>
          <input class="trbl" type="number" v-model="padding.bottom" size="3"/>
          <button @click="padding.bottom++">+</button>
        </span>
      </div>
      <div>
        <span>
          <span>left</span>
          <button @click="padding.left--">-</button>
          <input class="trbl" type="number" v-model="padding.left" size="3"/>
          <button @click="padding.left++">+</button>
        </span>
        <span>
          <span>right</span>
          <button @click="padding.right--">-</button>
          <input class="trbl" type="number" v-model="padding.right" size="3"/>
          <button @click="padding.right++">+</button>
        </span>
      </div>
      <div>
        <button @click="printCodes()">Stampa</button>
      </div>
      <div>Cell {{ cellWidth() }}x{{ cellHeight() }} ratio {{ cellWidth() / cellHeight() }}</div>
      <div>Code {{ codeWidth() }}x{{ codeHeight() }} ratio {{ codeWidth() / codeHeight() }}</div>
    </div>
    <div class="printfullpage">
      <svg v-for="page in codes" viewBox="0 0 210 297" preserveAspectRatio="xMidYMid meet" class="fullpage">
        <rect x="0" y="0" width="210" height="297" fill="orange" class="noprint"></rect>
        <rect x="0" y="0" width="210" :height="padding.top || 0" fill="brown" class="noprint"></rect>
        <rect :y="297 - padding.bottom || 0" x="0" width="210" :height="padding.bottom || 0" fill="brown" class="noprint"></rect>
        <rect x="0" y="0" :width="padding.left || 0" height="297" fill="brown" class="noprint"></rect>
        <rect y="0" :x="210 - padding.right || 0" :width="padding.right || 0" height="297" fill="brown" class="noprint"></rect>
        <g v-for="(row, ridx) in page">
          <g v-for="(code, cidx) in row">
            <rect fill="yellow" class="noprint"
              v-bind="{
                x: (padding.left + cidx * (cellWidth() + gapColumns)), 
                y: (padding.top + ridx * (cellHeight() + gapRows)),
                width: cellWidth(),
                height: cellHeight(),
                }"
            ></rect>
            <foreignObject
              v-bind="{ 
                x: (padding.left + cidx * (cellWidth() + gapColumns)) + Math.max((cellWidth() - codeWidth()), 0) / 2, 
                y: (padding.top + ridx * (cellHeight() + gapRows)) + Math.max((cellHeight() - codeHeight()), 0) / 2,
                width: codeWidth(),
                height: codeHeight(),
                }"
            >
              <svg v-if="qrFormat == 'square'" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
                <rect x="0" y="0" width="100" height="100" fill="white"></rect>
                <!-- QR -->
                <foreignObject x="0" y="0" width="48" height="48">
                  <qrcode-vue :value="prefixCode(code)" :render-as="'svg'" :size="48" />
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
              <svg v-if="qrFormat == 'landscape'" viewBox="0 0 100 60" preserveAspectRatio="xMidYMid meet">
                <rect x="0" y="0" width="100" height="60" fill="white"></rect>
                <!-- QR -->
                <foreignObject x="1" y="1" width="58" height="58">
                  <qrcode-vue :value="prefixCode(code)" :render-as="'svg'" :size="58" />
                </foreignObject>
                <foreignObject x="60" y="1" width="38" height="38" v-html="makeIdenticon(code)" />
                <!-- Testo -->
                <text v-for="(part, index) in textrows(code)"
                  x="79" 
                  v-bind:y="46 + index*6" 
                  text-anchor="middle" 
                  v-bind:font-size="5 + (index > 0? 0: 3)"
                >{{ part }}</text>
              </svg>
              <svg v-if="qrFormat == 'portrait'" viewBox="0 0 60 80" preserveAspectRatio="xMidYMid meet">
                <rect x="0" y="0" width="60" height="80" fill="white"></rect>
                <!-- QR -->
                <foreignObject x="1" y="1" width="59" height="59">
                  <qrcode-vue :value="prefixCode(code)" :render-as="'svg'" :size="58" />
                </foreignObject>
                <foreignObject x="1" y="61" width="17" height="17" v-html="makeIdenticon(code)" />
                <!-- Testo -->
                <text v-for="(part, index) in textrows(code)"
                  x="40" 
                  v-bind:y="68 + index*5" 
                  text-anchor="middle" 
                  v-bind:font-size="5 + (index > 0? 0: 3)"
                >{{ part }}</text>
              </svg>
            </foreignObject>
          </g>
        </g>
      </svg>
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

/* PRINTABLE */

@media print {

  svg.fullpage {
    display: block;
  }

  .printfullpage {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    /* height: 100vh; */
    /* overflow: auto; */
  }

  .controls, .noprint {
    display: none;
  }

  #vue-inspector-container, #__vue-devtools-container__ {
    display: none !important;
  }

}

</style>