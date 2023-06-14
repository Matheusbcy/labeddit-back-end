import z from "zod";

export interface EditLikeCommentsInputDTO {
  comment: string;
  like: boolean;
  token: string;
}

export interface EditLikeCommentsOutputDTO {
  message: string;
}

export const EditLikeCommentsSchema = z.object({
  comment: z.string().nonempty().min(2),
  like: z.boolean().refine((value) => value !== undefined, {
    message: 'A propriedade "like" é obrigatória.',
  }),
  token: z.string().nonempty().min(2),
});
