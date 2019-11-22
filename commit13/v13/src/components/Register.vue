<template>
  <div>
    <!-- Error button and Collapsable card showing errors-->
    <b-button
      size="sm"
      class="mr-1"
      v-if="errors.length"
      v-b-toggle.collapse-1
      variant="primary"
    >! Errors</b-button>
    <b-collapse id="collapse-1" class="mt-2">
      <b-card>
        <span v-if="errors.length">
          <b>Please correct the following error(s):</b>
          <p v-for="(error, index) in errors" :key="index">{{ error }}</p>
        </span>
      </b-card>
    </b-collapse>

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
      </select>
      <br />
      <br />

      <b-button size="sm" class="mr-1" type="button" v-on:click="addUser()">Register</b-button>&nbsp;
      <b-button size="sm" class="mr-1" type="button" to="Home">Cancel</b-button>&nbsp;
    </div>
  </div>
</template>

<script>
export default {
  name: "Register", //this is the name of the component

  //data structure
  data() {
    return {
      Users: [], //array storing users
      email: "",
      pwd: "",
      name: "",
      surname: "",
      type: "",

      errors: []
    };
  },
  mounted() {
    //load array from local storage
    if (localStorage.getItem("Users")) {
      try {
        this.Users = JSON.parse(localStorage.getItem("Users")); //local storage
      } catch (e) {
        localStorage.removeItem("Users");
      }
    }
  },
  methods: {
    //Check form inputs - check inputs and test validations
    checkForm: function() {
      this.errors = [];

      //Check if email is already in use - don't allow duplicates
      if (!this.email) {
        this.errors.push("Email required.");
      } else if (!this.validEmail(this.email.toLowerCase().trim())) {
        this.errors.push("Valid email required."); //check if valid email
      } else if (!this.EmailExits(this.email.toLowerCase().trim())) {
        this.errors.push("Email already registered.");
      }

      //check password complexity
      if (!this.pwd) {
        this.errors.push("Password required.");
      } else if (!this.passwordcomplexitycheck(this.pwd)) {
        this.errors.push(
          "Password complexity - must be between 7 to 15 characters and contain at least one numeric digit and a special character"
        );
      }

      if (!this.name) {
        this.errors.push("Name required.");
      }

      if (!this.surname) {
        this.errors.push("Surname required.");
      }

      if (!this.type) {
        this.errors.push("Role type required.");
      }

      //if there are any error report
      if (this.errors.length > 0) {
        return false;
      } else {
        return true;
      }
    },

    //email validation
    validEmail: function(email) {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/; // eslint-disable-line
      return re.test(email);
    },

    //check if email is in use - dont allow duplicates
    EmailExits: function(email) {
      var cntr = 0;
      for (cntr = 0; cntr < this.Users.length; cntr++) {
        //check user email as login
        if (email.toLowerCase().trim() == this.Users[cntr].email.toLowerCase().trim()) {
          //email already registered
          return false;
        }
      }

      return true;
    },

    //check password complexity
    //[7 to 15 characters which contain at least one numeric digit and a special character]
    passwordcomplexitycheck(password) {
      var re = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/; // eslint-disable-line
      return re.test(password);
    },

    //add user - add new registration
    addUser() {
      // Validate inputs
      if (this.checkForm() == false) {
        return false;
      }

      // construct object and add user to array
      this.Users.push({
        email: this.email.toLowerCase().trim(),
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

      this.errors = [];

      this.saveUsers();
    },

    saveUsers() {
      localStorage.setItem("Users", JSON.stringify(this.Users));

      alert("Thanks for registering");
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