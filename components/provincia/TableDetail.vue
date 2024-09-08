<template>
  <v-card>
    <v-card-text class="pa-0">
      <v-table class="pa-0">
        <thead>
        <tr>
          <th>Codice</th>
          <th v-for="(label, index) in extraHeaders" :key="index">{{ label }}</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(row, rowIndex) in tableData" :key="rowIndex">
          <td>
            <v-chip :color=getColor(row.color).text
            >
              <h4>{{ uppercaseFirstLetter(row.color) }}</h4>
            </v-chip>
          </td>
          <td v-for="(label, colIndex) in extraHeaders" :key="colIndex">
            <v-chip :color=getColor(row.color).text
            >
              <h4>{{ row.extra[label]?.value ?? '-' }} </h4>
            </v-chip>
          </td>
        </tr>
        </tbody>
      </v-table>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { uppercaseFirstLetter } from '~/utils/string-utils';

export default defineComponent({
  name: 'TableDetail',
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  computed: {
    extraHeaders() {
      const colorOrder = ['rosso', 'giallo', 'arancione', 'verde', 'azzurro', 'bianco', 'totali'];
      const headersSet = new Set<string>();

      colorOrder.forEach(color => {
        const extra = this.data[color]?.extra;
        if (extra) {
          Object.keys(extra).forEach(key => {
            headersSet.add(extra[key].label);
          });
        }
      });

      if (headersSet.size === 0) {
        headersSet.add('Pazienti in attesa');
      }

      return Array.from(headersSet);
    },

    tableData() {
      const colorOrder = ['rosso', 'giallo', 'arancione', 'verde', 'azzurro', 'bianco', 'totali'];

      return colorOrder.map(color => {
        const extra = this.data[color]?.extra;

        if (!this.data[color]) {
          return null;
        }

        let extraData = {};
        if (!extra) {
          extraData = {
            'Pazienti in attesa': {
              label: 'Pazienti in attesa',
              value: this.data[color].value || 0,
            },
          };
        } else {
          extraData = {};

          this.extraHeaders.forEach(headerLabel => {
            const entry = Object.values(extra).find(item => item.label === headerLabel);
            extraData[headerLabel] = entry || null;
          });
        }

        return {
          color,
          extra: extraData,
        };
      }).filter(row => row !== null); // Filtra fuori le righe vuote
    },

  },

  methods: {
    getColor(codice: string) {
      switch (codice) {
        case 'rosso':
          return { textColor: 'text-red', text: 'red' };
        case 'giallo':
          return { textColor: 'text-yellow', text: 'yellow' };
        case 'verde':
          return { textColor: 'text-green', text: 'green' };
        case 'arancione':
          return { textColor: 'text-orange', text: 'orange' };
        case 'azzurro':
          return { textColor: 'text-blue', text: 'blue' };
        default:
          return { textColor: 'text-white', text: 'white' };
      }
    },
  },
});
</script>