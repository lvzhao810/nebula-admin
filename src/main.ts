import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Antd from 'ant-design-vue'
import App from './App.vue'
import router from './router'
import 'ant-design-vue/dist/reset.css'
import '@/assets/styles/index.css'
import { useThemeStore } from '@/stores/theme'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(Antd)

// 初始化主题
const themeStore = useThemeStore()
themeStore.initTheme()

app.mount('#app')
