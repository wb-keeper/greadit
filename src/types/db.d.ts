import { Subgreadit, Vote, User, Comment } from ".prisma/client";

export type ExtendedPost = Post & {
  subgreadit: Subgreadit;
  votes: Vote[];
  author: User;
  comments: Comment[];
};
