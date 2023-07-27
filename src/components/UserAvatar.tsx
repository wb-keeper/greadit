"use client";
import React, { FC } from "react";
import { User } from "next-auth";
import { Avatar, AvatarFallback } from "@/components/ui/Avatar";
import Image from "next/image";

interface UserAvatarProps {
  user: Pick<User, "name" | "image">;
}
const UserAvatar: FC<UserAvatarProps> = ({ user }) => {
  return (
    <Avatar>
      {user.image ? (
        <div className="relative aspect-square h-full w-full">
          <Image
            fill
            src={user.image}
            alt="profile picture"
            referrerPolicy="no-referrer"
          />
        </div>
      ) : (
        <AvatarFallback>
          <span className="sr-only">{user?.name}</span>
          <Icons.user />
        </AvatarFallback>
      )}
    </Avatar>
  );
};

export default UserAvatar;
