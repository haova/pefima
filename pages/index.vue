<template>
  <div class="p-4">
    <m-panel>
      <m-checkbox-group
        name="transaction-select-list"
        v-model="selected"
      >
        <table class="m-table text-sm w-full table-fixed">
          <thead class="bg-gray-100">
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
            <!-- Data content -->
            <tr
              v-for="t in [newTransaction, ...sortableTransactions]"
              :key="t.id"
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

            <!-- Total content -->
            <tr class="bg-gray-100">
              <td class="text-center" :rowspan="sources.length + tags.length + 1">
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
          </tbody>
        </table>
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
        tags: {}
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

      return Array.from(ls).filter(i => i);
    },

    tags(){
      const ls = new Set();
      for (let t of this.transactions){
        for (let tag of t.tags || [])
          ls.add(tag);
      }

      return Array.from(ls).filter(i => i);
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

    updateValue(transaction, name, value){
      this.$set(transaction, name, value);
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

        if (t.source){
          sources[t.source] = sources[t.source] || 0;
          sources[t.source] += t.amount;
        }

        if (t.tags){
          for (let tag of t.tags){
            tags[tag] = tags[tag] || 0;
            tags[tag] += t.amount;
          }
        }
        

        total += t.amount;
      }

      this.$set(this.summary, 'total', total);
      this.$set(this.summary, 'sources', sources);
      this.$set(this.summary, 'tags', tags);
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
    await this.$db.deleteDB();
    this.$db.init();
    
    await this.$db.create('transactions', { detail: 'Initial source', source: 'ABC', amount: 1000, tags: ['abc'], createdAt: new Date('2022/01/29 15:30:00') });
    await this.$db.create('transactions', { detail: 'Salary', source: 'Loan/Debt', amount: 500, tags: ['company'], createdAt: new Date('2022/01/30 12:00:00') });

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