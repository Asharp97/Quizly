<template>
  <!-- End-of-quiz modal prompt -->
  <prompt
    :condition="ModalType.END_QUIZ"
    action-text="okay"
    msg="Your quiz has ended. Thank you for participating!"
    icon="mdi:timer-sand-empty"
    @close="quizEnded()"
    @confirm="quizEnded()" />r
</template>

<script setup>
// Show end-of-quiz modal when page mounts
const modal = useModal();
onMounted(() => {
  modal.show = ModalType.END_QUIZ;
});
// Handler for closing or confirming the modal, navigates to home page
const quizEnded = () => {
  navigateTo("/");
};
</script>

<style lang="scss" scoped></style>
