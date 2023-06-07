import z from "zod";
import { postsModel } from "../../models/posts";

export interface GetPostsInputDTO {
  id: string | undefined;
  token: string;
}

export type GetPostsOutputDTO = postsModel[];

export const GetProductsSchema = z
  .object({
    id: z.string().optional(),
    token: z.string().min(1),
  })
  .transform((data) => data as GetPostsInputDTO);
