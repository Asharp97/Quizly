<template>
  <div class="checkbox-wrapper-17">
    <p>{{ label }}</p>
    <input
      id="switch-17"
      type="checkbox"
      :checked="modelValue"
      @input="updateValue($event.target.checked)" />

    <label for="switch-17" />
  </div>
</template>

<script setup>
defineProps(["modelValue", "label"]);
const emit = defineEmits(["update:modelValue"]);

function updateValue(value) {
  emit("update:modelValue", value);
}
</script>

<style lang="scss" scoped>
.checkbox-wrapper-17 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.checkbox-wrapper-17 input[type="checkbox"] {
  height: 0;
  width: 0;
  visibility: hidden;
}

.checkbox-wrapper-17 label {
  $size: 3rem;

  cursor: pointer;
  width: $size;
  height: calc($size / 2);
  background: grey;
  display: block;
  border-radius: 100px;
  position: relative;
}

.checkbox-wrapper-17 label:after {
  content: "";
  position: absolute;
  top: 6%;
  left: 2.5%;
  width: calc(50% - 5%);
  height: calc(100% - 11%);
  background: #fff;
  border-radius: 90px;
  transition: 0.3s;
}

.checkbox-wrapper-17 input:checked + label {
  background: $blue;
}

.checkbox-wrapper-17 input:checked + label:after {
  left: calc(100% - 2.5%);
  transform: translateX(-100%);
}

.checkbox-wrapper-17 label:active:after {
  width: 55%;
}
</style>
