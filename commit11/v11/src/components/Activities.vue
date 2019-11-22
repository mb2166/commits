<template>
  <div>
    <h4>Class / Activities</h4>

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
        <b-form-checkbox value="provider">Provider</b-form-checkbox>
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
          @click="topicratings(row.item, $event.target)"
          class="mr-1"
        >Rating Details</b-button>

        <b-button
          size="sm"
          @click="row.toggleDetails"
        >{{ row.detailsShowing ? 'Hide' : 'Submit' }} My Rating</b-button>
      </template>

      <template v-slot:row-details="row">
        <b-card>
          <b>Submit your rating for {{row.item.topic}}</b>
          <br />Rating:&nbsp;&nbsp;
          <select id="myrating" name="myrating" v-model="myrating">
            <option>1</option>
            <option>2</option>
            <option>3</option>
            <option>4</option>
            <option>5</option>
          </select>
          &nbsp;&nbsp;
          <b-button
            size="sm"
            @click="submitTopicRating(row.item.topic, myrating)"
            class="mr-1"
          >Submit</b-button>
        </b-card>
      </template>
    </b-table>

    <!--Modal window for rating -->
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
      TMPClassActivityRatings: [],
      ClassActivity: [],
      topic: "",
      price: "",
      location: "",
      time: "",
      length: "",
      provider: "", //provider
      type: "",

      ClassActivityRatings: [],
      topic_id: "", //topic
      rating: "", // rating
      submission_email: "", //user who submitted rating

      //Form attributes
      sortBy: "topic",
      sortDesc: false,
      fields: [
        { key: "topic", sortable: true },
        { key: "price", sortable: true },
        { key: "location", sortable: true },
        { key: "length", sortable: true },
        { key: "time", sortable: true },
        { key: "provider", sortable: true },
        { key: "type", sortable: true },
        { key: "actions", label: "Actions" }
      ],
      filter: null,
      filterOn: [],
      infoModal: {
        id: "info-modal",
        title: "",
        content: ""
      },
      myrating: "1" //default rating when loaded
    };
  },
  mounted() {
    //this module cannot be accessed unless user is authenticated.

    if (this.checkAccess() == false) {
      //redirect to home
      alert("Unathorised Access");
      this.$router.push("Home");
    }

    //load from local storage - ClassActivities
    if (localStorage.getItem("ClassActivity")) {
      try {
        this.ClassActivity = JSON.parse(localStorage.getItem("ClassActivity")); //local storage
      } catch (e) {
        localStorage.removeItem("ClassActivity");
      }
    }

    //load from local storage - Ratings
    if (localStorage.getItem("ClassActivityRatings")) {
      try {
        this.ClassActivityRatings = JSON.parse(
          localStorage.getItem("ClassActivityRatings")
        ); //local storage
      } catch (e) {
        localStorage.removeItem("ClassActivityRatings");
      }
    }
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

    //get topic ratings
    topicratings(item, button) {
      this.infoModal.title = "Ratings for Topic: " + item.topic;

      var totalcounts = 0;
      var sumratings = 0;
      var avgratings = 0;
      var cntr = 0;
      var topic_index = 0;

      //get topic ID
      topic_index = this.getIDbyTopic(item.topic);

      //get details of ratings for selected topic
      //average + total number of ratings

      for (cntr = 0; cntr < this.ClassActivityRatings.length; cntr++) {
        //loop on items and compute avergae and total count
        if (topic_index == this.ClassActivityRatings[cntr].topic_id) {
          totalcounts = totalcounts + 1; //increment count
          sumratings = sumratings + this.ClassActivityRatings[cntr].rating;
        }
      }

      if (totalcounts == 0) {
        this.infoModal.content =
          "No ratings have been submitted yet for this topic.";
      } else {
        avgratings = sumratings / totalcounts;
        this.infoModal.content =
          "Total number of ratings for topic : " +
          totalcounts +
          " Average rating " +
          avgratings;
      }

      //return
      this.$root.$emit("bv::show::modal", this.infoModal.id, button);
    },

    resetInfoModal() {
      this.infoModal.title = "";
      this.infoModal.content = ""; 
    },

    //submit rating
    submitTopicRating(topic, topic_rating) {
      //check if user has already submitted rating
      var cntrratings = 0;
      var Ratingnewentry = true;
      var topic_index = "";
      topic_index = this.getIDbyTopic(topic);

      //copy ClassActivityRatings to TMPClassActivityRatings
      this.TMPClassActivityRatings = this.ClassActivityRatings;
      cntrratings = this.TMPClassActivityRatings.length;
 
      if (cntrratings > 0) {
        var cntr = 0;

        for (cntr = 0; cntr < cntrratings; cntr++) {
          //check if email and record index exist
          if (
            this.AuthUser[0].email.toLowerCase().trim() ==
              this.TMPClassActivityRatings[cntr].email.toLowerCase().trim() &&
            topic_index == this.TMPClassActivityRatings[cntr].topic_id
          ) {
            //user has submitted rating
            alert("You have already submitted a rating for this topic.");
            cntr = 9999999; //exit the loop

            Ratingnewentry = false;
          }
        }

        if (Ratingnewentry == true) {
          //submit rating
          this.TMPClassActivityRatings.push({
            topic_id: topic_index,
            rating: topic_rating,
            email: this.AuthUser[0].email.toLowerCase().trim()
          });
        }
      } else {
        //submit rating since there is no rating in the ratings store
        //this is the first submission in the rating store
        this.TMPClassActivityRatings.push({
          topic_id: topic_index,
          rating: topic_rating,
          email: this.AuthUser[0].email.toLowerCase().trim()
        });

        Ratingnewentry = true;
      }

      if (Ratingnewentry == true) {
        //commit to local storage
        localStorage.setItem(
          "ClassActivityRatings",
          JSON.stringify(this.TMPClassActivityRatings)
        );

        //clear values
        this.topic_id = "";
        this.rating = "";
        this.email = "";
        this.TMPClassActivityRatings = [];
      }
    },

    //read record and get topic at selected row
    //search for the topic in respective array and get its position in array
    getIDbyTopic(searchtopic) {
      var cntr = 0;
      for (cntr = 0; cntr < this.ClassActivity.length; cntr++) {
        //search for Topic
        if (
          searchtopic.toUpperCase().trim() ==
          this.ClassActivity[cntr].topic.toUpperCase().trim()
        ) {
          //topic found - use index for rating
          return cntr;
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