import { createServer } from "./app";

async function main() {
  const app = await createServer();

  app.listen({ port: 3333 }).then(() => {
    console.log("🚀 Server is running on http://localhost:3333");
    console.log("📚 API documentation available at http://localhost:3333/docs");
  });

  return app;
}
main();
