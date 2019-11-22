<template>
  <div>
    <div id="register">
      <h4>Register</h4>eMail (username) :
      <input type="text" name="email" v-model="email" placeholder="email" />
      <br />
      <br />Password :
      <input type="password" name="email" v-model="pwd" placeholder="password" />
      <br />
      <br />Name :
      <input type="text" name="name" v-model="name" placeholder="name" />
      <br />
      <br />Surname :
      <input type="text" name="surname" v-model="surname" placeholder="surname" />
      <br />
      <br />Type :
      <select v-model="type">
        <option>Student</option>
        <option>Parent</option>
        <option>Provider</option>
        <option>Admin</option>
      </select>
      <br />
      <br />

      <b-button size="sm" class="mr-1" type="button" v-on:click="addUser()">Register</b-button>&nbsp;
      <b-button size="sm" class="mr-1" type="button" to="Home">Cancel</b-button>&nbsp;
    </div>

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
  name: "Register", //this is the name of the component
  //data structure

  data() {
    return {
      Users: [],
      email: "",
      pwd: "",
      name: "",
      surname: "",
      type: ""
    };
  },
  mounted() {
    if (localStorage.getItem("Users")) {
      try {
        this.Users = JSON.parse(localStorage.getItem("Users")); //local storage
      } catch (e) {
        localStorage.removeItem("Users");
      }
    }
  },
  methods: {
    addUser() {
      // ensure they actually typed something
      if (!this.email) {
        return;
      }

      // construct object and add user to array
      this.Users.push({
        email: this.email,
        password: this.pwd,
        name: this.name,
        surname: this.surname,
        type: this.type
      });

      //clear attributes
      this.email = "";
      this.pwd = "";
      this.name = "";
      this.surname = "";
      this.type = "";

      this.saveUsers();
    },

    saveUsers() {
      localStorage.setItem("Users", JSON.stringify(this.Users));

      //redirect to home
      this.$router.push("Home");
    }
  }
};
</script>
<style>
#register {
  width: 500px;
  border: 1px solid #cccccc;
  background-color: #ffffff;
  margin: auto;
  margin-top: 20px;
  padding: 20px;
}
</style>