<template>
  <div>
    <h4>Ratings</h4>

    <!-- Class Activities -->

    <!-- display data in grid-->
    <b-form-group
      label="Filter"
      label-cols-sm="6"
      label-align-sm="right"
      label-size="sm"
      label-for="filterInput"
      class="mb-0"
    >
      <b-input-group size="sm">
        <b-form-input v-model="filter" type="search" id="filterInput" placeholder="Type to Search"></b-form-input>
        <b-input-group-append>
          <b-button :disabled="!filter" @click="filter = ''">Clear</b-button>
        </b-input-group-append>
      </b-input-group>
    </b-form-group>

    <b-form-group
      label="Filter On"
      label-cols-sm="6"
      label-align-sm="right"
      label-size="sm"
      description="Leave all unchecked to filter on all data"
      class="mb-0"
    >
      <b-form-checkbox-group v-model="filterOn" class="mt-1">
        <b-form-checkbox value="topic">Topic</b-form-checkbox>
        <b-form-checkbox value="price">Price</b-form-checkbox>
        <b-form-checkbox value="location">Location</b-form-checkbox>
        <b-form-checkbox value="length">Length</b-form-checkbox>
        <b-form-checkbox value="time">Time</b-form-checkbox>
        <b-form-checkbox value="assignedto">Provider</b-form-checkbox>
        <b-form-checkbox value="type">Type</b-form-checkbox>
      </b-form-checkbox-group>
    </b-form-group>

    <b-table
      ref="CAGrid"
      :items="ClassActivity"
      :fields="fields"
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
      sort-icon-left
      :filter="filter"
      :filterIncludedFields="filterOn"
      responsive="sm"
    >
      <template v-slot:cell(actions)="row">
        <b-button
          size="sm"
          @click="info(row.item, row.index, $event.target)"
          class="mr-1"
        >Info modal</b-button>
      </template>
    </b-table>

    <!-- Info modal -->
    <b-modal :id="infoModal.id" :title="infoModal.title" ok-only @hide="resetInfoModal">
      <pre>{{ infoModal.content }}</pre>
    </b-modal>

    <div align="right">
      Sorting By:
      <b>{{ sortBy }}</b>, Sort Direction:
      <b>{{ sortDesc ? 'Descending' : 'Ascending' }}</b>
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
      assignedto: "", //provider
      type: "",

      //Form attributes
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
      filter: null,
      filterOn: [],
      infoModal: {
        id: "info-modal",
        title: "",
        content: ""
      }
    };
  },
  mounted() {
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
    //check if user has access to componenet - avoid direct page access from URL unless designated role
    checkAccess() {
      if (localStorage.getItem("AuthUser")) {
        try {
          this.AuthUser = JSON.parse(localStorage.getItem("AuthUser")); //local storage
          if (this.AuthUser[0].email.length > 0) {
            //check if logged user is Admin
            if (
              this.AuthUser[0].type == "Student" ||
              this.AuthUser[0].type == "Parent"
            ) {
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

    info(item, index, button) {
      this.infoModal.title = item.topic;

      //getIDbyTopictoRate()

      this.infoModal.content = this.getIDbyTopictoRate(item.topic); //JSON.stringify(item, null, 2);

      this.$root.$emit("bv::show::modal", this.infoModal.id, button);
    },

    resetInfoModal() {
      this.infoModal.title = "";
      this.infoModal.content = "";
    },

    //read record and get topic at selected row
    //search for the topic in respective array and get its position in array
    //pass the recordindex to rate
    getIDbyTopictoRate(searchtopic) {
      var cntr = 0;
      for (cntr = 0; cntr < this.ClassActivity.length; cntr++) {
        //search for Topic
        if (
          searchtopic.toUpperCase().trim() ==
          this.ClassActivity[cntr].topic.toUpperCase().trim()
        ) {
          //topic found - use index to rate it
          var content = "HTML for rating" + cntr;

          return content;
        }
      }
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