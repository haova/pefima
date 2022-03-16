<script setup>
import { reactive, computed, inject, ref } from "vue";
import cronstrue from "cronstrue";
import cronParser from "cron-parser";
import moment from "moment";

import { MInput, MButton, MPanel } from "../../lib";
import { list } from "postcss";

// global
const DATE_FORMAT = 'YYYY-MM-DD';
const db = inject('db');
const today = moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 });

const formatCurrency = (amount, lang='vi-VN', currency='vnd') => {
  const formatter = new Intl.NumberFormat(lang, {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  });

  return formatter.format(amount);
}

// list
const budgets = ref([]);
const sumEveryday = ref(0);

const listBudget = async () => {
  budgets.value = [];
  sumEveryday.value = 0;

  const ls = await db.list('budgets', {});

  for (let item of ls){
    let nextSchedule = moment(cronParser.parseExpression(`0 0 ${item.schedule}`).next().toDate());
    let endAt = item.endAt ? moment(item.endAt, DATE_FORMAT) : null;  
    let next = endAt && endAt.isBefore(nextSchedule) ? endAt : nextSchedule;
    let duration = next.diff(today, 'day');
    let everyday = parseInt(item.amount / duration);

    budgets.value.push({
      ...item,
      duration,
      everyday
    });

    sumEveryday.value += everyday;
  }
}

const download = (filename, text) => {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

const exportDB = async () => {
  const text = await db.exportDB();
  download(`${today.format('YYYYMMDD')} - pefima-budget.txt`, text);
}

listBudget();

// form
const form = reactive({
  detail: '',
  schedule: '* * *',
  amount: 0,
  endAt: ''
});

const resetForm = () => {
  form.detail = '';
  form.schedule = '* * *';
  form.amount = 0;
  form.endAt = '';
}

const scheduleToText = computed(() => {
  try {
    return cronstrue.toString(`0 0 ${form.schedule}`);
  } catch (err) {
    return "Wrong schedule.";
  }
});

const createBudget = async () => {
  const endAt = form.endAt ? moment(form.endAt, DATE_FORMAT) : null;  

  await db.create('budgets', {
    name: form.name,
    schedule: form.schedule,
    amount: parseInt(form.amount),
    endAt: endAt?.format(DATE_FORMAT),
    createdAt: today.format(DATE_FORMAT),
    updatedAt: today.format(DATE_FORMAT)
  });

  resetForm();
  await listBudget();
};
</script>

<template>
  <MPanel>
    <h3 class="text-xl mb-4">Create a new item.</h3>

    <MInput label="Name" v-model="form.name"></MInput>
    Default is schedule at 12AM every date. You only change date schedule (not hour or minute).
    <MInput label="Schedule" v-model="form.schedule"></MInput>
    {{ scheduleToText }}
    <MInput label="Amount" v-model="form.amount"></MInput>
    <MInput label="End At" v-model="form.endAt"></MInput>
    <MButton variant="primary" @click="createBudget">Create</MButton>
  </MPanel>

  <MPanel>
    <h3 class="text-xl mb-4">Budgets</h3>

    <table class="table-auto w-full border-collapse border border-gray-200 mb-4">
      <thead>
        <th class="border border-slate-200 py-2 px-4">Name</th>
        <th class="border border-slate-200 py-2 px-4">Schedule</th>
        <th class="border border-slate-200 py-2 px-4">Amount</th>
        <th class="border border-slate-200 py-2 px-4">End At</th>
        <th class="border border-slate-200 py-2 px-4">Duration</th>
        <th class="border border-slate-200 py-2 px-4">Everyday</th>
        <th class="border border-slate-200 py-2 px-4">Tools</th>
      </thead>
      <tbody>
        <tr>
          <td class="border border-slate-200 py-2 px-4 font-semibold text-right" colspan="5">Total</td>
          <td class="border border-slate-200 py-2 px-4 font-mono text-right">{{ formatCurrency(sumEveryday) }}</td>
        </tr>
        <tr v-for="item in budgets" :key="`budget-${item.id}`">
          <td class="border border-slate-200 py-2 px-4">{{ item.name }}</td>
          <td class="border border-slate-200 py-2 px-4 text-center">{{ item.schedule }}</td>
          <td class="border border-slate-200 py-2 px-4 font-mono text-right">{{ formatCurrency(item.amount) }}</td>
          <td class="border border-slate-200 py-2 px-4">{{ item.endAt }}</td>
          <td class="border border-slate-200 py-2 px-4 text-right">{{ item.duration }} day(s)</td>
          <td class="border border-slate-200 py-2 px-4 font-mono text-right">{{ formatCurrency(item.everyday) }}</td>
          <td class="border border-slate-200 py-2 px-4"></td>
        </tr>
      </tbody>
    </table>

    <MButton variant="primary" @click="exportDB">Export</MButton>
  </MPanel>
</template>
