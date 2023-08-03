import { getAuthSession } from "@/lib/auth";
import { SubgreaditValidator } from "@/lib/validators/subgreadit";
import { db } from "@/lib/db";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();
    console.log(!session?.user);
    if (!session?.user) {
      console.log(222);
      return new Response("Unauthorized", { status: 404 });
    }
    const body = await req.json();
    const { name } = SubgreaditValidator.parse(body);
    const subgreaditExists = await db.subgreadit.findFirst({
      where: {
        name,
      },
    });
    if (subgreaditExists) {
      return new Response("Subgreadit already exists", { status: 409 });
    }
    const subgreadit = await db.subgreadit.create({
      data: { name, creatorId: session.user.id },
    });
    await db.subscription.create({
      data: {
        userId: session.user.id,
        subgreaditId: subgreadit.id,
      },
    });
    return new Response(subgreadit.name);
  } catch (e) {
    console.log(123);
    console.log(e);
    if (e instanceof z.ZodError) {
      return new Response(e.message, { status: 422 });
    }
    return new Response("Could not create subgreadit", { status: 500 });
  }
}
