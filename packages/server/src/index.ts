import http from "http";
import express from "express";

import { nodelogger } from "@doit/shared/utils";

const app = express();
const PORT = 3194;
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  }),
);
const server = http.createServer(app);

server.listen(PORT, () => {
  nodelogger.nomal("server", "server is runnning on port", PORT);
});
