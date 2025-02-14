import { UnstructuredClient } from "unstructured-client";
import { PartitionResponse } from "unstructured-client/sdk/models/operations";
import { Strategy } from "unstructured-client/sdk/models/shared";
import { readFileSync, writeFileSync } from "fs";
import { useRuntimeConfig } from "#imports";

export function useAI() {
  const supabase = useSupabaseClient();
  const config = useRuntimeConfig();
  const apiKey = config.unstructuredApiKey;
  const apiUrl = config.unstructuredApiUrl;

  async function getURL(uuid: number, quizId: number, file: string) {
    const { data, error } = await supabase.storage
      .from("notes")
      .createSignedUrl(`${uuid}/${quizId}/${file}`, 60);
    if (data) return data.signedUrl;
  }

  return { getURL };
}
