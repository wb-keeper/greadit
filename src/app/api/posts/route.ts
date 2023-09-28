import {getAuthSession} from "@/lib/auth";
import {db} from "@/lib/db";
import {z} from "zod";

export async function GET(req: Request) {
    const url = new URL(req.url)

    const session = await getAuthSession()

    let followedCommunitiesIds: string[] = []
    if(session){

        const followedCommunities = await db.subscription.findMany({
            where: {
                // @ts-ignore
                userId: session.user.id
            },
            include: {
                subgreadit: true
            }
        })
        followedCommunitiesIds = followedCommunities.map(({subgreadit}) => subgreadit.id)
    }
    try {
        const {subgreaditName, limit, page} = z.object({
            limit: z.string(),
            page: z.string(),
            subgreaditName: z.string().nullish().optional()
        }).parse({
            subgreaditName: url.searchParams.get('subgreaditName'),
            limit: url.searchParams.get('limit'),
            page: url.searchParams.get('page'),
        })
        let whereClause = {}
        if(subgreaditName) {
            whereClause = {
                subgreadit: {
                    name: subgreaditName
                },

            }
        } else if (session) {
            whereClause = {
                subgreadit: {
                    id: {
                        in: followedCommunitiesIds
                    }
                }
            }
        }
        const posts = await db.post.findMany({
            take: parseInt(limit),
            skip: (parseInt(page) - 1) * parseInt(limit),
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                subgreadit: true,
                votes: true,
                author: true,
                comments: true
            },
            where: whereClause
        })
        return new Response(JSON.stringify(posts))
    } catch (e) {
        if (e instanceof z.ZodError) {
            return new Response("Invalid request data passed", { status: 422 });
        }
        return new Response("Could not fetch more posts", {
            status: 500,
        });
    }
}