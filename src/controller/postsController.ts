import { ZodError } from "zod";
import { PostsBusiness } from "../business/postsBusiness";
import { GetProductsSchema } from "../dtos/posts/getPosts.dto";
import { Request, Response } from "express";
import { BaseError } from "../errors/BaseError";
import { CreateProductSchema } from "../dtos/posts/createPosts.dto";
import { EditPostSchema } from "../dtos/posts/editPosts.dto";
import { DeletePostsSchema } from "../dtos/posts/deletePost.dto";
import { EditLikeSchema } from "../dtos/posts/editLike.dto";
import { PostCommentSchema } from "../dtos/posts/addComment.dto";

export class postsControlle {
  constructor(private postsBusiness: PostsBusiness) {}

  public getPosts = async (req: Request, res: Response) => {
    try {
      const input = GetProductsSchema.parse({
        id: req.query.id,
        token: req.headers.authorization,
      });

      const output = await this.postsBusiness.getPosts(input);

      res.status(200).send(output);
    } catch (error) {
      console.log(error);

      if (error instanceof ZodError) {
        res.status(400).send(error.issues);
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message);
      } else {
        res.status(500).send("Erro inesperado");
      }
    }
  };

  public createPosts = async (req: Request, res: Response) => {
    try {
      const input = CreateProductSchema.parse({
        content: req.body.content,
        token: req.headers.authorization,
      });

      const output = await this.postsBusiness.createPost(input);

      res.status(201).send(output);
    } catch (error) {
      console.log(error);

      if (error instanceof ZodError) {
        res.status(400).send(error.issues);
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message);
      } else {
        res.status(500).send("Erro inesperado");
      }
    }
  };

  public editPosts = async (req: Request, res: Response) => {
    try {
      const input = EditPostSchema.parse({
        id: req.params.id,
        content: req.body.content,
        token: req.headers.authorization,
      });

      const output = await this.postsBusiness.editPost(input);

      res.status(200).send(output);
    } catch (error) {
      console.log(error);

      if (error instanceof ZodError) {
        res.status(400).send(error.issues);
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message);
      } else {
        res.status(500).send("Erro inesperado");
      }
    }
  };

  public deletePost = async (req: Request, res: Response) => {
    try {
      const input = DeletePostsSchema.parse({
        id: req.params.id,
        token: req.headers.authorization,
      });

      const output = await this.postsBusiness.deletePost(input);

      res.status(200).send(output);
    } catch (error) {
      console.log(error);

      if (error instanceof ZodError) {
        res.status(400).send(error.issues);
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message);
      } else {
        res.status(500).send("Erro inesperado");
      }
    }
  };

  public editLike = async (req: Request, res: Response) => {
    try {
      const input = EditLikeSchema.parse({
        id: req.params.id,
        like: req.body.like,
        token: req.headers.authorization,
      });

      const output = await this.postsBusiness.likeDislike(input);

      res.status(200).send(output);
    } catch (error) {
      console.log(error);

      if (error instanceof ZodError) {
        res.status(400).send(error.issues);
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message);
      } else {
        res.status(500).send("Erro inesperado");
      }
    }
  };

  public addComments = async (req: Request, res: Response) => {
    try {
      const input = PostCommentSchema.parse({
        token: req.headers.authorization,
        postId: req.params.id,
        comment: req.body.comments,
      });

      const output = await this.postsBusiness.addComment(input);

      res.status(201).send(output);
    } catch (error) {
      console.log(error);

      if (error instanceof ZodError) {
        res.status(400).send(error.issues);
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message);
      } else {
        res.status(500).send("Erro inesperado");
      }
    }
  };
}
