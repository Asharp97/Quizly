<template>
  <div>
    <nav>
      <div class="content container">
        <NuxtLink to="/">
          <img src="/img/quizly.png" alt="quizly logo" class="logo">
        </NuxtLink>

        <Btn text="Sign In" destination="auth" v-if="session.user" />
        <div class="user dropdown" v-else>
          <Icon name="material-symbols:account-circle-full" />
          <div class="menu-bg">
            <div class="menu">
              <NuxtLink to="/profile">
                <div class="item">
                  My Profile
                </div>
              </NuxtLink>
              <NuxtLink to="/quizMaker">
                <div class="item">
                  Make a quiz
                </div>
              </NuxtLink>
              <div class="item" @click="logout">
                Logout
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  </div>
</template>

<script setup>
const session = useSession();
const supabase = useSupabaseClient()

const logout = async () => {
  const { error } = await supabase.auth.signOut()
  session.clearSession()
  console.log(session.user.value, session.token.value)
}
</script>

<style lang="scss" scoped></style>