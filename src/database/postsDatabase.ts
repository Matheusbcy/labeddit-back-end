import { BadRequestError } from "../errors/BadRequestError";
import { postsDB } from "../models/posts";
import { BaseDatabase } from "./BaseDatabase";

export class PostsDataBase extends BaseDatabase {
  public static POST_TABLE = "posts";
  public static USER_TABLE = "users";
  public static LIKE_DISLIKE = "likes_dislikes";
  public static POST_COMMENTS = "posts_comments";
  public static LIKE_DISLIKE_COMMENTS = "likes_dislikes_comments";

  public findPosts = async (id: string | undefined) => {
    let postDB;

    if (id) {
      const result: postsDB[] = await BaseDatabase.connection(
        PostsDataBase.POST_TABLE
      ).where({ id });
      postDB = result;
    } else {
      const result: postsDB[] = await BaseDatabase.connection(
        PostsDataBase.POST_TABLE
      );

      postDB = result;
    }
    return postDB;
  };

  public findPostsByContent = async (
    content: string
  ): Promise<postsDB | undefined> => {
    const [postDB]: postsDB[] | undefined = await BaseDatabase.connection(
      PostsDataBase.POST_TABLE
    ).where({ content });

    return postDB;
  };

  public getUserNameById = async (userId: string): Promise<string | null> => {
    const [user]: { name: string }[] | undefined =
      await BaseDatabase.connection(PostsDataBase.USER_TABLE)
        .select("name")
        .where({ id: userId });

    if (!user) {
      return null;
    }

    return user.name;
  };

  public getUserIdByName = async (nameCreator: string): Promise<string> => {
    const user = await BaseDatabase.connection(PostsDataBase.USER_TABLE)
      .select("id")
      .where("name", nameCreator)
      .first();

    if (user) {
      return user.id;
    } else {
      throw new BadRequestError("User not found");
    }
  };

  public insertPost = async (newPostsDB: postsDB): Promise<void> => {
    await BaseDatabase.connection(PostsDataBase.POST_TABLE).insert(newPostsDB);
  };

  public getCreatorNameById = async (idCreator: string): Promise<string> => {
    const nameUser = await BaseDatabase.connection(PostsDataBase.USER_TABLE)
      .select("name")
      .where("id", idCreator)
      .first();

    if (nameUser) {
      return nameUser.name;
    } else {
      throw new BadRequestError("User not found");
    }
  };

  public findPostById = async (id: string): Promise<postsDB | undefined> => {
    const [postsDB]: postsDB[] | undefined = await BaseDatabase.connection(
      PostsDataBase.POST_TABLE
    ).where({ id });

    return postsDB;
  };

  public updatePost = async (id: string, updatedPost: postsDB) => {
    await BaseDatabase.connection(PostsDataBase.POST_TABLE)
      .update(updatedPost)
      .where({ id });
  };

  public getPostToDelete = async (id: string) => {
    const [postsDB]: postsDB[] | undefined = await BaseDatabase.connection(
      PostsDataBase.POST_TABLE
    ).where({ id });

    return postsDB;
  };

  public deletePostsData = async (id: string) => {
    await BaseDatabase.connection(PostsDataBase.POST_TABLE)
      .delete()
      .where({ id });
  };

  public deletePostsCommentsData = async (id: string) => {
    await BaseDatabase.connection(PostsDataBase.POST_COMMENTS)
      .delete()
      .where({ post_id: id });
  };

  // --------------------------------------------------------------------

  public findLikeDislikeByUserAndPost = async (
    user_id: string,
    post_id: string
  ) => {
    return await BaseDatabase.connection(PostsDataBase.LIKE_DISLIKE)
      .where("user_id", user_id)
      .where("post_id", post_id)
      .first();
  };

  public deleteLikeDislike = async (likeDislikeId: string) => {
    await BaseDatabase.connection(PostsDataBase.LIKE_DISLIKE)
      .where({ user_id: likeDislikeId })
      .delete();
  };

  public createLikeDislike = async (
    user_id: string,
    post_id: string,
    like: boolean
  ) => {
    return await BaseDatabase.connection(PostsDataBase.LIKE_DISLIKE).insert({
      user_id,
      post_id,
      like: like ? 1 : 0,
    });
  };

  public updateLikeDislike = async (
    likeDislikeId: string,
    likeValue: boolean
  ) => {
    const likeDislike = likeValue ? 1 : 0;

    await BaseDatabase.connection(PostsDataBase.LIKE_DISLIKE)
      .where({ user_id: likeDislikeId })
      .update({ like: likeDislike });
  };

  public updateLikes = async (post_id: string, likes: number) => {
    return await BaseDatabase.connection(PostsDataBase.POST_TABLE)
      .where("id", post_id)
      .update({ likes });
  };

  public updateDislikes = async (post_id: string, dislikes: number) => {
    return await BaseDatabase.connection(PostsDataBase.POST_TABLE)
      .where("id", post_id)
      .update({ deslikes: dislikes });
  };

  public updateLikesAndDislikes = async (
    post_id: string,
    likes: number,
    dislikes: number
  ) => {
    return await BaseDatabase.connection(PostsDataBase.POST_TABLE)
      .where("id", post_id)
      .update({ likes, deslikes: dislikes });
  };

  // ---------------------------------------------------------------------

  public insertCommentIntoDatabase = async (
    userId: string,
    postId: string,
    comment: string
  ) => {
    await BaseDatabase.connection(PostsDataBase.POST_COMMENTS).insert({
      user_id: userId,
      post_id: postId,
      comments: comment,
    });
  };

  public findCommentsByPostId = async (postId: string) => {
    const comments = await BaseDatabase.connection(PostsDataBase.POST_COMMENTS)
      .select("*")
      .where({ post_id: postId });

    const commentsWithNames = await Promise.all(
      comments.map(async (comment) => {
        const userName = await this.getUserNameById(comment.user_id);
        return {
          name: userName ? userName : null,
          comments: comment.comments,
          like: comment.likes,
          deslikes: comment.deslikes,
        };
      })
    );

    return commentsWithNames;
  };

  public findCommentsByComments = async (comment: string) => {
    const [commentDB] = await BaseDatabase.connection(
      PostsDataBase.POST_COMMENTS
    ).where({ comments: comment });

    return commentDB;
  };

  // ---------------------------------------------------------------

  public findLikeDislikeByComment = async (
    user_id: string,
    comment: string
  ) => {
    const result = await BaseDatabase.connection(
      PostsDataBase.LIKE_DISLIKE_COMMENTS
    )
      .where("user_id", user_id)
      .where("comments", comment)
      .first();

    if (result) {
      return result;
    } else {
      return undefined;
    }
  };

  public deleteLikeDislikeComment = async (user_id: string) => {
    await BaseDatabase.connection(PostsDataBase.LIKE_DISLIKE_COMMENTS)
      .where({ user_id: user_id })
      .delete();
  };
  public deleteLikeDislikeCommentByComment = async (comment: string) => {
    await BaseDatabase.connection(PostsDataBase.LIKE_DISLIKE_COMMENTS)
      .where({ comments: comment })
      .delete();
  };

  public createLikeDislikeComment = async (
    user_id: string,
    comments: string,
    like: boolean
  ) => {
    return await BaseDatabase.connection(
      PostsDataBase.LIKE_DISLIKE_COMMENTS
    ).insert({
      user_id,
      comments,
      like: like ? 1 : 0,
    });
  };

  public updateLikesComment = async (comment: string, likes: number) => {
    return await BaseDatabase.connection(PostsDataBase.POST_COMMENTS)
      .where("comments", comment)
      .update({ likes });
  };

  public updateDislikesComment = async (comment: string, dislikes: number) => {
    return await BaseDatabase.connection(PostsDataBase.POST_COMMENTS)
      .where("comments", comment)
      .update({ deslikes: dislikes });
  };

  public updateLikeDislikeComment = async (
    likeDislikeId: string,
    likeValue: boolean
  ) => {
    const likeDislike = likeValue ? 1 : 0;

    await BaseDatabase.connection(PostsDataBase.LIKE_DISLIKE_COMMENTS)
      .where({ user_id: likeDislikeId })
      .update({ like: likeDislike });
  };

  public updateLikesAndDislikesComment = async (
    comment: string,
    likes: number,
    dislikes: number
  ) => {
    return await BaseDatabase.connection(PostsDataBase.POST_COMMENTS)
      .where(" comments", comment)
      .update({ likes, deslikes: dislikes });
  };
}
