import http from "http";
import express from "express";

import { serverlogger } from "../utils";

const startServer = () => {
  const app = express();
  const PORT = 3194;
  app.use(express.json());
  app.use(
    express.urlencoded({
      extended: true,
    }),
  );
  const server = http.createServer(app);

  app.get("/ping", (_, res) => {
    res.json({
      pong: "server is running",
    });
  });

  server.listen(PORT, () => {
    serverlogger.nomal("server", __filename, "server is runnning on port", PORT);
  });
};

export default startServer;
