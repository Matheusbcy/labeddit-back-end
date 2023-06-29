import { PostsDataBase } from "./../database/postsDatabase";
import { IdGenerator } from "./../services/idGenerator";
import { TokenManager } from "./../services/TokenManager";
import {
  GetPostsInputDTO,
  GetPostsOutputDTO,
} from "../dtos/posts/getPosts.dto";
import { BadRequestError } from "../errors/BadRequestError";
import { Posts } from "../models/posts";
import {
  CreatePostsInputDTO,
  CreatePostsOutputDTO,
} from "../dtos/posts/createPosts.dto";
import {
  EditPostsInputDTO,
  EditPostsOutputDTO,
} from "../dtos/posts/editPosts.dto";
import { postsDB } from "../models/posts";
import {
  DeletePostsInputDTO,
  DeletePostsOutputDTO,
} from "../dtos/posts/deletePost.dto";
import {
  EditLikeInputDTO,
  EditLikeOutputDTO,
} from "../dtos/posts/editLike.dto";
import {
  PostCommentInputDTO,
  PostCommentOutPUTDTO,
  PostCommentSchema,
} from "../dtos/posts/addComment.dto";
import { EditLikeCommentsInputDTO } from "../dtos/posts/editlikeComment.dto";

export class PostsBusiness {
  constructor(
    private tokenManager: TokenManager,
    private postsDatabase: PostsDataBase,
    private idGenerator: IdGenerator
  ) {}

  public getPosts = async (
    input: GetPostsInputDTO
  ): Promise<GetPostsOutputDTO> => {
    const { id, token } = input;
    const payload = this.tokenManager.getPayload(token);

    if (payload === null) {
      throw new BadRequestError("Token is invalid");
    }

    const postsDB = await this.postsDatabase.findPosts(id);

    const posts = await Promise.all(
      postsDB.map(async (postDB) => {
        const post = new Posts(
          postDB.id,
          postDB.creator_id,
          postDB.content,
          postDB.likes,
          postDB.deslikes,
          postDB.created_at,
          postDB.updated_at
        );

        const creator = await this.postsDatabase.getCreatorNameById(
          postDB.creator_id
        );

        const comments = await this.postsDatabase.findCommentsByPostId(
          postDB.id
        );

        const businessModel = post.toBusinessModel();

        return {
          ...businessModel,
          creator: {
            creatorId: businessModel.creator.creatorId,
            name: creator ? creator : null,
          },
          comments,
        };
      })
    );

    const output: GetPostsOutputDTO = posts;

    return output;
  };

  public createPost = async (
    input: CreatePostsInputDTO
  ): Promise<CreatePostsOutputDTO> => {
    const { content, token } = input;

    const payload = this.tokenManager.getPayload(token);

    if (payload === null) {
      throw new BadRequestError("Token is invalid");
    }

    const postsDB = await this.postsDatabase.findPostsByContent(content);

    if (postsDB) {
      throw new BadRequestError("Post already exists");
    }

    const nameCreator = payload.name;
    const id = this.idGenerator.generate();

    const creatorId = await this.postsDatabase.getUserIdByName(nameCreator);

    let likes = 0;
    let deslikes = 0;

    const newPost = new Posts(
      id,
      creatorId,
      content,
      likes,
      deslikes,
      new Date().toISOString(),
      new Date().toISOString()
    );
    const newPostsDB = newPost.toDBModel();
    await this.postsDatabase.insertPost(newPostsDB);

    const output: CreatePostsOutputDTO = {
      content: newPost.getContent(),
    };
    return output;
  };

  public editPost = async (
    input: EditPostsInputDTO
  ): Promise<EditPostsOutputDTO> => {
    const { id, content, token } = input;

    const payload = this.tokenManager.getPayload(token);

    if (!payload) {
      throw new BadRequestError("Token is invalid");
    }

    const postToEditDB = await this.postsDatabase.findPostById(id);

    if (!postToEditDB) {
      throw new BadRequestError("Posts não existe");
    }

    if (payload.id !== postToEditDB.creator_id) {
      throw new BadRequestError("Esse usuario não pode editar esse post");
    }

    const post = new Posts(
      postToEditDB.id,
      postToEditDB.creator_id,
      postToEditDB.content,
      postToEditDB.likes,
      postToEditDB.deslikes,
      postToEditDB.created_at,
      postToEditDB.updated_at
    );

    content && post.setContent(content);
    post.setUpdatedAt(new Date().toISOString());

    const updatedPostDB: postsDB = {
      id: post.getId(),
      creator_id: post.getCreatorId(),
      content: post.getContent(),
      likes: post.getLikes(),
      deslikes: post.getDeslikes(),
      created_at: post.getCreatedAt(),
      updated_at: post.getUpdatedAt(),
    };

    await this.postsDatabase.updatePost(id, updatedPostDB);

    const output: EditPostsOutputDTO = {
      content,
    };

    return output;
  };

  public deletePost = async (
    input: DeletePostsInputDTO
  ): Promise<DeletePostsOutputDTO> => {
    const { id, token } = input;

    const payload = this.tokenManager.getPayload(token);

    if (!payload) {
      throw new BadRequestError("Token is invalid");
    }

    const postToDelete = await this.postsDatabase.getPostToDelete(id);

    if (!postToDelete) {
      throw new BadRequestError("Post not exists.");
    }

    if (payload.role === "NORMAL" && payload.id !== postToDelete.creator_id) {
      throw new BadRequestError(
        "usuário não tem permissão para apagar esse post."
      );
    }

    const postComments = await this.postsDatabase.findCommentsByPostId(id);

    const coments = postComments.map((comment) => {
      return comment.comments;
    });

    coments.map(async (comment) => {
      await this.postsDatabase.deleteLikeDislikeCommentByComment(comment);
    });

    await this.postsDatabase.deletePostsCommentsData(id);

    await this.postsDatabase.deletePostsData(id);

    const output: DeletePostsOutputDTO = {
      message: "Post deleted",
    };
    return output;
  };

  public likeDislike = async (
    input: EditLikeInputDTO
  ): Promise<EditLikeOutputDTO> => {
    const { id, like, token } = input;

    const payload = this.tokenManager.getPayload(token);

    if (!payload) {
      throw new BadRequestError("Token is invalid");
    }

    const postDB = await this.postsDatabase.findPostById(id);

    if (!postDB) {
      throw new BadRequestError("Post not exists.");
    }

    if (postDB?.creator_id === payload.id) {
      throw new BadRequestError("Você não pode curtir o proprio post");
    }
    const existingLikeDislike =
      await this.postsDatabase.findLikeDislikeByUserAndPost(payload.id, id);

    if (existingLikeDislike) {
      if (like && existingLikeDislike.like) {
        await this.postsDatabase.deleteLikeDislike(existingLikeDislike.user_id);

        await this.postsDatabase.updateLikes(postDB.id, postDB.likes - 1);
      } else if (!like && !existingLikeDislike.like) {
        await this.postsDatabase.deleteLikeDislike(existingLikeDislike.user_id);

        await this.postsDatabase.updateDislikes(postDB.id, postDB.deslikes - 1);
      } else if (like && !existingLikeDislike.like) {
        await this.postsDatabase.updateLikeDislike(
          existingLikeDislike.user_id,
          like
        );

        await this.postsDatabase.updateLikesAndDislikes(
          postDB.id,
          postDB.likes + 1,
          postDB.deslikes - 1
        );
      } else if (!like && existingLikeDislike.like) {
        await this.postsDatabase.updateLikeDislike(
          existingLikeDislike.user_id,
          like
        );

        await this.postsDatabase.updateLikesAndDislikes(
          postDB.id,
          postDB.likes - 1,
          postDB.deslikes + 1
        );
      }
    } else {
      await this.postsDatabase.createLikeDislike(payload.id, id, like);

      if (like) {
        await this.postsDatabase.updateLikes(postDB.id, postDB.likes + 1);
      } else {
        await this.postsDatabase.updateDislikes(postDB.id, postDB.deslikes + 1);
      }
    }
    const output: EditLikeOutputDTO = {
      message: like
        ? "Seu like foi computado com sucesso"
        : "Seu dislike foi computado com sucesso",
    };

    return output;
  };

  public addComment = async (input: PostCommentInputDTO) => {
    const { token, postId, comment } = input;

    const payload = this.tokenManager.getPayload(token);

    if (!payload) {
      throw new BadRequestError("Token is invalid");
    }

    const userId = payload.id;

    await this.postsDatabase.insertCommentIntoDatabase(userId, postId, comment);

    const output: PostCommentOutPUTDTO = {
      message: "Comentario adicionado com sucesso!",
    };

    return output;
  };

  public likeDislikeComments = async (input: EditLikeCommentsInputDTO) => {
    const { comment, like, token } = input;

    const payload = this.tokenManager.getPayload(token);

    if (!payload) {
      throw new BadRequestError("Token is invalid");
    }

    const commentDB = await this.postsDatabase.findCommentsByComments(comment);

    if (!commentDB) {
      throw new BadRequestError("Comentario não existe");
    }

    const existingLikeDislike =
      await this.postsDatabase.findLikeDislikeByComment(payload.id, comment);

    if (existingLikeDislike) {
      if (like && existingLikeDislike.like) {
        await this.postsDatabase.deleteLikeDislikeComment(
          existingLikeDislike.user_id
        );

        await this.postsDatabase.updateLikesComment(
          commentDB.comments,
          commentDB.likes - 1
        );
      } else if (!like && !existingLikeDislike.like) {
        await this.postsDatabase.deleteLikeDislikeComment(
          existingLikeDislike.user_id
        );

        await this.postsDatabase.updateDislikesComment(
          commentDB.comments,
          commentDB.deslikes - 1
        );
      } else if (like && !existingLikeDislike.like) {
        await this.postsDatabase.updateLikeDislikeComment(
          existingLikeDislike.user_id,
          like
        );
        await this.postsDatabase.updateLikesAndDislikesComment(
          commentDB.comments,
          commentDB.likes + 1,
          commentDB.deslikes - 1
        );
      } else if (!like && existingLikeDislike.like) {
        await this.postsDatabase.updateLikeDislikeComment(
          existingLikeDislike.user_id,
          like
        );
        await this.postsDatabase.updateLikesAndDislikesComment(
          commentDB.comments,
          commentDB.likes - 1,
          commentDB.deslikes + 1
        );
      }
    } else {
      await this.postsDatabase.createLikeDislikeComment(
        payload.id,
        commentDB.comments,
        like
      );

      if (like) {
        await this.postsDatabase.updateLikesComment(
          commentDB.comments,
          commentDB.likes + 1
        );
      } else {
        await this.postsDatabase.updateDislikesComment(
          commentDB.comments,
          commentDB.deslikes + 1
        );
      }
    }

    const output: EditLikeOutputDTO = {
      message: like
        ? "Seu like foi computado com sucesso"
        : "Seu dislike foi computado com sucesso",
    };

    return output;
  };
}
