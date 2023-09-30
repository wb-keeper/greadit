import {db} from "@/lib/db";
import {INFINITE_SCROLLING_PAGINATION_RESULTS} from "../../config";
import PostFeed from "@/components/PostFeed";
import {getAuthSession} from "@/lib/auth";

const CustomFeed = async () => {

    const session = await getAuthSession()
    const followedCommunities = await db.subscription.findMany({
        where: {
            //@ts-ignore
            userId: session?.user.id,
        },
        include: {
            subgreadit: true
        }
    })
    console.log(followedCommunities)
    const posts = await db.post.findMany({
        where: {
            subgreadit: {
                name: {
                    in: followedCommunities.map(({subgreadit}) => subgreadit.id)
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        },
        include: {
            votes: true,
            author: true,
            comments: true,
            subgreadit: true
        },
        take: INFINITE_SCROLLING_PAGINATION_RESULTS
    })

    return <PostFeed initialPosts={posts} />
}

export default CustomFeed