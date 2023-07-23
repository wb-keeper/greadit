"use client";
import React, { FC, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { boolean } from "zod";
import { signIn } from "next-auth/react";
import Icons from "@/components/Icons";
import { useToast } from "@/hooks/use-toast";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}
const UserAuthForm: FC<UserAuthFormProps> = ({ className, ...props }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      await signIn;
    } catch (e) {
      toast({
        title: "There was a problem",
        description: "There was an error logging in with Google",
        variant: "destructive",
      });
      console.log(123);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className={cn("flex justify-center", className)} {...props}>
      <Button
        onClick={loginWithGoogle}
        size="sm"
        className="w-full"
        isLoading={isLoading}
      >
        {isLoading ? null : <Icons.google className="h-4 w-4 mr-2 " />} Google
      </Button>
    </div>
  );
};

export default UserAuthForm;
