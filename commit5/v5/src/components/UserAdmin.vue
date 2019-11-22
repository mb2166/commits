<template>
  <div>
    <h4>User Administration</h4>

    <div v-show="!formmode" v-on:click="formmode = !formmode" class="control">
      <b-button size="sm" class="mr-1">Add New User</b-button>
    </div>

    <div v-if="formmode" id="hide">
      <div id="UserAdmin">
        eMail :
        <input
          v-show="!editmode"
          type="text"
          name="email"
          v-model="email"
          placeholder="email"
        />
        <input
          v-show="editmode"
          type="text"
          name="email"
          v-model="email"
          placeholder="email"
          disabled
        />
        <br />
        <br />Password :
        <input
          v-show="!editmode"
          type="password"
          name="pwd"
          v-model="pwd"
          placeholder="password"
        />
        <i v-show="editmode">password is hidden and cannot be altered</i>
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
          <option>Service Provider</option>
          <option>Admin</option>
        </select>
        <br />
        <br />
        <b-button size="sm" class="mr-1" v-show="formmode" @click="Cancel">Cancel</b-button>&nbsp;
        <b-button size="sm" class="mr-1" v-show="!editmode" @click="addUser">Save</b-button>&nbsp;
        <b-button size="sm" class="mr-1" v-show="editmode" @click="updateUsernew">Update</b-button>
      </div>
    </div>

    <br />
    <!-- display data in grid-->

    <div v-show="!formmode">
      <b-table ref="UserGrid" :items="Users" :fields="fields" responsive="sm">
        <template v-slot:cell(actions)="row">
          <b-button size="sm" class="mr-1" @click="removeUser(row.index)">Remove</b-button>&nbsp;
          <b-button size="sm" class="mr-1" @click="editUser(row.index)">Edit</b-button>
        </template>
      </b-table>
    </div>
  </div>
</template>

<script>
export default {
  name: "UserAdmin", //this is the name of the component
  data() {
    return {
      Users: [],
      email: "",
      pwd: "",
      name: "",
      surname: "",
      type: "",
      editmode: false,
      formmode: false,
      rec_index: null,
      fields: [
        { key: "email", sortable: false },
        { key: "name", sortable: false },
        { key: "surname", sortable: false },
        { key: "type", sortable: false },
        { key: "actions", label: "Actions" }
      ]
    };
  },
  mounted() {
    //this cannot be accessed unless user is authenticated - admin role
    if (this.checkAccess() == false) {
      //redirect to home
      alert("Unathorised Access");
      this.$router.push("Home");
    }

    if (localStorage.getItem("Users")) {
      try {
        this.Users = JSON.parse(localStorage.getItem("Users")); //local storage
      } catch (e) {
        localStorage.removeItem("Users");
      }
    }
  },
  methods: {
    checkAccess() {
      if (localStorage.getItem("AuthUser")) {
        try {
          this.AuthUser = JSON.parse(localStorage.getItem("AuthUser")); //local storage
          if (this.AuthUser[0].email.length > 0) {
            //this means user is/ was  authenticated - session exists
            if (this.AuthUser[0].type == "Admin") {
              return true;
            }
          }
        } catch (e) {
          localStorage.removeItem("AuthUser");
        }
        return false;
      } else {
        return false;
      } //no Auth session found
    },

    addUser() {
      // ensure they actually typed something
      if (!this.email) {
        return;
      }

      // construct object - assign to array
      this.Users.push({
        email: this.email,
        password: this.pwd,
        name: this.name,
        surname: this.surname,
        type: this.type
      });

      //clear values
      this.email = "";
      this.pwd = "";
      this.name = "";
      this.surname = "";
      this.type = "";

      this.saveUsers();
    },

    saveUsers() {
      localStorage.setItem("Users", JSON.stringify(this.Users));

      this.formmode = false;
    },

    removeUser(x) {
      this.Users.splice(x, 1);
      this.saveUsers();
    },

    editUser(x) {
      //toggle save/update button
      this.editmode = true;
      this.formmode = true;

      // store the index of record being modified.
      this.rec_index = x;

      this.email = this.Users[x].email;
      this.name = this.Users[x].name;
      this.surname = this.Users[x].surname;
      this.pwd = this.Users[x].pwd;
      this.type = this.Users[x].type;
    },

    updateUsernew() {
      // ensure they actually typed something
      if (!this.email) {
        return;
      }

      this.Users[this.rec_index].email = this.email;
      this.Users[this.rec_index].name = this.name
      this.Users[this.rec_index].surname = this.surname;
      this.Users[this.rec_index].pwd  = this.pwd
      this.Users[this.rec_index].type = this.type

     //clear variables
      this.email = "";
      this.pwd = "";
      this.name = "";
      this.surname = "";
      this.type = "";

      //save evrything
      this.saveUsers();

      this.formmode = false;
    },

    updateUser() {
      // ensure they actually typed something
      if (!this.email) {
        return;
      }

      // construct object
      this.Users.push({
        email: this.email,
        password: this.pwd,
        name: this.name,
        surname: this.surname,
        type: this.type
      });

      this.email = "";
      this.pwd = "";
      this.name = "";
      this.surname = "";
      this.type = "";

      //remove old activity
      //get current record
      this.Users.splice(this.rec_index, 1);

      //save evrything
      this.saveUsers();

      this.formmode = false;
    },
    Cancel() {
      this.email = "";
      this.pwd = "";
      this.name = "";
      this.surname = "";
      this.type = "";

      this.formmode = false;
      this.editmode = false;
    }
  }
};
</script>

<style>
#UserAdmin {
  width: 500px;
  border: 1px solid #cccccc;
  background-color: #ffffff;
  margin: auto;
  margin-top: 20px;
  padding: 20px;
}
</style>