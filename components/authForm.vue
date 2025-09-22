<template>
  <div>
    <form>
      <Btn
        icon="logos:google-icon"
        provider="true"
        target="_blank"
        @click="googleAuth">
        Continue with Google
      </Btn>

      <div class="hr" />

      <div class="input-wrapper" :class="{ error: emailError }">
        <input
          v-model="email"
          required
          name="email"
          type="Email"
          placeholder="Email address"
          @blur="emailCheck" />

        <Transition name="fade">
          <div v-if="emailError" class="errormessage">{{ emailError }}</div>
        </Transition>
      </div>

      <div class="input-wrapper" :class="{ error: passwordError }">
        <input
          v-model="password"
          required
          name="password"
          :type="showPassword ? 'text' : 'password'"
          placeholder="Password"
          @blur="passCheck" />
        <Transition name="fade">
          <div v-if="passwordError" class="errormessage">
            {{ passwordError }}
          </div>
        </Transition>

        <Icon
          :name="showPassword ? 'gridicons:visible' : 'gridicons:not-visible'"
          class="icon"
          @click="showPassword = !showPassword" />
      </div>

      <button @click="auth.login('ali-h@hotmail.com', 'ali123')">
        sign me up quick for test
      </button>
      <div class="form-buttons">
        <Transition name="slide-up">
          <btn v-if="signupActive" text="Sign up with email" @click="signUp" />
        </Transition>
        <Transition name="slide-up">
          <btn
            v-if="!signupActive"
            text="Log right in with email"
            :provider="true"
            @click="login" />
        </Transition>
      </div>
      <p v-if="signupActive" class="member" @click="signupActive = false">
        Already a member? Login Now
      </p>
      <p v-else class="member" @click="signupActive = true">
        Not a member? Sign up now
      </p>
    </form>
  </div>
</template>

<script setup>
import { validateEmail, validatePassword } from "@/utils/validations";

const session = useSession();
const { isLoggedIn } = storeToRefs(session);
const modal = useModal();
const router = useRouter();
const auth = useAuth();
const showPassword = ref(false);
const signupActive = ref(false);

const email = ref("");
const password = ref("");

const emailError = ref(null);
const passwordError = ref(null);

const emailCheck = () => {
  const { isValid, error } = validateEmail(email.value);
  emailError.value = error;
  return isValid;
};

const passCheck = () => {
  const { isValid, error } = validatePassword(password.value);
  passwordError.value = error;
  return isValid;
};

const login = async () => {
  if (!emailCheck() || !passCheck()) return;
  const { error } = await auth.login(email.value, password.value);
  if (isLoggedIn.value) {
    await router.push("/dashboard");
    modal.close();
  } else if (error) {
    passwordError.value = "Invalid email or password";
    console.log(error);
  }
};

const signUp = async () => {
  await auth.signUp(email.value, password.value);
  if (isLoggedIn.value) {
    await router.push("/dashboard");
    modal.close();
  } else {
    passwordError.value = "Oh no! Something went wrong.";
  }
};
const googleAuth = (event) => {
  event.preventDefault();
  const config = useRuntimeConfig();
  window.location.href = config.public.apiUrl + "/auth/google";
};
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
    color: $dimgrey;
  }
}

.fade-enter-active {
  animation: fade-in 0.5s $brake;
}

.fade-leave-active {
  animation: fade-in 0.5s $reversebrake reverse;
}
</style>
