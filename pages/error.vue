<template>
  <!-- Error page shown when a quiz is not found -->
  <div class="container error-page">
    <fscreen>
      <h1>Error</h1>
      <!-- User-friendly error message -->
      <p>We couldn't find the quiz you were looking for.</p>
      <!-- Button to navigate back to home page -->
      <NuxtLink to="/"> <btn> Go back to the home page </btn> </NuxtLink>
    </fscreen>
  </div>
</template>

<script setup></script>
