import express from "express";
import cors from "cors";
import { userRouter } from "./router/userRouter";

import dotenv from "dotenv";
import { postsRouter } from "./router/postsRouter";
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.listen(process.env.PORT || 3003, () => {
  console.log(`Servidor rodando na porta ${process.env.PORT || 3003}`);
});

app.use("/users", userRouter);
app.use("/posts", postsRouter)
