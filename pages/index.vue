<template>
  <div class="p-4">
    <m-panel>
      <m-checkbox-group
        name="transaction-select-list"
        v-model="selected"
      >
        <table class="m-table text-sm w-full table-fixed">
          <thead>
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
            <tr
              v-for="t in transactions"
              :key="t.id"
            >
              <td class="w-8 text-center leading-3">
                <m-checkbox :mvalue="t.id" name="transaction-select-list"></m-checkbox>
              </td>
              <td class="w-24 text-center">
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
              <td class="w-36 text-right">
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
              <td class="w-8 text-center">
                <button class="text-red-600">
                  <ion-icon name="trash-outline"></ion-icon>
                </button>
              </td>
            </tr>
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

      transactions: [
        { id: 1, detail: 'Initial source', source: 'ABC', amount: 1000, tags: ['abc'], createdAt: '2022/01/29 15:30:00' },
        { id: 2, detail: 'Salary', source: 'Loan/Debt', amount: 500, tags: ['company'], createdAt: '2022/01/30 12:00:00' },
        { id: 3, detail: '', source: ''}
      ]
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
    }
  },

  methods: {
    updateValue(transaction, name, value){
      this.$set(transaction, name, value);
      console.log(transaction);
    },
  }
}
</script>

<style>

</style>