import Vue from 'vue';
import VueRouter from 'vue-router';

import App from './app.vue';
import router from './router/';

// import style files
require('./styles/main.less');

Vue.use(VueRouter);

new Vue({
  el: '#css-secrets-demo',
  router,
  template: '<App/>',
  components: { App }
})
