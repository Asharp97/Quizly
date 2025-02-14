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
              @click.stop="deleteFile(n, file.name)" />
          </button>
        </div>
      </TransitionGroup>
    </button>

    <div v-if="error" class="errormessage">
      {{ error }}
    </div>
    <div>
      <Btn @click="sendFiles()">Make me a quiz</Btn>
      <Btn @click="handleGen()">show me what we did</Btn>
    </div>
  </TransitionGroup>
</template>

<script setup>
const error = ref(null);
const files = ref([]);
const supabase = useSupabaseClient();
const quiz = useQuiz();
const session = useSession();
const uuid = session.user.id;
const ai = useAI();

const handleGen = async () => {
  const url = await ai.getURL(uuid, quiz.id, files.value[0].name);
  console.log(url);
  const data = await useFetch(`/api/extract/name}`);
  console.log(data.data.value);
};

// Function to handle file selection
const selectFiles = (event) => {
  files.value.push(...Array.from(event.target.files));

  const validFiles = files.value.filter((file) => isValidFileType(file.type));

  if (validFiles.length === 0) {
    error.value = "Invalid file types. Please upload valid files.";
    return;
  }
  error.value = null; // Clear errors if valid files found
};

onMounted(async () => {
  await getFiles();
});

const getFiles = async () => {
  const { data, error } = await supabase.storage
    .from("notes")
    .list(`${uuid}/${quiz.id}`, {
      limit: 100,
      offset: 0,
      sortBy: { column: "name", order: "asc" },
    });

  if (data) files.value = data;
};
const deleteFile = async (n, name) => {
  const { data, error } = await supabase.storage
    .from("notes")
    .remove(`${uuid}/${quiz.id}/${name}`);

  files.value.splice(n, 1);

  if (data) {
    await getFiles();
    return data;
  }
};
const sendFiles = async () => {
  await Promise.all(
    files.value.map((file) => {
      return supabase.storage
        .from("notes")
        .upload(`${uuid}/${quiz.id}/${file.name}`, file, {
          cacheControl: "3600",
          upsert: true,
        });
    })
  );
};

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
        span {
          color: $blue;
        }
        .delete-file {
          color: black;
          all: unset;
          cursor: pointer;
          padding: 0.5rem;
          color: $blue;
          &:hover {
            span {
              transform: rotate(15deg);
              scale: 1.06;
            }
          }
          span {
            transform: translateY(2px);
          }
        }
      }
    }
    .icon {
      font-size: 3rem;
    }
  }
}
</style>
