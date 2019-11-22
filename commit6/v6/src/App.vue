<template>
  <div id="app">
    <router-link to="/Home">
      <img src="./assets/logo.png" />
    </router-link>
    <br />
    <br />

    <nav>
      <!--Admin Menus-->
      <span v-if="type === 'Admin'">
        <router-link
          class="menuitems"
          v-for="routes in Adminlinks"
          v-bind:key="routes.id"
          :to="`${routes.page}`"
        >{{routes.text}}</router-link>
      </span>

      <!--Parent and Student Menus-->
      <span v-if="type === 'Parent' || type === 'Student'">
        <router-link
          class="menuitems"
          v-for="routes in PSlinks"
          v-bind:key="routes.id"
          :to="`${routes.page}`"
        >{{routes.text}}</router-link>
      </span>

      <!--Provider-->
      <span v-if="type === 'Provider'">
        <router-link
          class="menuitems"
          v-for="routes in Providerlinks"
          v-bind:key="routes.id"
          :to="`${routes.page}`"
        >{{routes.text}}</router-link>
      </span>

      <!--Other links-->
      <router-link
        class="menuitems"
        v-for="routes in OtherLinks"
        v-bind:key="routes.id"
        :to="`${routes.page}`"
      >{{routes.text}}</router-link>
    </nav>

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

    <br />
    <br />

    <router-view @authenticated="setAuthenticated" />
  </div>
</template>


<script>
export default {
  name: "App",

  data() {
    return {
      authenticated: false,

      AuthUser: [],
      email: "",
      name: "",
      surname: "",
      type: "",

      Adminlinks: [
        {
          id: 0,
          text: "User Admin",
          page: "/UserAdmin"
        },
        {
          id: 1,
          text: "Class Activity Admin",
          page: "/ClassActivityAdmin"
        }
      ],

      PSlinks: [
        {
          id: 0,
          text: "Activities",
          page: "/Activities"
        },
        {
          id: 1,
          text: "About",
          page: "/About"
        },
        {
          id: 2,
          text: "Contact Us",
          page: "/Contact"
        }
      ],

      Providerlinks: [
        {
          id: 0,
          text: "ActivitiesProvider",
          page: "/ActivitiesProvider"
        },
        {
          id: 1,
          text: "About",
          page: "/About"
        },
        {
          id: 2,
          text: "Contact Us",
          page: "/Contact"
        }
      ],
      OtherLinks: [
        {
          id: 1,
          text: "About",
          page: "/About"
        },
        {
          id: 2,
          text: "Contact Us",
          page: "/Contact"
        }
      ]
    };
  },

  mounted() {
    this.refreshSesssion();

    this.$router.push("Home");
  },

  methods: {
    refreshSesssion() {
      if (localStorage.getItem("AuthUser")) {
        try {
          this.AuthUser = JSON.parse(localStorage.getItem("AuthUser")); //local storage

          if (this.AuthUser[0].email.length > 0) {
            //alert("Loading previous session.");

            //this means user is/ was  authenticated - session exists
            this.name = this.AuthUser[0].name;
            this.email = this.AuthUser[0].email;
            this.type = this.AuthUser[0].type;
            this.authenticated = true;

            //this.$router.push("Home");
          }
        } catch (e) {
          localStorage.removeItem("AuthUser");
        }
      }
    },
    setAuthenticated(status) {
      this.refreshSesssion();

      this.name = this.AuthUser[0].name;
      this.email = this.AuthUser[0].email;
      this.type = this.AuthUser[0].type;

      this.authenticated = status;

      this.$router.push("Home");

      //alert("logged in");
    },
    logout() {
      //remove local storage
      localStorage.removeItem("AuthUser");

      //clear values
      this.email = "";
      this.name = "";
      this.surname = "";
      this.type = "";

      this.authenticated = false;
      this.refreshSesssion();

      this.$router.push("Home");

      // alert("logged out");
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
.menuitems {
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

.menuitems:hover {
  background-color: none;
  text-decoration: none;
  color: #fff;
}
</style>