import z from "zod";

export interface DeletePostsInputDTO {
  id: string;
  token: string;
}

export interface DeletePostsOutputDTO {
  message: string;
}

export const DeletePostsSchema = z
  .object({
    id: z
      .string({ invalid_type_error: "id deve ser ums string" })
      .nonempty()
      .min(1),
    token: z
      .string({ invalid_type_error: "token deve ser ums string" })
      .nonempty()
      .min(1),
  })
  .transform((data) => data as DeletePostsInputDTO);
