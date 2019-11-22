<template>
  <div id="login">
    <h4>Login</h4>

    <input type="text" name="email" v-model="input.email" placeholder="email" />
    <br />
    <br />
    <input type="password" name="password" v-model="input.password" placeholder="Password" />
    <br />
    <br />
    <b-button size="sm" class="mr-1" type="button" v-on:click="login()">Login</b-button> &nbsp;
    <b-button size="sm" class="mr-1" type="button" to="Home">Cancel</b-button> &nbsp;
    <b-button size="sm" class="mr-1" type="button" to="Register">Register</b-button> &nbsp;
   </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      input: {  //input fields
        email: "",
        password: ""
      },
      Users: [], //users array 
      AuthUser: [],//authenticated user array
      email: "",
      name: "",
      surname: "",
      type: ""
    };
  },
  methods: {
    //reset auth user in local storage according to logged user
    SetAuthUser() {
      //clear local store
      localStorage.removeItem("AuthUser");

      //save auth user in storage
      localStorage.setItem("AuthUser", JSON.stringify(this.AuthUser));
    },

    //Check if its a Valid User - correct email login and passsword
    checkUser: function() {
      var usremail = this.input.email.toLowerCase().trim(); //email address input
      var usrpwd = this.input.password; //pwd input

      //load users from local store
      if (localStorage.getItem("Users")) {
        try {
          this.Users = JSON.parse(localStorage.getItem("Users")); //local storage
        } catch (e) {
          localStorage.removeItem("Users");
        }
      }

      var cntr = 0;
      for (cntr = 0; cntr < this.Users.length; cntr++) {
        //check user email as login
        if (usremail.toLowerCase().trim() == this.Users[cntr].email.toLowerCase().trim()) {
          //if found check whether password matches
          if (usrpwd == this.Users[cntr].password) {
            //OK- match

            //set session - push new entry to auth user array
            this.AuthUser.push({
              email: this.Users[cntr].email.toLowerCase().trim(),
              name: this.Users[cntr].name,
              surname: this.Users[cntr].surname,
              type: this.Users[cntr].type
            });
            return true;
          }
        }
      }

      return false;
    },

    //Login method - return back to vue.app with true if user authentication is OK
    login() {
      if (this.input.email.toLowerCase().trim() != "" && this.input.password != "") {
        //loop on users and verify login and pwd
        if (this.checkUser() == true) {
          //user exists
          this.SetAuthUser(); //set auth session

          this.$emit("authenticated", true);
        } else {
          alert("The username and / or password is incorrect");
        }
      } else {
        alert("A username and password must be present");
      }
    }
  }
};
</script>

<style scoped>
#login {
  width: 500px;
  border: 1px solid #cccccc;
  background-color: #ffffff;
  margin: auto;
  margin-top: 20px;
  padding: 20px;
}

.button-option {
  margin-right: 10px;
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
  line-height: 1.5;
  border-radius: 0.2rem;
  color: #fff;
  background-color: #6c757d;
  border-color: #6c757d;
  text-decoration: none;
}

.button-option:hover {
  background-color: none;
  text-decoration: none;
  color: #fff;
}
</style>