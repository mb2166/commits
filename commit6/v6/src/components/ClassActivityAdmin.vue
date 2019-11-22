<template>
  <div>
    <h4>Class & Activities Administration</h4>

    <!-- Class Activities Admin page-->
    <div v-show="!formmode" v-on:click="formmode = !formmode" class="control">
      <b-button size="sm" class="mr-1">Add New Class / Activity</b-button>
    </div>

    <div class="ClassActivity" v-if="formmode" id="hide">
      Topic :
      <input v-show="!editmode" type="text" name="topic" v-model="topic" placeholder="topic" />
      <input
        v-show="editmode"
        type="text"
        name="topic"
        v-model="topic"
        placeholder="topic"
        disabled
      />
      <br />
      <br />Price EUR :
      <input type="price" name="price" v-model="price" placeholder="price" />
      <br />
      <br />Location :
      <input type="text" name="location" v-model="location" placeholder="location" />
      <br />
      <br />Time  :
      <input type="time" name="time" v-model="time" placeholder="time" />
      <br />
      <br />Length (mins):
      <input type="number" name="length" v-model="length" placeholder="length" />
      <br />
      <br />Assigned to :
      <input
        type="text"
        name="assignedto"
        v-model="assignedto"
        placeholder="assigned to"
      />
      <br />
      <br />Type :
      <select v-model="type">
        <option>Class</option>
        <option>Activty</option>
      </select>
      <br />
      <br />
      <b-button size="sm" class="mr-1" v-show="formmode" @click="Cancel">Cancel</b-button>&nbsp;
      <b-button size="sm" class="mr-1" v-show="!editmode" @click="addClassActivity">Save</b-button>
      <b-button size="sm" class="mr-1" v-show="editmode" @click="updateClassActivityNew">Update</b-button>
    </div>

    <br />

    <!-- display data in grid-->

    <div v-show="!formmode">
      <b-table ref="CAGrid" :items="ClassActivity" :fields="fields" responsive="sm">
        <template v-slot:cell(actions)="row">
          <b-button size="sm" class="mr-1" @click="removeClassActivity(row.index)">Remove</b-button>&nbsp;
          <b-button size="sm" class="mr-1" @click="editClassActivity(row.index)">Edit</b-button>
        </template>
      </b-table>
    </div>
  </div>
</template>

<script>
export default {
  name: "ClassActivity", //this is the name of the component

  data() {
    return {
      ClassActivity: [],
      topic: "",
      price: "",
      location: "",
      time: "",
      length: "",
      assignedto: "",
      type: "",
      editmode: false,
      formmode: false,
      rec_index: null,
      fields: [
        { key: "topic", sortable: false },
        { key: "price", sortable: false },
        { key: "location", sortable: false },
        { key: "length", sortable: false },
        { key: "time", sortable: false },
        { key: "assignedto", sortable: false },
        { key: "type", sortable: false },
        { key: "actions", label: "Actions" }
      ]
    };
  },
  mounted() {
    //this cannot be accessed unless user is authenticated.
    if (this.checkAccess() == false) {
      //redirect to home
      alert("Unathorised Access");
      this.$router.push("Home");
    }

    if (localStorage.getItem("ClassActivity")) {
      try {
        this.ClassActivity = JSON.parse(localStorage.getItem("ClassActivity")); //local storage
      } catch (e) {
        localStorage.removeItem("ClassActivity");
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
    addClassActivity() {
      //toggle save/ update button
      this.editmode = false;

      // ensure they actually typed something
      if (!this.topic) {
        return;
      }

      // construct object
      this.ClassActivity.push({
        topic: this.topic,
        price: this.price,
        location: this.location,
        time: this.time,
        length: this.length,
        assignedto: this.assignedto,
        type: this.type
      });

      //clear values
      this.topic = "";
      this.price = "";
      this.location = "";
      this.time = "";
      this.length = "";
      this.assignedto = "";
      this.type = "";

      this.saveClassActivity();
    },

    saveClassActivity() {
      localStorage.setItem("ClassActivity", JSON.stringify(this.ClassActivity));

      this.formmode = false;
    },

    editClassActivity(x) {
      //toggle save/update button
      this.editmode = true;
      this.formmode = true;

      // store the index of record being modified.
      this.rec_index = x;

      this.topic = this.ClassActivity[x].topic;
      this.price = this.ClassActivity[x].price;
      this.location = this.ClassActivity[x].location;
      this.time = this.ClassActivity[x].time;
      this.length = this.ClassActivity[x].length;
      this.assignedto = this.assignedto[x].assignedto;
      this.type = this.ClassActivity[x].type;
    },

    removeClassActivity(x) {
      this.ClassActivity.splice(x, 1);
      this.saveClassActivity();
    },

    updateClassActivityNew() {
      // ensure they actually typed something
      if (!this.topic) {
        return;
      }

      // construct object
      this.ClassActivity[this.rec_index].topic = this.topic;
      this.ClassActivity[this.rec_index].price = this.price;
      this.ClassActivity[this.rec_index].location = this.location;
      this.ClassActivity[this.rec_index].time = this.time;
      this.ClassActivity[this.rec_index].length = this.length;
      this.ClassActivity[this.rec_index].assignedto = this.assignedto;
      this.ClassActivity[this.rec_index].type = this.type;

      //clear values
      this.topic = "";
      this.price = "";
      this.location = "";
      this.time = "";
      this.length = "";
      this.assignedto = "";
      this.type = "";

      //save evrything
      this.saveClassActivity();

      this.formmode = false;
    },

    updateClassActivity() {
      // ensure they actually typed something
      if (!this.topic) {
        return;
      }

      // construct object
      this.ClassActivity.push({
        topic: this.topic,
        price: this.price,
        location: this.location,
        time: this.time,
        length: this.length,
        assignedto: this.assignedto,
        type: this.type
      });

      //clear values
      this.topic = "";
      this.price = "";
      this.location = "";
      this.time = "";
      this.length = "";
      this.assignedto = "";
      this.type = "";

      //remove old activity
      //get current record
      this.ClassActivity.splice(this.rec_index, 1);

      //save evrything
      this.saveClassActivity();

      this.formmode = false;
    },
    Cancel() {
      this.topic = "";
      this.price = "";
      this.location = "";
      this.time = "";
      this.length = "";
      this.assignedto = "";
      this.type = "";

      this.formmode = false;
    }
  }
};
</script>

<style>
.ClassActivity {
  width: 500px;
  border: 1px solid #cccccc;
  background-color: #ffffff;
  margin: auto;
  margin-top: 20px;
  padding: 20px;
}
</style>