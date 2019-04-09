import Vue from 'vue'
import App from './App'
import util from './util/init'
Vue.config.productionTip = false
App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()

