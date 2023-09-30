
import {redis} from "@/lib/redis";
import {CachedPost} from "@/types/redis";
import {Post, Vote, User} from "@prisma/client";
import {db} from "@/lib/db";
import {notFound} from "next/navigation";
import {Suspense} from "preact/compat";
import {buttonVariants} from "@/components/ui/Button";
import {ArrowBigUp, Loader2} from "lucide-react";



interface PageProps {
params: {
    postId: string
}
}
export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'
const Page = async ({params} : PageProps) => {
    const cachedPost = (await redis.hgetall(`post:${params.postId}`)) as CachedPost

    let post: (Post & {votes: Vote[]; author: User}) | null = null

    if(!cachedPost){
        post = await db.post.findFirst({
            where: {
                id: params.postId
            },
            include: {
                votes: true,
                author: true
            }

        })
    }
    if(!post && !cachedPost) return  notFound()


    return (
        <div>
            <div className="h-wull flex flex-col sm:flex-row items-center sm:items-start justify-between">
                {/*@ts-ignore*/}
                <Suspense fallback={<PostVoteShell />}></Suspense>

            </div>
        </div>
    );
};

function PostVoteShell() {
    return ( <div className="flex items-center flex-col pr-6 w-20">
        <div className={buttonVariants({variant: 'ghost'})}>
        <ArrowBigUp className='h-5 w-5 text-zinc-700' />
    </div>
    <div className="text-center py-2 font-medium text-sm text-zinc-900">
        <Loader2 />
    </div>
    </div> )
}

export default Page;