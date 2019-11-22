<template>
  <div id="login">
    <h1>Login</h1>

    <input type="text" name="email" v-model="input.email" placeholder="email" />
    <br />
    <br />
    <input type="password" name="password" v-model="input.password" placeholder="Password" />
    <br />
    <br />
    <b-button size="sm" class="mr-1" type="button" v-on:click="login()">Login</b-button>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      input: {
        email: "",
        password: ""
      },
      Users: [],
      AuthUser: [],
      email: "",
      name: "",
      surname: "",
      type: ""
    };
  },
  methods: {
    SetAuthUser() {
      //clear local store
      localStorage.removeItem("AuthUser");

      //save auth user in storage
      localStorage.setItem("AuthUser", JSON.stringify(this.AuthUser));
    },

    checkUser: function() {
      var usremail = this.input.email; //email address input
      var usrpwd = this.input.password;//pwd input

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
        if (usremail == this.Users[cntr].email) {
          //if found check whether password matches
          if (usrpwd == this.Users[cntr].password) {
            //OK- we have a match

            //set session - push new entry to auth user array
            this.AuthUser.push({
              email: this.Users[cntr].email,
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

    login() {
      if (this.input.email != "" && this.input.password != "") {
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
</style>