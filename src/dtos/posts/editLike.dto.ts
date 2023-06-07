import z from "zod";

export interface EditLikeInputDTO {
  id: string;
  like: boolean;
  token: string;
}

export interface EditLikeOutputDTO {
  message: string;
}

export const EditLikeSchema = z.object({
  id: z.string().nonempty().min(2),
  like: z.boolean().refine((value) => value !== undefined, {
    message: 'A propriedade "like" é obrigatória.',
  }),
  token: z.string().nonempty().min(2),
});
