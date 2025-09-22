<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
<script setup>
const route = useRoute();
const { setTokensFromOAuth } = useSession();
onMounted(() => {
  setTokensFromOAuth(route.query.accessToken, route.query.refreshToken);
  window.history.replaceState({}, document.title, window.location.pathname);
});
</script>
