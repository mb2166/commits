<template>
  <div class="div_contacts">
    <h1>Contact Us</h1>
    <p>
      Email: {{email}}
      <br /><br />
      Website: {{web}}
    </p>
  </div>
</template>

<script>
export default {
  name: "Contact",
  data() {
    return {
      email: "a@a.com",
      web: "a.com"
    };
  }
};
</script>

<style>
.div_contacts {
  width: 500px;
  border: 1px solid #cccccc;
  background-color: #ffffff;
  margin: auto;
  margin-top: 20px;
  padding: 20px;
}
</style>