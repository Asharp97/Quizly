import { defineStore } from "pinia";
import { nanoid } from "nanoid";

export const useScore = defineStore("score", () => {
  const supabase = useSupabaseClient();
  const session = useSession();
  const modal = useModal();
  const question = useQuestion();
  const participant = useParticipant();
  const log = console.log;

  const id = ref();
  const list = ref([]);
  const score = ref();
  const submissions = ref([]);

  function reset() {
    id.value = null;
    list.value = [];
    score.value = null;
    submissions.value = [];
  }

  function set(x: any) {
    id.value = x?.id;
    score.value = x?.score;
  }

  const get = async (x?: number) => {
    if (x) {
      const { data, error } = await supabase
        .from("scores")
        .select()
        .eq("participant_id", x)
        .single();
      if (data) {
        set(data);
        return data?.score;
      } else log(error);
    } else {
      const { data, error } = await supabase.from("scores").select();
      if (data) {
        if (!id.value) set(data[0]);
        list.value = data;
      } else log(error);
    }
  };

  const post = async (x: Array<number>) => {
    const { data, error } = await supabase
      .from("scores")
      .insert(x)
      .select()
      .single();
    if (error) log(error);
    else await get();
  };

  return {
    id,
    score,
    submissions,
    list,
    reset,
    get,
    post,
  };
});
