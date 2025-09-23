<template>
  <!-- Root app component, wraps all pages in Nuxt layout -->
  <div>
    <NuxtLayout>
      <!-- Renders the current page -->
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
<script setup>
// Setup for root app component
const route = useRoute();
const { setTokensFromOAuth } = useSession();
// On mount, set session tokens from OAuth query params and clean up URL
onMounted(() => {
  setTokensFromOAuth(route.query.accessToken, route.query.refreshToken);
  window.history.replaceState({}, document.title, window.location.pathname);
});
</script>
