
import routes from '../router/routermaps'

const gaSettings = {
  id: 'UA-111721364-1',
  routes,
  autoTracking: {
    pageviewTemplate (route) {
      return {
        page: route.path,
        title: document.title,
        location: window.location.href
      }
    }
  }
}

export default gaSettings
