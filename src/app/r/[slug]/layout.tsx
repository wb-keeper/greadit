import { FC, ReactNode } from "react";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";

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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6">
        <div className="flex flex-col col-span-2 space-y-6"> {children}</div>
        <div className="hidden md:block overflow-hidden h-fit rounded-lg border border-gray-200 order-first md:order-last">
          <div className="px-6 py-4">
            <p className="font-semibold py-3">About r/ {slug}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
