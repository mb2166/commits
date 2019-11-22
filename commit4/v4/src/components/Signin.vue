<template>
  <div>
    <h1>Sign-in</h1>
   
   eMail : <input v-model="email">
   Password : <input v-model="pwd">
   
   <p><router-link to="Register">Register here</router-link></p>

  </div>
</template>

<script>
export default {
  name: 'Signin' //this is the name of the component
}
</script>
<style>
</style>