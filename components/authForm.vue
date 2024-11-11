<template>
  <div>
    <form>
      <Btn icon="logos:google-icon" provider="true" @click="googleAuth"> Continue with Google </Btn>

      <div class="hr"></div>

      <div class="input-wrapper" :class="{ 'error': error[0].hasError }">
        <input type="Email" placeholder="Email address" v-model="email" @blur="emailCheck" />

        <Transition name="fade">
          <div class="errormessage" v-if="error[0].hasError">{{ error[0].message }}</div>
        </Transition>
      </div>

      <div class="input-wrapper" :class="{ 'error': error[1].hasError }">
        <input :type="showPassword ? 'text' : 'password'" placeholder="Password" v-model="password" @blur="passCheck" />
        <Transition name="fade">
          <div class="errormessage" v-if="error[1].hasError">{{ error[1].message }}</div>
        </Transition>

        <Icon :name="showPassword ? 'gridicons:visible' : 'gridicons:not-visible'" @click="showPassword = !showPassword"
          class="icon" />
      </div>

      <btn text="Contiue with email" @click="login" />
    </form>
  </div>
</template>

<script setup>
const supabase = useSupabaseClient()
const session = useSession();
const showPassword = ref(false);

const email = ref('');
const password = ref('');

const error =
  ref([
    { hasError: false, message: '' },
    { hasError: false, message: '' }
  ]);


const emailCheck = () => {
  if (email.value.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)
    || email.value == '')
    error.value[0].hasError = false
  else error.value[0] = {
    hasError: true,
    message: 'Please enter a valid email address.'
  };
}


const passCheck = () => {
  if (password.value.length > 6 || password.value.length == 0) {
    error.value[1] = {
      hasError: true
    }
  } else
    error.value[1] = {
      hasError: true,
      message: 'Password must be at least 6 characters long.'
    };
}

const login = async () => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  })
  if (data) {
    // setSession(data)
    session.value = data
    // console.log('look mom', data)
    
  }
  else console.log(error)
}
// console.log(session.value = data)

// const signUp = async () => {
//   const { data, error } = await supabase.auth.signUp({
//     email: email.value,
//     password: password.value,
//   })
//   if (data) {
//     console.log('look mom', session)
//   }
//   else console.log(error)
// }

const googleAuth = () => {
  supabase.auth.signInWithOAuth({
    provider: 'google',
  })
}
</script>

<style lang="scss" scoped>
.input-wrapper {
  position: relative;
  height: 2.5rem;
  margin-bottom: 1.5rem;

  input {
    margin-bottom: 0;
  }

  .error {
    border: 1px solid $orange !important;
  }

  .icon {
    border: none;
    position: absolute;
    right: 0.5rem;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
  }
}

.errormessage {
  color: $orange;
  font-weight: 500;
}

.fade-enter-active {
  animation: fade-in .5s $brake;
}

.fade-leave-active {
  animation: fade-in .5s $reversebrake reverse;
}
</style>
