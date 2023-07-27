"use client";
import { User } from "next-auth";
import { FC } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import UserAvatar from "@/components/UserAvatar";

interface UserAccountNavProps {
  user: Pick<User, "name" | "image" | "email">;
}
const UserAccountNav: FC<UserAccountNavProps> = ({ user }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserAvatar user={user} />
      </DropdownMenuTrigger>
    </DropdownMenu>
  );
};

export default UserAccountNav;
