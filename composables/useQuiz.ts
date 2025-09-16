import { defineStore } from "pinia";

export const useQuiz = defineStore("quiz", () => {
  const session = useSession();
  const modal = useModal();
  const log = console.log;

  const id = ref();
  const name = ref();
  const menu = ref(null);
  const sharingKey = ref();

  const description = ref("123");
  const show_result = ref(false);
  const time = ref(null);
  const deadLine = ref(null);

  const list = ref([]);

  const user = ref();
  const responses = ref();

  function reset() {
    id.value = null;
    name.value = "";
    menu.value = null;
    sharingKey.value = null;

    time.value = null;
    deadLine.value = null;
    show_result.value = false;
    description.value = "";
  }

  function clearInputs() {
    name.value = "";
    time.value = null;
    deadLine.value = null;
    show_result.value = false;
    description.value = "";
  }

  function set(x: any) {
    id.value = x?.id;
    name.value = x?.text;
    description.value = x?.description;
    sharingKey.value = x?.sharing_key;

    responses.value = x?.responses;
    time.value = x?.time;
    deadLine.value = x?.deadLine;
    show_result.value = x?.show_result;

    user.value = x?.user_id;
  }

  const get = async (x?: number) => {
  };

  const post = async () => {
    return true; //todo
  };
  const del = async (x: number) => {
    return true; //todo
  };

  const boolCheck = () => {
    if (deadLine.value == true || deadLine.value == false) {
      deadLine.value = null;
    }
    if (time.value == true || time.value == false || time.value == 0) {
      time.value = null;
    }
  };

  const edit = async () => {
    return true; //todo
  };

  return {
    id,
    name,
    menu,
    description,
    deadLine,
    time,
    show_result,
    sharingKey,
    list,
    reset,
    set,
    clearInputs,
    get,
    post,
    del,
    edit,
  };
});
