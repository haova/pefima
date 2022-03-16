import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import "./index.css";

import { DbPlugin } from "../lib";

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(DbPlugin);

app.mount("#app");
