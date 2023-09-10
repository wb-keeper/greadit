import { getAuthSession } from "@/lib/auth";
import { SubgreaditSubscriptionValidator } from "@/lib/validators/subgreadit";
import { db } from "@/lib/db";
import { z } from "zod";
import { PostValidator } from "@/lib/validators/post";

export async function POST(req: Request) {
  console.log(req);
  try {
    const session = await getAuthSession();
    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }
    const body = await req.json();
    const { subgreaditId, title, content } = PostValidator.parse(body);
    const subscriptionExists = await db.subscription.findFirst({
      where: {
        subgreaditId,
        userId: session.user.id,
      },
    });
    if (!subscriptionExists) {
      return new Response("Subscribe to post.", {
        status: 400,
      });
    }
    await db.post.create({
      data: {
        title,
        content,
        authorId: session.user.id,
        subgreaditId,
      },
    });
    return new Response("OK");
  } catch (e) {
    if (e instanceof z.ZodError) {
      return new Response("Invalid POST request data passed", { status: 422 });
    }
    return new Response(
      "Could not post to subgreadit at this time, please try again later",
      {
        status: 500,
      }
    );
  }
}
