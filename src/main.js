import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './app.vue';
import Routers from './router';

Vue.use(VueRouter);

var router = new VueRouter()

Routers(router)

router.start(App,'#css-secrets-demo')
