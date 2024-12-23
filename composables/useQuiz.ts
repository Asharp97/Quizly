import { defineStore } from "pinia";
import { nanoid } from "nanoid";

export const useQuiz = defineStore("quiz", () => {
  const supabase = useSupabaseClient();
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
    if (x) {
      const { data, error } = await supabase
        .from("quizes")
        .select()
        .eq("id", x)
        .single();
      if (data) set(data);
      else log(error);
    } else {
      const { data, error } = await supabase
        .from("quizes")
        .select()
        .order("created_at", {
          ascending: true,
        });
      if (data) {
        if (!id.value) set(data[0]);
        list.value = data;
      } else log(error);
    }
  };

  const post = async () => {
    boolCheck();
    sharingKey.value = nanoid(10);
    const { data, error } = await supabase
      .from("quizes")
      .insert({
        text: name.value,
        sharing_key: sharingKey.value,
        description: description.value,
        show_result: show_result.value,
        time: time.value,
        deadLine: deadLine.value,
        user_id: session.user.id,
      })
      .select()
      .single();
    if (error) log(error);
    else {
      await get();
      modal.close();
      set(data);
    }
  };
  const del = async (x: number) => {
    const response = await supabase.from("quizes").delete().eq("id", x);
    if (response.status == 204) {
      await get();
      modal.close();
    }
  };

  const boolCheck = () => {
    if (deadLine.value == true || deadLine.value == false)
      deadLine.value = null;
    if (time.value == true || time.value == false || time.value == 0)
      time.value = null;
  };

  const edit = async () => {
    boolCheck();
    const { error } = await supabase
      .from("quizes")
      .update({
        text: name.value,
        description: description.value,
        show_result: show_result.value,
        time: time.value,
        deadLine: deadLine.value,
      })
      .eq("id", id.value);
    if (error) log(error);
    else {
      await get();
      modal.close();
    }
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
