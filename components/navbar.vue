<template>
  <div>
    {{ session }}
    <nav>
      <div class="nav-content container">
        <NuxtLink to="/" class="logo">
          <img src="/img/logo.png" alt="quizly logo">
        </NuxtLink>

        
        <div class="user dropdown" v-if="session">
          <Icon name="material-symbols:account-circle-full" />
          <div class="menu-bg">
            <div class="menu">
              <!-- <NuxtLink to="/profile"> -->
                <div class="item">
                  My Profile
              </div>
              <!-- </NuxtLink> -->
              <!-- <NuxtLink to="/quizMaker"> -->
              <div class="item">
                Make a quiz
              </div>
              <!-- </NuxtLink> -->
              <div class="item" @click="logout">
                Logout
              </div>
            </div>
          </div>
        </div>

        <div class="auth-buttons" v-else>
          <Btn text="Sign Up" @click="modal.toggleModal()" />
          <Btn text="Login" @click="modal.toggleModal()" inv="true" />
        </div>
      </div>
    </nav>
    <Teleport to="body">
      <Auth :show="modal.show.value" @close="modal.toggleModal" />
    </Teleport>
  </div>
</template>

<script setup>
const session = useSession();
const supabase = useSupabaseClient()
const modal = useModal();

console.log(session.user)

const logout = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) console.log(error)
  else session.value = null
}

</script>

<style lang="scss" scoped></style>