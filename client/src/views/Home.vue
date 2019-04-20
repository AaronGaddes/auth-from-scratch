<template>
<div class="text-center">
  <div class="jumbotron">
    <h1 class="display-3">Authentication from Scratch</h1>
    <p class="lead">
      Learning Auth.
      </p>
    <hr class="my-4">
    <p class="lead">
      <router-link
      class="btn btn-primary btn-lg"
      :to="{ name: 'signup'}"
      role="button"
      >Sign Up</router-link>
    </p>
  </div>
</div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'home',
};
</script>
