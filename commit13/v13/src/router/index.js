import Vue from 'vue'
import Router from 'vue-router'
import BootstrapVue from 'bootstrap-vue'

//import bootstap css
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

//import components 
import ClassActivityAdmin from '@/components/ClassActivityAdmin'
import UserAdmin from '@/components/UserAdmin'
import Home from '@/components/Home'
import About from '@/components/About'
import Contact from '@/components/Contact'
import Activities from '@/components/Activities'
import ClassActivityProvider from '@/components/ClassActivityProvider'
import Register from '@/components/Register'
import Login from '@/components/Login'

Vue.use(BootstrapVue)
Vue.use(Router)

//definition of routes and component paths
export default new Router({
  routes: [
    {
      path: '/ClassActivityAdmin',
      name: 'Class Activity Admin',
      component: ClassActivityAdmin
    },
    {
      path: '/UserAdmin',
      name: 'User Admin',
      component: UserAdmin
    },
    {
      path: '/Home',
      name: 'Home',
      component: Home
    },
    {
      path: '/About',
      name: 'About',
      component: About
    },
    {
      path: '/ClassActivityProvider',
      name: 'ClassActivityProvider',
      component: ClassActivityProvider
    },    
    {
      path: '/Activities',
      name: 'Activities',
      component: Activities
    },
    {
      path: '/Register',
      name: 'Register',
      component: Register
    },
    {
      path: '/Contact',
      name: 'Contact',
      component: Contact
    },
    {
      path: "/Login",
      name: "Login",
      component: Login
    }
  ]
})