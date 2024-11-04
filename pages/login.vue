<template>
  <div class="body log-in">
    <div class="auth">
      <div class="make-account">
        <h3 class="title">QUIZLY</h3>
        <p>Create engaging quizzes, collect insightful data, and connect with your audience seamlessly.</p>
        <form action="" class="form ">
          <input type="email" v-model="mail" placeholder="Email" name="email" />
          <div class="password-wrapper">
            <input :type="hide ? 'password' : 'string'" v-model="pass" placeholder="Password" name="password" />
            <button @click.prevent="hide = !hide">
              <Icon :name="hide ? 'material-symbols:visibility-rounded' : 'material-symbols:visibility-off-rounded'" />
            </button>
          </div>

          <Btn text="Creat Free Account" @click="signup" />
        </form>
      </div>
    </div>
    <div class="background">
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'simple' })

const session = useSession();

const hide = ref(true)

const mail = ref('')
const pass = ref('')

const supabase = useSupabaseClient()

const login = async () => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: mail.value,
    password: pass.value,
  })
  if (data) {
    session.setUser(true);
    session.setToken(data);
  }
  else
    console.log(error)

}

</script>

<style lang="scss" scoped></style>
