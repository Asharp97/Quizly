// Nuxt plugin to handle GraphQL errors and refresh authentication token if expired
export default defineNuxtPlugin(() => {
  useGqlError((err: any) => {
    // Log GraphQL errors in development mode
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
    const auth = useAuth(); // Auth composable for token management
    if (process.env.NODE_ENV !== "production") {
      for (const gqlError of err.gqlErrors) console.log(gqlError.message);
    }

    // Check if any error is due to expired token (401)
    const tokenExpired = err.gqlErrors.some(
      (e) => e.extensions?.originalError?.statusCode === 401
    );

    // If token expired, refresh it
    if (tokenExpired) {
      auth.refreshToken();
      if (process.env.NODE_ENV !== "production") console.log("Token refreshed");
    }
  });
});
