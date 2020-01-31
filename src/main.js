import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueFirestore from 'vue-firestore'

Vue.use(VueFirestore, {
  key: 'id',         // the name of the property. Default is '.key'.
  enumerable: true  //  whether it is enumerable or not. Default is true.
})


Vue.config.productionTip = false

Vue.use(VueFirestore)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
