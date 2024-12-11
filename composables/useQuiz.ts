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
  const description = ref();
  const show_result = ref();

  const list = ref([]);

  const user = ref();
  const responses = ref();

  const qquiz = ref({});

  function reset() {
    id.value = null;
    name.value = "";
    menu.value = null;
    sharingKey.value = null;
  }

  function set(x: any) {
    id.value = x?.id;
    name.value = x?.text;
    description.value = x?.description;
    user.value = x?.user_id;
    sharingKey.value = x?.sharing_key;
    responses.value = x?.responses;
    show_result.value = x?.show_result;
    
  }

  const get = async (x?: number) => {
    if (x) {
      const { data, error } = await supabase
        .from("quizes")
        .select()
        .eq("id", x);
      if (data) set(data[0]);
      else console.log(error);
    } else {
      const { data, error } = await supabase
        .from("quizes")
        .select()
        .order("created_at", {
          ascending: true,
        });
      if (data) {
        set(data[0]);
        list.value = data;
      } else console.log(error);
    }
  };

  const post = async () => {
    sharingKey.value = nanoid(10);
    const { data, error } = await supabase
      .from("quizes")
      .insert({
        text: name.value,
        sharing_key: sharingKey.value,
        user_id: session.user.id,
      })
      .select();
    if (error) console.log(error);
    else {
      await get();
      modal.close();
      set(data[0]);
    }
  };
  const del = async (x: number) => {
    const response = await supabase.from("quizes").delete().eq("id", x);
    if (response.status == 204) {
      await get();
      modal.close();
    }
    log(response)
  };
  const edit = async () => {
    const { error } = await supabase
      .from("quizes")
      .update({ text: name.value, description: description.value })
      .eq("id", id.value);
    if (error) console.log(error);
    else {
      await get();
      modal.close();
    }
  };

  return { id, name, menu, sharingKey, list, reset, set, get, post, del, edit };
});
