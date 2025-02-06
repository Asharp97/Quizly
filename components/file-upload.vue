<template>
  <TransitionGroup name="slide" tag="div" class="input-wrapper file-input">
    <input
      ref="fileUploadReference"
      type="file"
      style="display: none"
      multiple
      accept=".pdf, .doc, .docx, .ppt, .pptx, .txt, image/png, image/jpg, image/jpeg, image/svg, image/webp"
      @change="selectFiles" />

    <button class="file-upload-area" @click="$refs.fileUploadReference.click()">
      <div v-if="!files.length">
        <Icon name="lets-icons:upload" class="icon" />
        <p>Upload Here</p>
      </div>
      <TransitionGroup name="slide" tag="div" class="file-wrapper">
        <div v-for="(file, n) in files" :key="n" class="file">
          <p>{{ file.name }}</p>
          <button class="delete-file">
            <Icon
              name="ic:baseline-delete"
              class="delete-icon"
              @click.stop="files.splice(n, 1)" />
          </button>
        </div>
      </TransitionGroup>
    </button>

    <div v-if="error" class="errormessage">
      {{ error }}
    </div>
  </TransitionGroup>
</template>

<script setup>
import { ref } from "vue";
const emit = defineEmits(["sendFiles"]);
const error = ref(null);
const files = ref([]);

// Function to handle file selection
const selectFiles = (event) => {
  files.value = Array.from(event.target.files); // Handle multiple files

  // Validate file types
  const validFiles = files.value.filter((file) => isValidFileType(file.type));

  if (validFiles.length === 0) {
    error.value = "Invalid file types. Please upload valid files.";
    return;
  }

  error.value = null; // Clear errors if valid files found

  // Emit the valid files to the parent
  emit("sendFiles", validFiles);
};

// Helper function to check valid file types
const isValidFileType = (type) => {
  const validTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "text/plain",
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/svg+xml",
    "image/webp",
  ];
  return validTypes.includes(type);
};
</script>

<style lang="scss" scoped>
.file-input {
  display: flex;
  flex-direction: column;
  .file-upload-area {
    display: flex;
    flex-direction: column;
    background-color: transparent;
    color: black;
    border: 1px black solid;
    border-radius: 1rem;
    padding-inline: 2.6rem;
    padding-block: 1.8rem;
    .file-wrapper {
      width: 100%;
      :nth-child(even) {
        background-color: $lightgrey;
      }
      .file {
        padding-inline: 0.5rem;
        border-radius: 1rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-weight: 700;
        font-size: 1rem;
        .delete-file {
          color: black;
          all: unset;
          cursor: pointer;
          padding: 0.5rem;
          color: $blue;
          transform: translateY(2px);
        }
      }
    }
    .icon {
      font-size: 3rem;
    }
  }
}
</style>
