<template>
  <div>
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
      <router-link
        class="menuitems"
        v-for="routes in links"
        v-bind:key="routes.id"
        :to="`${routes.page}`"
      >{{routes.text}}</router-link>
    </nav>
    <br />
  </div>
</template>

<script>
export default {
  name: "Navigation",

  data() {
    return {
      AuthUser: [],
      type: "", //user type
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

      links: [
        {
          id: 0,
          text: "Home",
          page: "/Home"
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
      ]
    };
  },

  mounted() {
    if (localStorage.getItem("AuthUser")) {
      try {
        this.AuthUser = JSON.parse(localStorage.getItem("AuthUser")); //local storage

        if (this.AuthUser[0].email.length > 0) {
          //this means user is/ was  authenticated - session exists
          this.type = this.AuthUser[0].type;
        }
      } catch (e) {
        localStorage.removeItem("AuthUser");
      }
    }
  }
};
</script>

<style>
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
