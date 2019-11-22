<template>
  <div>
    <h4>User Administration</h4>

    <!-- Users Admin page-->
    <div v-show="!formmode" v-on:click="formmode = !formmode" class="control">
      <b-button size="sm" class="mr-1">Add New User</b-button>
    </div>

    <!-- Show / Hide add button-->

    <div v-if="formmode" id="hide">
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

      <!--Div showing the input fields -->
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
          id="pwd"
          name="pwd"
          v-model="pwd"
          placeholder="password"
        />
        <i v-show="editmode">password is hidden and cannot be altered</i>
        <br />
        <br />Name :
        <input type="text" id="name" name="name" v-model="name" placeholder="name" />
        <br />
        <br />Surname :
        <input
          type="text"
          id="surname"
          name="surname"
          v-model="surname"
          placeholder="surname"
        />
        <br />
        <br />Type :
        <select id="type" name="type" v-model="type">
          <option>Student</option>
          <option>Parent</option>
          <option>Provider</option>
          <option>Admin</option>
        </select>
        <br />
        <br />
        <!-- buttons save, cancel and edit toggled depending on the mode set -->
        <b-button size="sm" class="mr-1" v-show="formmode" @click="Cancel">Cancel</b-button>&nbsp;
        <b-button size="sm" class="mr-1" v-show="!editmode" @click="addUser">Save</b-button>&nbsp;
        <b-button size="sm" class="mr-1" v-show="editmode" @click="updateUser">Update</b-button>
      </div>
    </div>

    <br />
    <!-- display data in grid-->

    <div v-show="!formmode">
      <b-table ref="UserGrid" :items="Users" :fields="fields" responsive="sm">
        <template v-slot:cell(actions)="row">
          <!-- control buttons per row -->
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
      //local storage attributes and array
      Users: [],
      email: "",
      pwd: "",
      name: "",
      surname: "",
      type: "",

      //Form related attributes
      errors: [],
      fields: [
        { key: "email", sortable: false },
        { key: "name", sortable: false },
        { key: "surname", sortable: false },
        { key: "type", sortable: false },
        { key: "actions", label: "Actions" }
      ],

      editmode: false,
      formmode: false,
      rec_index: null
    };
  },
  mounted() {
    //this cannot be accessed unless user is authenticated - admin role
    if (this.checkAccess() == false) {
      //redirect to home
      alert("Unathorised Access");
      this.$router.push("Home");
    }

    //load from locla storage
    if (localStorage.getItem("Users")) {
      try {
        this.Users = JSON.parse(localStorage.getItem("Users")); //local storage
      } catch (e) {
        localStorage.removeItem("Users");
      }
    }

    this.errors = [];
  },
  methods: {
    //Check form inputs - check inputs and test validations
    checkForm: function() {
      this.errors = [];

      //only check password and email if not editting.
      //Check if email is already in use - don't allow duplicates
      if (this.editmode == false) {
        if (!this.email) {
          this.errors.push("Email required.");
        } else if (!this.validEmail(this.email.toLowerCase().trim())) {
          this.errors.push("Valid email required."); //check email validity
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

    //check if user has access to componenet - avoid direct page access from URL unless designated role
    checkAccess() {
      if (localStorage.getItem("AuthUser")) {
        try {
          this.AuthUser = JSON.parse(localStorage.getItem("AuthUser")); //local storage
          if (this.AuthUser[0].email.length > 0) {
            //Check if authenticated user has a role of admin
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
      }
    },

    //Add new users
    addUser() {
      // Validate inputs
      if (this.checkForm() == false) {
        return false;
      }

      // construct object - assign to array
      this.Users.push({
        email: this.email.toLowerCase().trim(),
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

    //save array to local storage
    saveUsers() {
      localStorage.setItem("Users", JSON.stringify(this.Users));

      this.formmode = false;
      this.editmode = false;
    },

    //remove user from array
    removeUser(x) {
      this.Users.splice(x, 1);
      this.saveUsers();
    },

    //edit user details according to position in array (x)
    editUser(x) {
      //toggle save/update button
      this.editmode = true;
      this.formmode = true;

      // store the index of record being modified.
      this.rec_index = x;

      //load values
      this.email = this.Users[x].email.toLowerCase().trim();
      this.name = this.Users[x].name;
      this.surname = this.Users[x].surname;
      this.pwd = this.Users[x].pwd;
      this.type = this.Users[x].type;
    },

    //upadte user method
    updateUser() {
      // Validate inputs
      if (this.checkForm() == false) {
        return false;
      }

      //update array with new values
      this.Users[this.rec_index].email = this.email.toLowerCase().trim();
      this.Users[this.rec_index].name = this.name;
      this.Users[this.rec_index].surname = this.surname;
      this.Users[this.rec_index].pwd = this.pwd;
      this.Users[this.rec_index].type = this.type;

      //clear variables
      this.email = "";
      this.pwd = "";
      this.name = "";
      this.surname = "";
      this.type = "";

      //save evrything
      this.saveUsers();

      this.formmode = false;
      this.editmode = false;
    },

    //Cancel button - reset views
    Cancel() {
      this.email = "";
      this.pwd = "";
      this.name = "";
      this.surname = "";
      this.type = "";

      this.formmode = false;
      this.editmode = false;
      this.errors = [];
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