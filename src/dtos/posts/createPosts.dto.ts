import z from "zod";

export interface CreatePostsInputDTO {
  content: string;
  token: string;
}

export interface CreatePostsOutputDTO {
  content: string;
}

export const CreateProductSchema = z
  .object({
    content: z
      .string({ invalid_type_error: "content deve ser string" })
      .nonempty()
      .min(2),
    token: z.string().nonempty().min(1),
  })
  .transform((data) => data as CreatePostsInputDTO);
