import { initDotEnv } from "@doit/shared";

import http from "http";
import express from "express";

import { serverlogger } from "./utils";

async function main() {
  await initDotEnv();
  const app = express();
  const PORT = 3194;
  app.use(express.json());
  app.use(
    express.urlencoded({
      extended: true,
    }),
  );
  const server = http.createServer(app);

  app.get("/ping", (req, res) => {
    res.json({
      pong: "server is running",
    });
  });

  server.listen(PORT, () => {
    serverlogger.nomal("server", "server is runnning on port", PORT);
  });
}

main(); // eslint-disable-line
