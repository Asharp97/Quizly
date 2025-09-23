<template>
  <!-- Main hero section for Quizly landing page -->
  <div class="container body hero">
    <div class="media">
      <!-- Placeholder for hero image (currently commented out) -->
    </div>
    <div class="action">
      <!-- Dynamic title section cycling through types -->
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
      <!-- Call-to-action button, triggers login or dashboard navigation -->
      <Btn text="START NOW" @click="handleStartNowClick()" />
    </div>
  </div>
</template>

<script setup>
// Import session and modal composables, and router for navigation
const session = useSession();
const { isLoggedIn } = storeToRefs(session);
const modal = useModal();
const router = useRouter();

// Handles the START NOW button click
// If user is logged in, go to dashboard; otherwise, open auth modal
const handleStartNowClick = () => {
  if (isLoggedIn.value) router.push("/dashboard");
  else modal.auth = true;
};
</script>

<style lang="scss" scoped>
// Ensure all h1 elements display inline for layout
h1 {
  display: inline !important;
}
</style>
