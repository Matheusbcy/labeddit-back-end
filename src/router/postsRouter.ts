import express from "express";
import { postsControlle } from "../controller/postsController";
import { PostsBusiness } from "../business/postsBusiness";
import { PostsDataBase } from "../database/postsDatabase";
import { TokenManager } from "../services/TokenManager";
import { IdGenerator } from "../services/idGenerator";

export const postsRouter = express.Router();

const postsController = new postsControlle(
  new PostsBusiness(new TokenManager(), new PostsDataBase(), new IdGenerator())
);

postsRouter.get("/", postsController.getPosts);
postsRouter.post("/", postsController.createPosts);
postsRouter.put("/:id", postsController.editPosts);
postsRouter.delete("/:id", postsController.deletePost);
postsRouter.put("/:id/like", postsController.editLike);
postsRouter.put("/comments/likes", postsController.editLikeComments);
postsRouter.post("/:id/comments", postsController.addComments);
