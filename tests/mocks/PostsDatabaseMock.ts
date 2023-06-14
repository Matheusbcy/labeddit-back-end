import { usersMock } from "./UserDatabaseMock";
import { postsDB } from "./../../src/models/posts";
import { BaseDatabase } from "../../src/database/BaseDatabase";

const postsMocks: postsDB[] = [
  {
    id: "id-mock-prod1",
    creator_id: "id-mock-fulano",
    content: "bla bla bla",
    likes: 0,
    deslikes: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "id-mock-prod2",
    creator_id: "id-mock-astrodev",
    content: "ble ble ble",
    likes: 0,
    deslikes: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export class PostDatabaseMock extends BaseDatabase {
  public static TABLE_USERS = "posts";

  public findPosts = async (id: string | undefined) => {
    if (id) {
      const postDB = postsMocks.find((post) => post.id === id);
      return postDB ? [postDB] : [];
    } else {
      return postsMocks;
    }
  };

  public findPostsByContent = async (
    content: string
  ): Promise<postsDB | undefined> => {
    return postsMocks.find((post) => post.content === content);
  };

  public getUserNameById = async (userId: string): Promise<string | null> => {
    const post = postsMocks.find((post) => post.creator_id === userId);
    if (post) {
      return post.creator_id;
    }
    return null;
  };

  public getUserIdByName = async (name: string): Promise<string> => {
    const user = usersMock.find((user) => user.name === name);

    if (user) {
      return user.id;
    }

    throw new Error("User not found");
  };

  public insertPost = async (newPostsDB: postsDB): Promise<void> => {};

  public getCreatorNameById = async (idCreator: string): Promise<string> => {
    const post = postsMocks.find((post) => post.creator_id === idCreator);
    if (post) {
      return post.creator_id;
    } else {
      throw new Error("User not found");
    }
  };

  public findPostById = async (id: string): Promise<postsDB | undefined> => {
    return postsMocks.find((post) => post.id === id) || undefined;
  };

  public updatePost = async (
    id: string,
    updatedPost: postsDB
  ): Promise<void> => {};

  public getPostToDelete = async (id: string): Promise<postsDB> => {
    return postsMocks.filter((post) => post.id === id)[0];
  };

  public deletePostsData = async (id: string): Promise<void> => {};

  public findLikeDislikeByUserAndPost = async (
    user_id: string,
    post_id: string
  ) => {
    return null;
  };

  public deleteLikeDislike = async (likeDislikeId: string): Promise<void> => {};

  public createLikeDislike = async (
    user_id: string,
    post_id: string,
    like: boolean
  ): Promise<number[]> => {
    return like ? [1] : [0];
  };

  public updateLikeDislike = async (
    likeDislikeId: string,
    likeValue: boolean
  ): Promise<void> => {};

  public updateLikes = async (
    post_id: string,
    likes: number
  ): Promise<number> => {
    return likes;
  };

  public updateDislikes = async (
    post_id: string,
    dislikes: number
  ): Promise<number> => {
    return dislikes;
  };

  public updateLikesAndDislikes = async (
    post_id: string,
    likes: number,
    dislikes: number
  ): Promise<number> => {
    return likes;
  };

  public insertCommentIntoDatabase = async (
    userId: string,
    postId: string,
    comment: string
  ): Promise<void> => {};

  public findCommentsByComments = async (comment: string): Promise<any> => {
    let commentDB;
    return commentDB;
  };

  public findCommentsByPostId = async (
    postId: string
  ): Promise<
    { name: string | null; comments: any; like: number; deslikes: number }[]
  > => {
    const output = [
      {
        name: "",
        comments: "",
        like: 0,
        deslikes: 0,
      },
    ];
    return output;
  };

  public findLikeDislikeByComment = async (
    user_id: string,
    comment: string
  ) => {
    return null;
  };

  public deleteLikeDislikeComment = async (
    user_id: string
  ): Promise<void> => {};

  public createLikeDislikeComment = async (
    user_id: string,
    comments: string,
    like: boolean
  ) => {
    return like ? [1] : [0];
  };

  public updateLikesComment = async (
    comment: string,
    likes: number
  ): Promise<number> => {
    return likes;
  };

  public updateDislikesComment = async (
    comment: string,
    dislikes: number
  ): Promise<number> => {
    return dislikes;
  };

  public updateLikeDislikeComment = async (
    likeDislikeId: string,
    likeValue: boolean
  ): Promise<void> => {};

  public updateLikesAndDislikesComment = async (
    comment: string,
    likes: number,
    dislikes: number
  ) => {
    return likes;
  };

  public deletePostsCommentsData = async (id: string): Promise<void> => {};
}
