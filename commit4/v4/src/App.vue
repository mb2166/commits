<template>
  <div id="app">
    <img src="./assets/logo.png" />
    <br />
    <br />

    <Navigation></Navigation>

    <div class="profilediv">
      <i v-if="authenticated">Logged in as:{{this.email}}</i>
      <br />
      <!-- Logout menu options -->
      <router-link
        class="profilebuttons"
        v-if="authenticated"
        to="/Home"
        v-on:click.native="logout()"
        replace
      >Logout</router-link>

      <!-- Login menu options -->
      <router-link class="profilebuttons" v-if="!authenticated" to="/Login">Login</router-link>
    </div>

    <router-view @authenticated="setAuthenticated" />
  </div>
</template>


<script>
import Navigation from "./components/Navigation";

export default {
  name: "App",

  components: {
    Navigation: Navigation
  },

  data() {
    return {
      authenticated: false,
      AuthUser: [],
      email: "",
      name: "",
      surname: "",
      type: ""
    };
  },

  mounted() {
    if (localStorage.getItem("AuthUser")) {
      try {
        this.AuthUser = JSON.parse(localStorage.getItem("AuthUser")); //local storage

        if (this.AuthUser[0].email.length > 0) {
          //alert("Loading previous session.");

          //this means user is/ was  authenticated - session exists
          this.name = this.AuthUser[0].name;
          this.email = this.AuthUser[0].email;
          this.authenticated = true;
        }
      } catch (e) {
        localStorage.removeItem("AuthUser");
      }
    }
  },

  methods: {
    setAuthenticated(status) {
      this.name = this.AuthUser[0].name;
      this.email = this.AuthUser[0].email;

      this.authenticated = status;

      alert("logged in");
    },
    logout() {
      //remove local storage
      localStorage.removeItem("AuthUser");

      //clear values
      this.email = "";
      this.name = "";
      this.surname = "";
      this.type = "";
      // alert("logged out");

      this.authenticated = false;
    }
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 20px;
  margin: 20px;
}

.profilediv {
  position: absolute;
  top: 20px;
  right: 20px;
}

.profilebuttons {
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

.profilebuttons:hover {
  background-color: none;
  text-decoration: none;
  color: #fff;
}
</style>