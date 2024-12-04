import { defineStore } from "pinia";
export const useQuiz = defineStore("quiz", () => {
  const supabase = useSupabaseClient();

  const id = ref();
  const name = ref("");
  const menu = ref(null);
  const sharingKey = ref(null);

  const user = ref();
  const responses = ref();

  function reset() {
    id.value = null;
    name.value = "";
    menu.value = null;
    sharingKey.value = null;
  }
  function set(x: any) {
    id.value = x.id;
    name.value = x.text;
    user.value = x.user_id;
    sharingKey.value = x.sharing_key;
    responses.value = x.responses;
  }
  const get = async (x: any) => {
    const query = supabase.from("quizes").select();
    if (x) {
      const { data, error } = await query.eq("id", x);
      if (data) set(data[0]);
      else console.log(error);
    } else {
      const { data, error } = await query.order("created_at", {
        ascending: false,
      });
      if (data?.length) {
        set(data[0]);
        return data;
      } else console.log(error);
    }
  };

  return { id, name, menu, sharingKey, reset, set, get };
});
