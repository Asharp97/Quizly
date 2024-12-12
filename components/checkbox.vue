<template>
  <div class="checkbox-wrapper">
    <h4>{{ label }}</h4>
    <input
      :id="id"
      type="checkbox"
      :checked="modelValue"
      @input="updateValue($event.target.checked)"
    />

    <label :for="id" />
  </div>
</template>

<script setup>
defineProps(["modelValue", "label", "id"]);
const emit = defineEmits(["update:modelValue"]);

function updateValue(value) {
  emit("update:modelValue", value);
}
</script>

<style lang="scss" scoped>
.checkbox-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
}
.checkbox-wrapper input[type="checkbox"] {
  height: 0;
  width: 0;
  visibility: hidden;
}

.checkbox-wrapper label {
  $size: 3rem;

  cursor: pointer;
  width: $size;
  height: calc($size / 2);
  background: grey;
  display: block;
  // border-radius: 100px;
  position: relative;
}

.checkbox-wrapper label:after {
  content: "";
  position: absolute;
  top: 6%;
  left: 2.5%;
  width: calc(50% - 5%);
  height: calc(100% - 11%);
  background: #fff;
  // border-radius: 90px;
  transition: 0.3s;
}

.checkbox-wrapper input:checked + label {
  background: $blue;
}

.checkbox-wrapper input:checked + label:after {
  left: calc(100% - 2.5%);
  transform: translateX(-100%);
}

.checkbox-wrapper label:active:after {
  width: 55%;
}
</style>
