<template>
  <!-- Expired or invalid link page -->
  <div class="container error-page">
    <fscreen>
      <h1>Not Found</h1>
      <!-- Message explaining the link is expired or mistyped -->
      <p>
        Oops! This link has either expired or was mistyped.<br />
        If you think this is a mistake, try refreshing or check with the
        sender.<br />
        You can always head back to the home page!
      </p>
      <!-- Button to navigate back to home page -->
      <NuxtLink to="/"><btn> Go back to the home page </btn></NuxtLink>
    </fscreen>
  </div>
</template>

<script setup></script>
