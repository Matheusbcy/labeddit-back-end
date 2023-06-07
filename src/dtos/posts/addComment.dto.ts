import z from "zod";

export interface PostCommentInputDTO {
  token: string;
  postId: string;
  comment: string;
}

export interface PostCommentOutPUTDTO {
  message: string;
}

export const PostCommentSchema = z
  .object({
    token: z.string().min(1),
    postId: z.string().min(1).nonempty(),
    comment: z.string().min(2).nonempty(),
  })
  .transform((data) => data as PostCommentInputDTO);
