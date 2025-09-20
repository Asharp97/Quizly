export default defineNuxtPlugin(() => {
  useGqlError((err: any) => {
    if (process.env.NODE_ENV !== "production") {
      for (const gqlError of err.gqlErrors) {
        console.error("[nuxt-graphql-client] [GraphQL error]", {
          client: err.client,
          statusCode: err.statusCode,
          operationType: err.operationType,
          operationName: err.operationName,
          gqlError,
        });
      }
    }
    const auth = useAuth();
    if (process.env.NODE_ENV !== "production") {
      for (const gqlError of err.gqlErrors) console.log(gqlError.message);
    }

    const tokenExpired = err.gqlErrors.some(
      (e) => e.extensions?.originalError?.statusCode === 401
    );

    if (tokenExpired) {
      auth.refreshToken();
      if (process.env.NODE_ENV !== "production") console.log("Token refreshed");
    }
  });
});
