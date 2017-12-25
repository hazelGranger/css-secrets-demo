import Vue from 'vue';
import VueRouter from 'vue-router';
import VueI18n from 'vue-i18n';

import App from './app';
import router from './router/';
import i18n from './i18n/'

// import style files
require('./styles/main.less');

Vue.use(VueRouter);
Vue.use(VueI18n);

new Vue({
  el: '#css-secrets-demo',
  router,
  i18n,
  template: '<App/>',
  components: { App }
})
