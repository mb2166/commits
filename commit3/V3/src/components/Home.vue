<template>
  <div>
    <h1>Home</h1>
    <p>Here is some information. This is the home page</p>

    <b-form-group
      label="Filter"
      label-cols-sm="8"
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
        @filtered="onFiltered"
      >
      </b-table>

      <div>
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
  methods: {
    
  }
};
</script>
<style>
</style>