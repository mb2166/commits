import Vue from 'vue'
import Router from 'vue-router'
import BootstrapVue from 'bootstrap-vue'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import ClassActivityAdmin from '@/components/ClassActivityAdmin'
import UserAdmin from '@/components/UserAdmin'
import Home from '@/components/Home'
import About from '@/components/About'
import Contact from '@/components/Contact'
import Signin from '@/components/Signin'
import Register from '@/components/Register'

Vue.use(BootstrapVue)
Vue.use(Router)

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
      path: '/home',
      name: 'Home',
      component: Home
    },
    {
      path: '/about',
      name: 'About',
      component: About
    },
    {
      path: '/Signin',
      name: 'Sign In',
      component: Signin
    },
    {
      path: '/Register',
      name: 'Register',
      component: Register
    },
    {
      path: '/contact',
      name: 'Contact',
      component: Contact
    }
  ]
})