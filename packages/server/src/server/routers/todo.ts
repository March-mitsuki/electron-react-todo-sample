import express from "express";

export const todoRouter = express.Router();

todoRouter.get("/getall", (_, res) => {
  res.json({ msg: "all todos called" });
  return;
});
