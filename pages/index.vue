<template>
  <div class="p-4">
    <m-panel>
      <m-checkbox-group
        name="transaction-select-list"
        v-model="selected"
      >
        <!-- Me -->
        <div 
          class="h-2 my-12 relative"
          v-if="summary.me"
        >
          <div
            class="h-2 absolute bg-purple-400"
            :style="{ width: `${(summary.mePercent.lend || .2) - .2}%` }"
          ></div>
          <div
            class="h-2 absolute bg-cyan-400"
            :style="{ width: `${(summary.mePercent.own || .2) - .2}%`, left: `${summary.mePercent.lend}%` }"
          ></div>
          <div
            class="h-2 absolute bg-red-400 right-0"
            :style="{ width: `${summary.mePercent.borrow}%` }"
          ></div>

          <div
            class="absolute text-xs font-bold top-[-2em] whitespace-nowrap
              before:border-1 before:w-full before:block before:h-1 before:border before:border-current before:border-b-0 before:bottom-[-.5em] before:absolute
              text-purple-600 left-0 text-left"
            :style="{ width: `${(summary.mePercent.lend || .2) - .2}%` }"
          >Lend: {{ formatCurrency(summary.me.lend) }}</div>
          <div
            class="absolute text-xs font-bold top-[-2em] whitespace-nowrap
              before:border-1 before:w-full before:block before:h-1 before:border before:border-current before:border-b-0 before:bottom-[-.5em] before:absolute
              text-cyan-600 text-center"
            :style="{ width: `${(summary.mePercent.own || .2) - .2}%`, left: `${summary.mePercent.lend}%` }"
          >Own: {{ formatCurrency(summary.me.own) }}</div>
          <div
            class="absolute text-xs font-bold top-[-2em] whitespace-nowrap
              before:border-1 before:w-full before:block before:h-1 before:border before:border-current before:border-b-0 before:bottom-[-.5em] before:absolute
              text-red-600 right-0 text-right"
            dir="rtl"
            :style="{ width: `${summary.mePercent.borrow}%` }"
          >
            <span dir="ltr">
              Borrow: {{ formatCurrency(summary.me.borrow) }}
            </span>
          </div>

          <div
            class="absolute text-xs font-bold bottom-[-2.5em] whitespace-nowrap
              before:border-1 before:w-full before:block before:h-1 before:border before:border-current before:border-t-0 before:top-[-1em] before:absolute
              text-orange-600 text-left"
            :style="{ width: `${summary.mePercent.own + summary.mePercent.lend - .2}%` }"
          >Future: {{ formatCurrency(summary.me.own + summary.me.lend) }}</div>

          <div
            class="absolute text-xs font-bold bottom-[-2.5em] whitespace-nowrap
              before:border-1 before:w-full before:block before:h-1 before:border before:border-current before:border-t-0 before:top-[-.5em] before:absolute
              text-emerald-600 text-right right-0"
            :style="{ width: `${summary.mePercent.own + summary.mePercent.borrow}%` }"
            dir="rtl"
          >
            <span dir="ltr">
              Current: {{ formatCurrency(summary.me.own + summary.me.borrow) }}
            </span>
          </div>

          <div
            class="absolute text-xs font-bold top-[-4em]
              before:border-1 before:w-full before:block before:h-1 before:border before:border-current before:border-b-0 before:bottom-[-.5em] before:absolute
              text-black text-center w-full"
          >Available: {{ formatCurrency(summary.me.total) }}</div>
        </div>
        <!-- End Me -->

        <!-- Data table -->
        <table class="m-table text-sm w-full table-fixed">
          <thead class="bg-gray-200">
            <th class="w-8 leading-3">
              <m-checkbox-control 
                name="transaction-select-list"
                :items="transactions.map(t => t.id)"
              ></m-checkbox-control>
            </th>
            <th class="w-24">Time</th>
            <th class="">Detail</th>
            <th class="w-36">Amount</th>
            <th class="">Source</th>
            <th class="">Tags</th>
            <th class="w-8">
              <ion-icon name="build-outline"></ion-icon>
            </th>
          </thead>
          <tbody>
            <!-- Total content -->
            <tr class="bg-gray-100">
              <td class="text-center" :rowspan="isSummary ? (sources.length + tags.length + 1) : 1">
                <button class="p-0" @click="isSummary = !isSummary">
                  <ion-icon name="pie-chart-outline"></ion-icon>
                </button>
              </td>
              <td class="text-right" colspan="2"><b>Total</b></td>
              <td class="text-right">
                <CurrencyInput 
                  :value="summary.total"
                  :readonly="true"
                  class="text-right"
                />
              </td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <!-- End Total content -->

            <!-- Source Total -->
            <tr
              class="bg-gray-50"
              v-for="(source, index) in (isSummary ? sources : [])"
              :key="`source-${source}`"
            >
              <td 
                v-if="index === 0"
                :rowspan="sources.length"
                class="font-bold text-center"
              >
                Sources
              </td>
              <td class="text-right">{{ source }}</td>
              <td class="text-right">
                <CurrencyInput 
                  :value="summary.sources[source]"
                  :readonly="true"
                  class="text-right"
                />
              </td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <!-- End Source Total -->

            <!-- Tags Total -->
            <tr
              class="bg-gray-100"
              v-for="(tag, index) in (isSummary ? tags : [])"
              :key="`tag-${tag}`"
            >
              <td 
                v-if="index === 0"
                :rowspan="tags.length"
                class="font-bold text-center"
              >
                Tags
              </td>
              <td class="text-right">{{ tag }}</td>
              <td class="text-right">
                <CurrencyInput 
                  :value="summary.tags[tag]"
                  :readonly="true"
                  class="text-right"
                />
              </td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <!-- End Tags Total -->

            <!-- Data content -->
            <tr
              v-for="t in [newTransaction, ...sortableTransactions]"
              :key="t.id"
              :class="t.id !== 'new' && !t.source ? 'opacity-40' : ''"
            >
              <td class="text-center leading-3">
                <m-checkbox :mvalue="t.id" name="transaction-select-list" v-if="t.id !== 'new'"></m-checkbox>
                <button class="p-0" v-if="t.id === 'new'" @click="createTransaction">
                  <ion-icon name="add-outline"></ion-icon>
                </button>
              </td>
              <td class="text-center">
                <TimeInput 
                  :value="t.createdAt" 
                  @change="updateValue(t, 'createdAt', $event)"
                />
              </td>
              <td class="">
                <TextInput 
                  :value="t.detail" 
                  @change="updateValue(t, 'detail', $event)"
                />
              </td>
              <td class="text-right">
                <CurrencyInput 
                  class="text-right" 
                  :value="t.amount" 
                  @change="updateValue(t, 'amount', $event)"
                />
              </td>
              <td class="">
                <SelectInput
                  :value="t.source" 
                  :options="sources"
                  @change="updateValue(t, 'source', $event)"
                />
              </td>
              <td class="">
                <TagInput
                  :value="t.tags" 
                  :options="tags"
                  @change="updateValue(t, 'tags', $event)"
                />
              </td>
              <td class="text-center">
                <button class="text-red-600" @click="removeTransaction(t)">
                  <ion-icon name="trash-outline"></ion-icon>
                </button>
              </td>
            </tr>
            <!-- End Data content -->
          </tbody>
        </table>
        <!-- End Data table -->
      </m-checkbox-group>
    </m-panel>
  </div>
</template>

<script>
import TimeInput from '../comps/TimeInput.vue';
import TextInput from '../comps/TextInput.vue';
import CurrencyInput from '../comps/CurrencyInput.vue';
import SelectInput from '../comps/SelectInput.vue';
import TagInput from '../comps/TagInput.vue';

const DEFAULT_TRANSACTION = {
  detail: '',
  amount: 0,
  source: null,
  tags: []
}

export default {
  components: {
    TimeInput,
    TextInput,
    CurrencyInput,
    SelectInput,
    TagInput
  },

  data(){
    return {
      selected: [],
      transactions: [],
      isSummary: false,
      summary: {
        total: 0,

        sources: {},
        tags: {},

        me: {},
        mePercent: {}
      },

      newTransaction: {
        ...DEFAULT_TRANSACTION,
        id: 'new',
        createdAt: new Date()
      }
    }
  },

  computed: {
    sources(){
      const ls = new Set();
      for (let t of this.transactions){
        ls.add(t.source);
      }

      return Array.from(ls).filter(i => i).sort();
    },

    tags(){
      const ls = new Set();
      for (let t of this.transactions){
        for (let tag of t.tags || [])
          ls.add(tag);
      }

      return Array.from(ls).filter(i => i).sort();
    },

    sortableTransactions(){
      return this.transactions.sort((a, b) => {
        if (a.createdAt > b.createdAt) {
          return -1;
        }
        if (a.createdAt < b.createdAt) {
          return 1;
        }
        return 0;
      });
    },
  },

  methods: {
    formatCurrency(value){
      return this.$utils.formatCurrency(value);
    },

    async updateValue(transaction, name, value){
      this.$set(transaction, name, value);

      this.$loader.start();
      await this.$db.update('transactions', transaction.id, transaction);
      this.$loader.end();
    },

    async load(){
      this.$loader.start();

      this.transactions = await this.$db.list('transactions', { $limit: -1 });

      this.$loader.end();
    },

    calcSelectedSummary(){
      let total = 0;
      let sources = {};
      let tags = {};

      for (let t of this.transactions){
        if (this.selected.length !== 0 && this.selected.indexOf(t.id) === -1)
          continue;

        if (t.tags){
          for (let tag of t.tags){
            tags[tag] = tags[tag] || 0;
            tags[tag] += t.amount;
          }
        }

        if (!t.source)
          continue;
        
        sources[t.source] = sources[t.source] || 0;
        sources[t.source] += t.amount;

        total += t.amount;
      }

      this.$set(this.summary, 'total', total);

      this.$set(this.summary, 'sources', sources);
      this.$set(this.summary, 'tags', tags);

      this.$set(this.summary, 'me', {
        total: total + Math.abs(tags.Lend || 0),
        lend: Math.abs(tags.Lend || 0),
        borrow: Math.abs(tags.Borrow || 0),
        own: total - Math.abs(tags.Borrow || 0)
      });

      this.$set(this.summary, 'mePercent', {
        total: 100,
        lend: this.summary.me.lend/this.summary.me.total*100,
        borrow: this.summary.me.borrow/this.summary.me.total*100,
        own: this.summary.me.own/this.summary.me.total*100,
      });
    },

    initNewTransaction(){
      return this.newTransaction = {
        ...DEFAULT_TRANSACTION,
        id: 'new',
        createdAt: new Date()
      }
    },

    async createTransaction(){
      this.$loader.start();

      delete this.newTransaction.id;
      const id = await this.$db.create('transactions', this.newTransaction);
      this.initNewTransaction();

      this.transactions.push(await this.$db.get('transactions', id));

      this.$loader.end();
    },

    async removeTransaction(t){
      if (t.id === 'new'){
        return this.initNewTransaction();
      }

      this.$loader.start();

      await this.$db.remove('transactions', t.id);

      const pos = this.transactions.indexOf(t);
      this.transactions.splice(pos, 1);

      this.$loader.end();
    }
  },

  async mounted(){
    await this.load();
  },

  watch: {
    transactions: {
      handler(){
        this.calcSelectedSummary();
      },
      deep: true
    },

    selected: {
      handler(){
        this.calcSelectedSummary();
      },
      deep: true
    },
  }
}
</script>

<style>

</style>