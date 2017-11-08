const routers = {
  '/index': {
    component() {
      require(['./views/index.vue'],resolve)
    }
  }
}

export default routers;
