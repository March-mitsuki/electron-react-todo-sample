import http from "http";
import express from "express";

import { serverlogger } from "../utils";
import { todoRouter } from "./routers";

const startServer = (PORT: number) => {
  const app = express();
  app.use(express.json());
  app.use(
    express.urlencoded({
      extended: true,
    }),
  );
  const server = http.createServer(app);

  app.get("/ping", (req, res) => {
    serverlogger.nomal({
      prefix: "api",
      filename: __filename,
      writeOnly: true,
      msgs: ["/ping called with req:", req],
    });
    res.json({
      pong: "server is running",
    });
  });

  app.use("/todo", todoRouter);

  server.listen(PORT, () => {
    serverlogger.nomal({
      prefix: "server",
      filename: __filename,
      msgs: ["server is runnning on port", PORT],
    });
  });
};

export default startServer;
