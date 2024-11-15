<template>
  <div>
    <nav>
      <div class="nav-content container">
        <NuxtLink to="/" class="logo">
          <img src="/img/logo.png" alt="quizly logo">
        </NuxtLink>

        <div v-if="session.user" class="user dropdown">
          <Icon class="icon" name="material-symbols:account-circle-full" />
          <div class="menu-bg">
            <div class="menu">
              <NuxtLink to="/profile">
                <div class="item">
                  My Profile
                </div>
              </NuxtLink>
              <NuxtLink to="/dashboard">
                <div class="item">
                  Dashboard
                </div>
              </NuxtLink>
              <div class="item" @click="modal.confirm = true">
                Logout
              </div>
            </div>
          </div>
        </div>

        <div v-else class="auth-buttons">
          <Btn text="Sign Up" @click="modal.auth = true" />
          <Btn text="Login" inv="true" @click="modal.auth = true" />
        </div>
      </div>
    </nav>
    <Teleport to="body">
      <Auth />
      <prompt msg="Are you sure you want to logout?" action-text="Log me out" cancel-text="Nevermind"
        icon="material-symbols:logout" @confirm="logout" />
    </Teleport>
  </div>
</template>

<script setup>
const session = useSession();
const supabase = useSupabaseClient();
const modal = useModal();
const router = useRouter();

const logout = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) console.log(error)
  else {
    session.clearSession()
    modal.close()
    router.push('/');
  }
}

</script>

<style lang="scss" scoped></style>