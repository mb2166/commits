<template>
  <div>
    <h1>User Administration</h1>

    <div v-show="!formmode" v-on:click="formmode = !formmode" class="control">
      <b-button size="sm" class="mr-1">Add New Class / Activity</b-button>
    </div>

    <div v-if="formmode" id="hide">
      <p>
        eMail :
        <input v-model="email" />
        <br />Password :
        <input v-show="!editmode" v-model="pwd" />
        <i v-show="editmode">password is hidden and cannot be altered</i>
        <br />Name :
        <input v-model="name" />
        <br />Surname :
        <input v-model="surname" />
        <br />Type :
        <select v-model="type">
          <option>Student</option>
          <option>Parent</option>
          <option>Service Provider</option>          
          <option>Admin</option>
        </select>
        <br />

        <b-button size="sm" class="mr-1" v-show="formmode" @click="Cancel">Cancel</b-button>&nbsp;
        <b-button size="sm" class="mr-1" v-show="!editmode" @click="addUser">Save</b-button>&nbsp;
        <b-button size="sm" class="mr-1" v-show="editmode" @click="updateUser">Update</b-button>
      </p>
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
    //this cannot be accessed unless user is authenticated.
    

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
</style>