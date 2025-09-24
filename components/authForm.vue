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
          data-testid="email-input"
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
          data-testid="password-input"
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

      <button @click="fillform">fill form for dev</button>
      <div class="form-buttons">
        <Transition name="slide-up">
          <btn v-if="!signUpActive" text="Sign up with email" @click="signUp" />
        </Transition>
        <Transition name="slide-up">
          <btn
            v-if="signUpActive"
            data-testid="login-button"
            text="Log right in with email"
            :provider="true"
            @click="login" />
        </Transition>
      </div>
      <p
        v-if="signUpActive"
        class="member"
        @click="signUpActive = !signUpActive">
        Already a member? Login Now
      </p>
      <p v-else class="member" @click="signUpActive = !signUpActive">
        Not a member? Sign up now
      </p>
    </form>
  </div>
</template>

<script setup>
import { validateEmail, validatePassword } from "@/utils/validations";

const config = useRuntimeConfig();
const session = useSession();
const { isLoggedIn } = storeToRefs(session);
const modal = useModal();
const router = useRouter();
const auth = useAuth();
const showPassword = ref(false);

const email = ref("");
const password = ref("");

const emailError = ref(null);
const passwordError = ref(null);
const signUpActive = ref(false);

let currentUrl = "";
onMounted(() => {
  currentUrl = window.location.href;
  if (modal.show === ModalType.AUTH) signUpActive.value = true;
  else signUpActive.value = false;
});

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
const handleRedirect = () => {
  if (
    isLoggedIn.value &&
    currentUrl.startsWith(config.public.frontendUrl + "quiz")
  ) {
    modal.close();
  } else if (isLoggedIn.value && currentUrl === config.public.frontendUrl) {
    router.push("/dashboard");
    modal.close();
  }
};

const login = async () => {
  if (!emailCheck() || !passCheck()) return;
  const login = await auth.login(email.value, password.value);
  if (!login) {
    passwordError.value = "Oh no! Something went wrong.";
    return;
  }
  handleRedirect();
};

const signUp = async () => {
  const signup = await auth.signUp(email.value, password.value);
  if (!signup) {
    passwordError.value = "Oh no! Something went wrong.";
    return;
  }
  handleRedirect();
};
const googleAuth = (event) => {
  event.preventDefault();
  window.location.href = config.public.apiUrl + "/auth/google";
};

const fillform = (event) => {
  event.preventDefault();
  email.value = "ali-h@hotmail.com";
  password.value = "ali123";
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
