<template>
  <div>    
    <nav>
      <router-link class="spacing" v-for="routes in links" 
      v-bind:key="routes.id"
      :to="`${routes.page}`">{{routes.text}}</router-link>
    </nav>
  </div>
</template>

<script>
export default {
  name: 'Navigation',
  data() {
    return {
      links: [
        {
          id: 0,
          text: 'User Admin',
          page:'/UserAdmin'
        },
        {
          id: 1,
          text: 'Class Activity Admin',
          page:'/ClassActivityAdmin'
        },
        {
          id: 2,
          text: 'Home',
          page:'/Home'
        },
        {
          id: 3,
          text: 'About',
          page:'/About'
        },
        {
          id: 4,
          text: 'Sign-in',
          page:'/Signin'
        },
        {
          id: 5,
          text: 'Contact Us',
          page:'/Contact'
        }
      ]
    }
  }
}
</script>
<style>
.spacing {
  margin-right: 10px;
}
</style>
