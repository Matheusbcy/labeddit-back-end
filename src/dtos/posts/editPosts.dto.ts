import z from "zod";

export interface EditPostsInputDTO {
  id: string;
  content: string;
  token: string;
}

export interface EditPostsOutputDTO {
  content: string;
}

export const EditPostSchema = z
  .object({
    id: z
      .string({ invalid_type_error: "id deve ser ums string" })
      .nonempty()
      .min(1),
    content: z
      .string({ invalid_type_error: "content deve ser uma string" })
      .nonempty()
      .min(2),
    token: z
      .string({ invalid_type_error: "token deve ser uma string" })
      .nonempty()
      .min(2),
  })
  .transform((data) => data as EditPostsInputDTO);
