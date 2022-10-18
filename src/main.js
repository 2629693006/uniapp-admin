import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'

// API
import axios from '@/API/axios'
import API from '@/API/api'
Vue.prototype.$http = axios
Vue.prototype.API = API

// Storage
import Storage from '@/assets/js/Storage'
Vue.prototype.Storage = Storage

// 全局注册
import Bread from '@/components/bread/bread'
import TagName from '@/components/tagName/tagname'
import Pagiation from '@/components/pagiation/pagiation'
Vue.component('bread-block', Bread)
Vue.component('tag-block', TagName)
Vue.component('pagiation-block', Pagiation)

// 富文本
import mavonEditor from 'mavon-editor';
import 'mavon-editor/dist/css/index.css';
Vue.use(mavonEditor);


import '@/assets/css/default.css'

Vue.config.productionTip = false

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')