<template>
  <div>
    <h4>Class & Activities Provider Administration</h4>

    <!-- Class Activities Provider page-->

    <!-- Show / Hide add button-->
    <div v-show="!formmode" v-on:click="formmode = !formmode" class="control">
      <b-button size="sm" class="mr-1">Add New Class / Activity</b-button>
    </div>

    <!-- Form-->
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
      <div class="ClassActivity">
        Topic :
        <input
          v-if="!editmode"
          type="text"
          name="topic"
          id="topic"
          v-model="topic"
          placeholder="topic"
        />
        <input
          v-if="editmode"
          type="text"
          name="topic"
          id="topic"
          v-model="topic"
          placeholder="topic"
          disabled
        />
        <br />
        <br />Price EUR :
        <input type="number" id="price" name="price" v-model="price" placeholder="price" />
        <br />
        <br />Location :
        <input
          type="text"
          id="location"
          name="location"
          v-model="location"
          placeholder="location"
        />
        <br />
        <br />Time :
        <input type="text" id="time" name="time" v-model="time" placeholder="time frequency" />
        <br />
        <br />Length (hrs):
        <input
          type="number"
          id="length"
          name="length"
          v-model="length"
          placeholder="length"
        />
        <br />
        <br />Type :
        <select id="type" name="type" v-model="type">
          <option>Class</option>
          <option>Activity</option>
        </select>
        <br />
        <br />

        <!-- buttons save, cancel and edit toggled depending on the mode set -->
        <b-button size="sm" class="mr-1" v-show="formmode" @click="Cancel">Cancel</b-button>&nbsp;
        <b-button size="sm" class="mr-1" v-show="!editmode" @click="addClassActivity">Save</b-button>
        <b-button size="sm" class="mr-1" v-show="editmode" @click="updateClassActivity">Update</b-button>
      </div>
    </div>

    <br />

    <!-- display data in grid-->

    <div v-show="!formmode">
      <b-table
        ref="CAGrid"
        :items="ClassActivity"
        :sort-by.sync="sortBy"
        :sort-desc.sync="sortDesc"
        sort-icon-left
        :fields="fields"
        :filter="this.email"
        :filterIncludedFields="filterOn"
        responsive="sm"
      >
        <template v-slot:cell(actions)="row">
          <!-- buttons per row -->
          <b-button size="sm" class="mr-1" @click="getTopictoRemove(row.item.topic)">Remove</b-button>&nbsp;
          <b-button size="sm" class="mr-1" @click="getTopictoEdit(row.item.topic)">Edit</b-button>
        </template>
      </b-table>

      <div align="right">
        Sorting By:
        <b>{{ sortBy }}</b>, Sort Direction:
        <b>{{ sortDesc ? 'Descending' : 'Ascending' }}</b>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ClassActivity", //this is the name of the component

  data() {
    return {
      //local storage attributes and array
      ClassActivity: [],
      topic: "",
      price: "",
      location: "",
      time: "",
      length: "",
      assignedto: "",
      type: "",

      email: "",

      //Form attributes
      errors: [],
      editmode: false,
      formmode: false,
      rec_index: null,
      sortBy: "topic",
      sortDesc: false,
      fields: [
        { key: "topic", sortable: true },
        { key: "price", sortable: true },
        { key: "location", sortable: true },
        { key: "length", sortable: true },
        { key: "time", sortable: true },
        { key: "assignedto", sortable: true },
        { key: "type", sortable: true },
        { key: "actions", label: "Actions" }
      ],
      //items: JSON.parse(localStorage.getItem("ClassActivity")),
      filterOn: []
    };
  },
  mounted() {
    this.filterOn.push("assignedto"); //assign specific field to the filer

    //this module cannot be accessed unless user is authenticated.
    if (this.checkAccess() == false) {
      //redirect to home
      alert("Unathorised Access");
      this.$router.push("Home");
    }

    //load from locla storage
    if (localStorage.getItem("ClassActivity")) {
      try {
        this.ClassActivity = JSON.parse(localStorage.getItem("ClassActivity")); //local storage
      } catch (e) {
        localStorage.removeItem("ClassActivity");
      }
    }

    //clear any errors in array
    this.errors = [];
  },

  methods: {
    //Check form inputs - check inputs and test validations
    checkForm: function() {
      this.errors = [];

      //only check topic if not editting.
      //Check if Topic is already in use - don't allow duplicates
      if (this.editmode == false) {
        if (!this.topic) {
          this.errors.push("Topic required.");
        } else if (!this.TopicExits(this.topic.toUpperCase().trim())) {
          this.errors.push("Topic already registered.");
        }
      }

      if (!this.price) {
        this.errors.push("Price required.");
      } else if (!this.validPrice(this.price)) {
        this.errors.push(
          "Invalid Price. Price has to be numeric and must be greater than 0."
        );
      }

      if (!this.location) {
        this.errors.push("Location required.");
      }

      if (!this.length) {
        this.errors.push("Length required.");
      } else if (!this.validLength(this.length)) {
        this.errors.push(
          "Invalid Length. Length has to be numeric and must be greater than 0."
        );
      }

      if (!this.time) {
        this.errors.push("time required.");
      }

      if (!this.type) {
        this.errors.push("Type required.");
      }

      //if there are any error report
      if (this.errors.length > 0) {
        return false;
      } else {
        return true;
      }
    },

    // Length validation
    validLength: function(length) {
      var re = /^[1-9][0-9]*$/; // eslint-disable-

      return re.test(length);
    },

    // price validation
    validPrice: function(price) {
      var re = /^(?=.*[1-9])[0-9]*[.,]?[0-9]{1,2}$/; // eslint-disable-line

      return re.test(price);
    },

    //check if topic is already in use - check for duplicates
    TopicExits: function(topic) {
      var cntr = 0;
      for (cntr = 0; cntr < this.ClassActivity.length; cntr++) {
        //check Topic
        if (
          topic.toUpperCase().trim() ==
          this.ClassActivity[cntr].topic.toUpperCase().trim()
        ) {
          //topic already registered
          return false;
        }
      }

      return true;
    },

    //check if user has access to componenet - avoid direct page access from URL unless designated role
    checkAccess() {
      if (localStorage.getItem("AuthUser")) {
        try {
          this.AuthUser = JSON.parse(localStorage.getItem("AuthUser")); //local storage
          if (this.AuthUser[0].email.length > 0) {
            //check if logged user is provider
            if (this.AuthUser[0].type == "Provider") {
              this.email = this.AuthUser[0].email; //get email and save it for grid refresh and save
              return true; //allow component to be accessed
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

    //Add Class or Activity record
    addClassActivity() {
      //toggle save/ update button
      this.editmode = false;

      // Validate inputs
      if (this.checkForm() == false) {
        return false;
      }

      // construct array and populate
      this.ClassActivity.push({
        topic: this.topic.toUpperCase().trim(),
        price: this.price,
        location: this.location,
        time: this.time,
        length: this.length,
        assignedto: this.email.toLowerCase().trim(),
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

      // save array to store
      this.saveClassActivity();
    },

    //save array to local storage
    saveClassActivity() {
      localStorage.setItem("ClassActivity", JSON.stringify(this.ClassActivity));

      this.formmode = false;
    },

    //read record and get topic at selected row
    //search for the topic in respective array and get its position in array
    //pass the recordindex to editClassActivity
    getTopictoEdit(searchtopic) {
      var cntr = 0;
      for (cntr = 0; cntr < this.ClassActivity.length; cntr++) {
        //search for Topic
        if (
          searchtopic.toUpperCase().trim() ==
          this.ClassActivity[cntr].topic.toUpperCase().trim()
        ) {
          //topic found
          this.editClassActivity(cntr);
        }
      }

      return false;
    },

    //read record and get topic at selected row
    //search for the topic in respective array and get its position in array
    //pass the recordindex to removeClassActivity
    getTopictoRemove(searchtopic) {
      var cntr = 0;
      for (cntr = 0; cntr < this.ClassActivity.length; cntr++) {
        //search for Topic
        if (
          searchtopic.toUpperCase().trim() ==
          this.ClassActivity[cntr].topic.toUpperCase().trim()
        ) {
          //topic found
          this.removeClassActivity(cntr);
        }
      }

      return false;
    },

    //edit button method
    editClassActivity(x) {
      //toggle save/update button
      this.editmode = true;
      this.formmode = true;

      // store the index of record being modified.
      this.rec_index = x;

      //load values
      this.topic = this.ClassActivity[x].topic.toUpperCase().trim();
      this.price = this.ClassActivity[x].price;
      this.location = this.ClassActivity[x].location;
      this.time = this.ClassActivity[x].time;
      this.length = this.ClassActivity[x].length;
      this.assignedto = this.email.toLowerCase().trim();
      this.type = this.ClassActivity[x].type;
    },

    //remove record when button clocked in table
    removeClassActivity(x) {
      this.ClassActivity.splice(x, 1);
      this.saveClassActivity();
    },

    //update record value
    updateClassActivity() {
      // Validate inputs
      if (this.checkForm() == false) {
        return false;
      }

      // update array with values
      this.ClassActivity[
        this.rec_index
      ].topic = this.topic.toUpperCase().trim();
      this.ClassActivity[this.rec_index].price = this.price;
      this.ClassActivity[this.rec_index].location = this.location;
      this.ClassActivity[this.rec_index].time = this.time;
      this.ClassActivity[this.rec_index].length = this.length;
      this.ClassActivity[
        this.rec_index
      ].assignedto = this.email.toLowerCase().trim();
      this.ClassActivity[this.rec_index].type = this.type;

      //clear values
      this.topic = "";
      this.price = "";
      this.location = "";
      this.time = "";
      this.length = "";
      this.assignedto = "";
      this.type = "";

      //save
      this.saveClassActivity();

      //reset screen values - to toggle buttons and div on/off
      this.formmode = false;
      this.editmode = false;
    },

    //Cancel Button click - reset view
    Cancel() {
      this.topic = "";
      this.price = "";
      this.location = "";
      this.time = "";
      this.length = "";
      this.assignedto = "";
      this.type = "";

      this.formmode = false;
      this.editmode = false;

      this.errors = [];
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