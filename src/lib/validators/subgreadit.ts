import { z } from "zod";

export const SubgreaditValidator = z.object({
  name: z.string().min(3).max(21),
});

export const SubgreaditSubscriptionValidator = z.object({
  subgreaditId: z.string(),
});

export type CreateSubgreaditPayload = z.infer<typeof SubgreaditValidator>;
export type SubscribeToSubgreaditPayload = z.infer<
  typeof SubgreaditSubscriptionValidator
>;
