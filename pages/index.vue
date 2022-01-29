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
            <th class="">Amount</th>
            <th class="">Source</th>
            <th class="">Tags</th>
            <th class="">Tools</th>
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
                <TimeInput :value="t.createdAt" @change="updateValue(t.id, 'createdAt', $event)"/>
              </td>
              <td class="">{{ t.detail }} </td>
              <td class=" text-right">{{ t.amount }}</td>
              <td class="">{{ t.source }}</td>
              <td class="">{{ t.tags }}</td>
              <td class=""></td>
            </tr>
          </tbody>
        </table>
      </m-checkbox-group>
    </m-panel>
  </div>
</template>

<script>
import TimeInput from '../comps/TimeInput.vue';

export default {
  components: {
    TimeInput
  },

  data(){
    return {
      selected: [],

      transactions: [
        { id: 1, detail: 'Initial source', source: 'ABC', amount: 1000, tags: ['abc'], createdAt: '2022/01/29 15:30:00' },
        { id: 2, detail: 'Salary', source: 'Loan/Debt', amount: 500, tags: ['company'], createdAt: '2022/01/30 12:00:00' }
      ]
    }
  },

  methods: {
    updateValue(id, name, value){
      this.$set(this.transactions[id], name, value);
      console.log(this.transactions[id]);
    }
  }
}
</script>

<style>

</style>