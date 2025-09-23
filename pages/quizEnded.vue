<template>
  <prompt
    :condition="ModalType.END_QUIZ"
    action-text="okay"
    msg="Your quiz has ended. Thank you for participating!"
    icon="mdi:timer-sand-empty"
    @close="quizEnded()"
    @confirm="quizEnded()" />
</template>

<script setup>
const modal = useModal();
onMounted(() => {
  modal.show = ModalType.END_QUIZ;
});
const quizEnded = () => {
  navigateTo("/");
};
</script>

<style lang="scss" scoped></style>
