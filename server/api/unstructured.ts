import { UnstructuredClient } from "unstructured-client";
import { PartitionResponse } from "unstructured-client/sdk/models/operations";
import { Strategy } from "unstructured-client/sdk/models/shared";
import { readFileSync, writeFileSync } from "fs";
import { useRuntimeConfig } from "#imports";


export default defineEventHandler(async () => {
  // Access environment variables using Nuxt's runtime config
  const config = useRuntimeConfig();
  // const apiKey = config.unstructuredApiKey;
  // const apiUrl = config.unstructuredApiUrl;

  // const key = "Qw5FfEbc9IPA3M8P2Mvnmg0RvHPowx";
  // const url = "https://api.unstructuredapp.io/general/v0/general";

  // const client = new UnstructuredClient({
  //   serverURL: apiurl,
  //   security: {
  //     apiKeyAuth: apikey,
  //   },
  // });

  const inputFilePath = "../quizly/test_lectures/inp.pdf"; // Adjust the input file path
  const outputFilePath = "../quizly/test_lectures/123.txt"; // Adjust the output file path
  const file = readFileSync(inputFilePath);
  let jsonElements = "";

  // const res: PartitionResponse = await client.general.partition({
  //   partitionParameters: {
  //     files: {
  //       content: file,
  //       fileName: inputFilePath,
  //     },
  //     strategy: Strategy.HiRes,
  //     splitPdfPage: true,
  //     splitPdfAllowFailed: true,
  //     splitPdfConcurrencyLevel: 15,
  //     languages: ["eng"],
  //   },
  // });

  // if (res.statusCode === 200) {
  //   console.log("Partitioning successful!");
  //   console.log(res.elements?.[0]); // Print the first partitioned element

  //   // Write the processed file to an output file
  //   jsonElements = JSON.stringify(res.elements, null, 2);
  //   // writeFileSync(outputFilePath, jsonElements);
  // } else {
  //   console.error("Error in partitioning:", res);
  // }
  console.log(file)
  return file
  // JSON.parse(jsonElements);
});
