import { FC, ReactNode } from "react";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import dateFormat from "dateformat";
import SubscribeLeaveToggle from "@/components/SubscribeLeaveToggle";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/Button";

interface LayoutProps {
  children: ReactNode;
  params: { slug: string };
}
// const Layout: FC<LayoutProps> = async ({ children, params: { slug } }) => {
const Layout: ({
  children,
  params: { slug },
}: LayoutProps) => Promise<JSX.Element> = async ({
  children,
  params: { slug },
}) => {
  const session = await getAuthSession();
  const subgreadit = await db.subgreadit.findFirst({
    where: { name: slug },
    include: {
      posts: {
        include: {
          author: true,
          votes: true,
        },
      },
    },
  });
  // @ts-ignore
  // @ts-ignore
  const subscription = !session?.user
    ? undefined
    : await db.subscription.findFirst({
        where: {
          subgreadit: {
            name: slug,
          },
          user: {
            id: session.user.id,
          },
        },
      });
  const isSubscribed = !!subscription;
  if (!subgreadit) return notFound();
  const memberCount = await db.subscription.count({
    where: {
      subgreadit: {
        name: slug,
      },
    },
  });
  return (
    <div className="sm:container max-w-7xl mx-auto pt-12h-full ">
      <div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6">
          <div className="flex flex-col col-span-2 space-y-6"> {children}</div>
          <div className="hidden md:block overflow-hidden h-fit rounded-lg border border-gray-200 order-first md:order-last">
            <div className="px-6 py-4">
              <p className="font-semibold py-3">About r/ {subgreadit.name}</p>
            </div>
            <dl className="divide-y divide-gray-100 px-6 py-4 text-sm leading-6 bg-white">
              <div className="flex justify-between gap-x-4 py-3">
                <dt className="text-gray-500">Created</dt>
                <dd className="text-gray-700">
                  <time dateTime={subgreadit.createdAt.toDateString()}>
                    {dateFormat(
                      subgreadit.createdAt.toDateString(),
                      "mmmm d, yyyy"
                    )}
                  </time>
                </dd>
              </div>
              <div className="flex justify-between gap-x-4 py-3">
                <dt className="text-gray-500">Members</dt>
                <dd className="text-gray-700">
                  <div className="text-gray-900">{memberCount}</div>
                </dd>
              </div>
              {subgreadit.creatorId === session?.user.id ? (
                <div className="flex justify-between gap-x-4 py-3">
                  <p className="text-gray-500"> You created this community</p>
                </div>
              ) : null}
              {subgreadit.creatorId !== session?.user.id ? (
                <SubscribeLeaveToggle
                  subgreaditId={subgreadit.id}
                  subgreaditName={subgreadit.name}
                  isSubscribed={isSubscribed}
                />
              ) : null}
              <Link
                href={`r/${slug}/submit`}
                className={buttonVariants({
                  variant: "outline",
                  className: "w-full mb-6",
                })}
              >
                Create Post
              </Link>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
