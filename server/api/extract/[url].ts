import { UnstructuredClient } from "unstructured-client";
import { PartitionResponse } from "unstructured-client/sdk/models/operations";
import { Strategy } from "unstructured-client/sdk/models/shared";
import { readFileSync, writeFileSync } from "fs";
import { useRuntimeConfig } from "#imports";

export default defineEventHandler((event) => {
  // const url = getRouterParam(event, "url");
  const inputFilePath = 'https://ofebjxsibfiuaoanyvnr.supabase.co/storage/v1/object/sign/notes/46bd7c6c-2673-44a8-8c29-b48aa885cfd5/72/inp.pdf?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJub3Rlcy80NmJkN2M2Yy0yNjczLTQ0YTgtOGMyOS1iNDhhYTg4NWNmZDUvNzIvaW5wLnBkZiIsImlhdCI6MTczOTI4Njc0MiwiZXhwIjoxNzM5Mjg2ODAyfQ.TW-n6VIumwKjZkCoeTeEnw6cAgcznEhYo4oaMW9BEQk'

  // const inputFilePath = "../quizly/test_lectures/inp.pdf"; // Adjust the input file path
  // console.log(url);
  // return url
  const data = readFileSync(inputFilePath);
  console.log(data)
  return data;

  // const outputFilePath = "../quizly/test_lectures/123.txt"; // Adjust the output file path
});
