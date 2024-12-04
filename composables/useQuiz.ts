import { defineStore } from "pinia";
import { nanoid } from "nanoid";

export const useQuiz = defineStore("quiz", () => {
  const supabase = useSupabaseClient();
  const session = useSession();
  const modal = useModal();

  const db = supabase.from("quizes");

  const id = ref();
  const name = ref("");
  const menu = ref(null);
  const sharingKey = ref(null);

  const list = ref([]);

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
  const get = async (x?: number) => {
    const query = db.select();
    if (x) {
      const { data, error } = await query.eq("id", x);
      if (data) set(data[0]);
      else console.log(error);
    } else {
      const { data, error } = await query.order("created_at", {
        ascending: false,
      });
      if (data?.length) {
        list.value = data;
        set(data[0]);
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
    const response = await db.delete().eq("id", x);
    if (response.status == 204) {
      await get();
      modal.close();
    }
  };
  const edit = async () => {
    const { error } = await db.update({ text: name.value }).eq("id", id.value);
    if (error) console.log(error);
    else {
      await get();
      modal.close();
    }
  };

  return { id, name, menu, sharingKey, list, reset, set, get, post, del, edit };
});
