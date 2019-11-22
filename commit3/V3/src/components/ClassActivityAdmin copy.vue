<template>
  <div>
    <h1>Class & Activities Administration</h1>

  <!-- Class Activities Admin page-->
  <div v-show="!formmode" v-on:click="formmode = !formmode" class="control">
      <button>Add New Class / Activity</button>
  </div>

  <div v-if="formmode" id="hide">
    <p>
       Topic : <input v-model="topic"> <br/>
       Price : <input v-model="price"><br/>
       Location : <input v-model="location"><br/>
       Time : <input v-model="time"><br/>
       Length : <input v-model="length"><br/>
        
        Type : <select v-model="type">
          <option>Class</option>
          <option>Activty</option>
         </select>
        <br>

        <button v-show="formmode" @click="formmode = !formmode">Cancel</button>

        <button v-show="!editmode" @click="addClassActivity">Save</button>
        <button v-show="editmode" @click="updateClassActivity">Update</button>
    </p> 
  </div> 

    <!-- display data in grid-->
  <div v-show="!formmode">
   <ul v-for="(value, index) in ClassActivity" v-bind:key="index">
     <li>{{value}} ({{index}})</li>

     <button @click="removeClassActivity(index)">Remove</button> &nbsp;
     <button @click="editClassActivity(index)">Edit</button>
   </ul>
  </div>

  </div>
</template>

<script>
export default {
  name: 'ClassActivity', //this is the name of the component

data() {
      return {
        ClassActivity: [],
        topic:"",
        price:"",
        location:"",
        time:"",
        length:"",
        type:"",
        editmode:false,
        formmode:false,
        rec_index:null,
      }
    },
   mounted() {
    if (localStorage.getItem('ClassActivity')) {
      try {
        this.ClassActivity = JSON.parse(localStorage.getItem('ClassActivity')); //local storage
      } catch(e) {
       localStorage.removeItem('ClassActivity');
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
        location:this.location,
        time:this.time,
        length:this.length,
        type:this.type
    })

    //clear values
      this.topic = ""
      this.price = ""
      this.location = ""
      this.time = ""
      this.length = ""
      this.type = ""

    this.saveClassActivity();
    },

    saveClassActivity(){
        localStorage.setItem('ClassActivity', JSON.stringify(this.ClassActivity));
    },

    editClassActivity(x){
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
        location:this.location,
        time:this.time,
        length:this.length,
        type:this.type
    })

    //clear values
      this.topic = ""
      this.price = ""
      this.location = ""
      this.time = ""
      this.length = ""
      this.type = ""//clearValues();

    //remove old activity
    //get current record
     this.ClassActivity.splice(this.rec_index, 1);

    //save evrything
    this.saveClassActivity();

    this.formmode = false;
    },
  }
  }
   
</script>
<style>
</style>