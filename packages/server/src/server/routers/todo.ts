import express from "express";
import { getAllTodosDummy } from "../controllers/todo";

export const todoRouter = express.Router();

todoRouter.get("/getall", getAllTodosDummy);
