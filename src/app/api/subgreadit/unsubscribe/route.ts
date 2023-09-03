import { getAuthSession } from "@/lib/auth";
import { SubgreaditSubscriptionValidator } from "@/lib/validators/subgreadit";
import { db } from "@/lib/db";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }
    const body = await req.json();
    const { subgreaditId } = SubgreaditSubscriptionValidator.parse(body);
    const subscriptionExists = await db.subscription.findFirst({
      where: {
        subgreaditId,
        userId: session.user.id,
      },
    });
    if (!subscriptionExists) {
      return new Response("You are not subscribed to this subgreadit.", {
        status: 400,
      });
    }
    const subgreadit = await db.subgreadit.findFirst({
      where: {
        id: subgreaditId,
        creatorId: session.user.id,
      },
    });
    if (subgreadit) {
      return new Response("You cant unsubscribed from your subgreadit", {
        status: 400,
      });
    }
    await db.subscription.delete({
      where: {
        userId_subgreaditId: {
          subgreaditId,
          userId: session.user.id,
        },
      },
    });
    return new Response(subgreaditId);
  } catch (e) {
    if (e instanceof z.ZodError) {
      return new Response("Invalid request data passed", { status: 422 });
    }
    return new Response("Could not subscribe, please try again later", {
      status: 500,
    });
  }
}
