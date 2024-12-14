<template>
  <div class="timer">
    <h2 :class="{ almostDone: minute == 0 && second < 30 }">
      {{ minute }}:{{ second }}<span v-if="second < 9">0</span>
    </h2>
  </div>
</template>
<script setup lang="ts">
import { useTimeoutPoll } from "@vueuse/core";
import { promiseTimeout } from "@vueuse/shared";

const emit = defineEmits(["timeup"]);
const props = defineProps(["minutes"]);

const second = ref(0);
const minute = ref();

minute.value = props.minutes;

async function fetchData() {
  await promiseTimeout(1000);
  if (second.value > 0) second.value--;
  else {
    second.value = 59;
    minute.value--;
    if (minute.value == 0) emit("timeup");
  }
}
onMounted(() => {
  resume();
});

const { resume } = useTimeoutPoll(fetchData, 1000);
</script>
<style lang="scss">
.timer {
  display: flex;
  justify-content: center;
  margin-block: 2rem;
  color: $blue;
  .almostDone {
    color: $orange;
  }
}
</style>
