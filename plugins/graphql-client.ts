// export default defineNuxtPlugin((nuxtApp) => {
//   const { $gql } = nuxtApp;

//   // This function will be called before every GraphQL request
//   $gql.default.onRequest(async (req) => {
//     const token = useCookie("accessToken");
//     if (token.value) {
//       req.options.headers = {
//         ...req.options.headers,
//         Authorization: `Bearer ${token.value}`,
//       };
//     }
//   });
// });
