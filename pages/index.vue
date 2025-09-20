<template>
  <div class="container body hero">
    <div class="media">
      <!-- <img src="" alt="" /> -->
    </div>
    <div class="action">
      <div class="quizly-title">
        <h1>Build</h1>
        &nbsp;
        <h1>
          <ul class="cover-remove">
            <li>Quizzes</li>
            <li>Surveys</li>
            <li>Forms</li>
            <li>Quizzes</li>
          </ul>
        </h1>
      </div>
      <h1>
        <span class="orange">Quizly </span> just Does It
        <span class="blue"> All </span>
      </h1>
      <p>
        Build engaging quizzes, insightful surveys, and seamless forms crafted
        for educators, enterprises, and everyone in between.
      </p>
      <Btn text="START NOW" @click="handleStartNowClick()" />
    </div>
  </div>
</template>

<script setup>
const session = useSession();
const { isLoggedIn } = storeToRefs(session);
const modal = useModal();
const router = useRouter();

const handleStartNowClick = () => {
  if (isLoggedIn.value) router.push("/dashboard");
  else modal.auth = true;
};
</script>

<style lang="scss" scoped>
h1 {
  display: inline !important;
}
</style>
