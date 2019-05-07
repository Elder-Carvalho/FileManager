import Vue from 'vue';
import './plugins/vuetify'
import App from './App.vue';
import router from './router';
import store from './store';
import './registerServiceWorker';
import http from './http'

Vue.config.productionTip = false;

Vue.$http = Vue.prototype.$http = http

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
