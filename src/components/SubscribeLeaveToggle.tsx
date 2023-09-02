"use client";
import { FC, startTransition } from "react";
import { Button } from "@/components/ui/Button";
import { useMutation } from "@tanstack/react-query";
import { SubscribeToSubgreaditPayload } from "@/lib/validators/subgreadit";
import axios, { AxiosError } from "axios";
import { useCustomToast } from "@/hooks/use-custom-toast";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface SubscribeLeaveToggleProps {
  subgreaditId: string;
  subgreaditName: string;
}

const SubscribeLeaveToggle: FC<SubscribeLeaveToggleProps> = ({
  subgreaditId,
  subgreaditName,
}) => {
  const isSubscribed = false;
  const { loginToast } = useCustomToast();
  const router = useRouter();
  const {} = useMutation({
    mutationFn: async () => {
      const payload: SubscribeToSubgreaditPayload = {
        subgreaditId,
      };
      const { data } = await axios.post("/api/subgreadit/subscribe", payload);
      return data as string;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return loginToast();
        }
      }
      return toast({
        title: "There was a problem",
        description: "Something went wrong, please try again.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      startTransition(() => {
        router.refresh();
      });
      return toast({
        title: "Subscribed",
        description: `You are now subscribed to /r ${subgreaditName}`,
      });
    },
  });
  return isSubscribed ? (
    <Button className="w-full mt-1 mb-4">Leave Community</Button>
  ) : (
    <Button className="w-full mt-1 mb-4">Join to post</Button>
  );
};

export default SubscribeLeaveToggle;
