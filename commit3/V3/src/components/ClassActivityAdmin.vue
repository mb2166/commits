<template>
  <div>
    <h1>Class & Activities Administration</h1>

    <!-- Class Activities Admin page-->
    <div v-show="!formmode" v-on:click="formmode = !formmode" class="control">
      <b-button size="sm" class="mr-1">Add New Class / Activity</b-button>
    </div>

    <div v-if="formmode" id="hide">
      <p>
        Topic :
        <input v-model="topic" />
        <br />Price :
        <input v-model="price" />
        <br />Location :
        <input v-model="location" />
        <br />Time :
        <input v-model="time" />
        <br />Length :
        <input v-model="length" />
        <br />Type :
        <select v-model="type">
          <option>Class</option>
          <option>Activty</option>
        </select>
        <br />

        <b-button size="sm" class="mr-1" v-show="formmode" @click="Cancel">Cancel</b-button>

        <b-button size="sm" class="mr-1" v-show="!editmode" @click="addClassActivity">Save</b-button>
        <b-button size="sm" class="mr-1" v-show="editmode" @click="updateClassActivity">Update</b-button>
      </p>
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
        { key: "type", sortable: false },
        { key: "actions", label: "Actions" }
      ]
    };
  },
  mounted() {
    if (localStorage.getItem("ClassActivity")) {
      try {
        this.ClassActivity = JSON.parse(localStorage.getItem("ClassActivity")); //local storage
      } catch (e) {
        localStorage.removeItem("ClassActivity");
      }
    }
  },
  methods: {
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
        type: this.type
      });

      //clear values
      this.topic = "";
      this.price = "";
      this.location = "";
      this.time = "";
      this.length = "";
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
      this.type = this.ClassActivity[x].type;
    },

    removeClassActivity(x) {
      this.ClassActivity.splice(x, 1);
      this.saveClassActivity();
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
        type: this.type
      });

      //clear values
      this.topic = "";
      this.price = "";
      this.location = "";
      this.time = "";
      this.length = "";
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
      this.type = ""; 

      this.formmode = false;
    }
  }
};
</script>
<style>
</style>