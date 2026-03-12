import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/css/tailwind.css' 
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')

router.beforeEach((to, from, next) => {
  NProgress.start()
  next()
})

router.afterEach(() => {
  NProgress.done()
})