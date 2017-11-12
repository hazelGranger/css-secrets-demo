import Vue from 'vue';
import VueRouter from 'vue-router';
// import VueResource from 'vue-resource'

import App from './app.vue';
// import routermaps from './router';


import Index from './views/index.vue'

Vue.use(VueRouter)
// Vue.use(VueResource)


const routes = [{
  path: '/',
  component: Index
},{
  path: '/index',
  component: Index
}]

const router = new VueRouter({
  routes
})

new Vue({
  el: '#css-secrets-demo',
  router,
  template: '<App/>',
  components: { App }
})
