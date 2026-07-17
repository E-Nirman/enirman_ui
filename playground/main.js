import { createApp } from 'vue'
import { createRouter, createMemoryHistory } from 'vue-router'
import App from './App.vue'
import '../src/theme.css'
import './tailwind.css'

/* Memory router so components using <router-link> (StatCard `to`, etc.)
   can mount without a real app shell. */
const router = createRouter({
  history: createMemoryHistory(),
  routes: [{ path: '/', component: { template: '<div />' } }],
})

createApp(App).use(router).mount('#app')
