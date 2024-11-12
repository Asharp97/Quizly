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
              <!-- <NuxtLink to="/quizMaker"> -->
              <div class="item">
                Make a quiz
              </div>
              <!-- </NuxtLink> -->
              <div class="item" @click="modal.confirm = true">
                Logout
              </div>
            </div>
          </div>
        </div>

        <div v-else class="auth-buttons">
          <Btn text="Sign Up" @click="modal.show = true" />
          <Btn text="Login" inv="true" @click="modal.show = true" />
        </div>
      </div>
    </nav>
    <Teleport to="body">
      <Auth :show="modal.show" @close="modal.close" />
      <Transition name="scale-up">
        <prompt v-if="modal.confirm" @close="modal.close" @confirm="logout" msg="Are you sure you want to logout?"
          actionText="Log me out" cancelText="Nevermind" icon="material-symbols:logout" />
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
const session = useSession();
const supabase = useSupabaseClient();
const modal = useModal();

const logout = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) console.log(error)
  else session.clearSession()
}

</script>

<style lang="scss" scoped></style>