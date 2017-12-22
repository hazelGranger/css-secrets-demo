import VueRouter from 'vue-router'

import routes from './routermaps'
import scrollBehavior from './scrollBehavior'


const router = new VueRouter({
  routes,
  //Here if we import routes as other names, we should use ' routes: othername  '
  scrollBehavior
})

export default router
