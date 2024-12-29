<template>
  <div class="container body hero">
    <div class="media">
      <img src="" alt="" />
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
      <h1 class="orange">Quizly just Does It All</h1>
      <p>
        Build engaging quizzes, insightful surveys, and seamless forms crafted
        for educators, enterprises, and everyone in between.
      </p>
      <Btn text="START NOW" @click="modal.auth = true" />
    </div>
  </div>
</template>

<script setup>
const modal = useModal();
</script>

<style lang="scss" scoped></style>
