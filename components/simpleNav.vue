<template>
  <div>
    <nav>
      <div class="simpleNav">
        <NuxtLink to="/">
          <h3>Quizly</h3>
        </NuxtLink>

        <div class="lang dropdown">
          <span>English</span>
          <Icon name="material-symbols:keyboard-arrow-down-rounded" />
          <div class="menu-bg">
            <div class="menu">
              <div class="item">
                arabic
              </div>
              <div class="item">
                turkish
              </div>
              <div class="item">
                french
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
.simpleNav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding-inline: 1rem;
}
</style>