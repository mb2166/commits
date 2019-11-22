<template>
  <div>
    <h4>Provider Activities</h4>
    <br />

    <b-form-group
      label="Filter"
      label-cols-sm="7"
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
      label-cols-sm="7"
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
        <b-form-checkbox value="type">Type</b-form-checkbox>
      </b-form-checkbox-group>
    </b-form-group>

    <div>
      <b-table
        :items="items"
        :fields="fields"
        :sort-by.sync="sortBy"
        :sort-desc.sync="sortDesc"
        sort-icon-left
        responsive="sm"
        :filter="filter"
        :filterIncludedFields="filterOn"
      ></b-table>

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
  data() {
    return {
      ClassActivity: [],
      sortBy: "topic",
      sortDesc: false,
      fields: [
        { key: "topic", sortable: true },
        { key: "price", sortable: true },
        { key: "location", sortable: true },
        { key: "length", sortable: true },
        { key: "time", sortable: true },
        { key: "type", sortable: true }
      ],
      items: JSON.parse(localStorage.getItem("ClassActivity")),
      filter: null,
      filterOn: []
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
  methods: {}
};
</script>
<style>
</style>