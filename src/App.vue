<script setup>
import { inject } from "vue";
import { RouterView } from "vue-router";
import { MDashboardLayout } from "../lib";

const db = inject('db');

const init = async () => {
  await db.init('PefimaDB', 1, {
    budgets: '++id,name,schedule,amount,endAt,createdAt,updatedAt',
    sources: '++id,name,detail,createdAt,updatedAt',
    people: '++id,name,detail,createdAt,updatedAt',
    transactions: '++id,detail,source,amount,category,person,relative,budget,createdAt,updatedAt'
  });

  // remove loader
  document.getElementById('m-loader').classList.add('hidden');
}

const navItems = [
  { type: "link", name: "Home", href: "/", icon: "home" },
];

init();
</script>

<template>
  <MDashboardLayout :items="navItems">
    <RouterView />
  </MDashboardLayout>
</template>
