import { buildApp } from "./app.js";
import { loadConfig } from "./config.js";

const config = loadConfig();
const app = await buildApp({ configOverrides: config, logger: true });

await app.listen({ port: config.port, host: config.host });

for (const signal of ["SIGINT", "SIGTERM"] as const) {
  process.once(signal, () => {
    app
      .close()
      .then(() => process.exit(0))
      .catch((err) => {
        app.log.error(err);
        process.exit(1);
      });
  });
}
