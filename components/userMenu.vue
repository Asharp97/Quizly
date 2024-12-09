<template>
  <div>
    <div class="user dropdown showonhover">
      <NuxtLink to="/dashboard" class="item">
        <Icon class="icon" name="material-symbols:account-circle-full" />
      </NuxtLink>
      <div class="menu-bg">
        <div class="menu">
          <NuxtLink to="/dashboard" class="item"> Dashboard </NuxtLink>
          <div class="item" @click="modal.show = 'confirm'">Logout</div>
        </div>
      </div>
    </div>
    <Teleport to="body">
      <prompt
        msg="Are you sure you want to logout?"
        action-text="Log me out"
        cancel-text="Nevermind"
        icon="material-symbols:logout"
        condition="confirm"
        @confirm="logout" />
      <prompt
        msg="Your Quiz has been successfully Published"
        condition="quizDone"
        cancel-text="Okay"
        icon="line-md:confirm-circle" />
    </Teleport>
  </div>
</template>

<script setup>
const supabase = useSupabaseClient();
const router = useRouter();
const session = useSession();
const modal = useModal();

const logout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) console.log(error);
  else {
    session.clear();
    modal.close();
    router.push("/");
  }
};
</script>

<style lang="scss" scoped>
.user {
  .icon {
    font-size: 2rem;
    color: $blue;

    &:hover {
      color: $orange;
    }
  }
}
</style>
