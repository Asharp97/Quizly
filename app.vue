<template>
  <div>
    <NuxtLayout>
      
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
<script setup>
const router = useRouter();
const session = useSession();
const modal = useModal();
const supabase = useSupabaseClient();
onMounted(async () => {
  const {
    data: { session: authSession },
  } = await supabase.auth.getSession();

  if (authSession) {
    session.set(authSession);
    modal.close();
    // Clean up the URL
    router.replace(router.currentRoute.value.path);
  }
});
</script>
