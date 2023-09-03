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
  isSubscribed: boolean;
}

const SubscribeLeaveToggle: FC<SubscribeLeaveToggleProps> = ({
  subgreaditId,
  isSubscribed,
  subgreaditName,
}) => {
  const { loginToast } = useCustomToast();
  const router = useRouter();
  const { mutate: subscribe, isLoading: isSubLoading } = useMutation({
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
  const { mutate: unsubscribe, isLoading: isUnSubLoading } = useMutation({
    mutationFn: async () => {
      const payload: SubscribeToSubgreaditPayload = {
        subgreaditId,
      };
      const { data } = await axios.post("/api/subgreadit/unsubscribe", payload);
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
        title: "Unsubscribed",
        description: `You are now unsubscribed from /r ${subgreaditName}`,
      });
    },
  });
  return isSubscribed ? (
    <Button
      onClick={() => unsubscribe()}
      isLoading={isUnSubLoading}
      className="w-full mt-1 mb-4"
    >
      Leave Community
    </Button>
  ) : (
    <Button
      isLoading={isSubLoading}
      onClick={() => subscribe()}
      className="w-full mt-1 mb-4"
    >
      Join to post
    </Button>
  );
};

export default SubscribeLeaveToggle;
