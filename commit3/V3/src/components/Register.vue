<template>
  <div>
    <h1>Register</h1>

    <p>
       eMail : <input v-model="email"> <br/>
       Password : <input v-model="pwd"><br/>
       Name : <input v-model="name"><br/>
       Surname : <input v-model="surname"><br/>
        
        Type : <select v-model="type">
          <option>Student</option>
          <option>Teacher</option>
          <option>Parent</option>
        </select>
        <br>

        <button @click="addUser">Register</button>
    </p>  

<!-- for debug
   <ul v-for="(value, index) in Users" v-bind:key="index">
     <li>{{value}} ({{index}})</li>

     <button @click="removeUser(index)">Remove User</button>
   </ul>
 -->

  </div>
</template>

<script>
export default {
  name: 'Register', //this is the name of the component
  //data structure 

data() {
      return {
        Users: [],
        email:"",
        pwd:"",
        name:"",
        surname:"",
        type:"",
      }
    },
   mounted() {
    if (localStorage.getItem('Users')) {
      try {
        this.Users = JSON.parse(localStorage.getItem('Users')); //local storage
      } catch(e) {
       localStorage.removeItem('Users');
      }
    }
  },
  methods: {
    addUser() {
      // ensure they actually typed something
      if (!this.email) {
        return;
      }

      // construct object
      this.Users.push({
        email: this.email,
        password: this.pwd,
        name:this.name,
        surname:this.surname,
        type:this.type
    })

    this.email = ""
    this.pwd = ""
    this.name = ""
    this.surname = ""
    this.type = ""

    this.saveUsers();
    },

    saveUsers(){
        localStorage.setItem('Users', JSON.stringify(this.Users));
    },

  }
  }
   
</script>
<style>
</style>