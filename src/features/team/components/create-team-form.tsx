"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { pathsConfig } from "@/config/paths";
import { useModal } from "@/components/premadekit/modal";
import { createTeamAction } from "../server/actions/create-team-action";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CreateTeamSchema } from "../schema/create-team-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export function CreateTeamForm() {
  const router = useRouter();
  const { hideModal } = useModal();
  const [pending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof CreateTeamSchema>>({
    defaultValues: {
      name: "",
    },
    resolver: zodResolver(CreateTeamSchema),
  });

  const onSubmit = (data: z.infer<typeof CreateTeamSchema>) => {
    startTransition(async () => {
      try {
        const result = await createTeamAction(data);

        router.refresh();
        hideModal();
        
        if (result.data?.slug) {
          router.replace(
            pathsConfig.app.teamDashboard.replace("[team]", result.data.slug)
          );
        }

        toast.success("Team created");
      } catch (error) {
        toast.error("Failed to create team");
        console.error(error);
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Team Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={pending}
                    onBlur={() => form.trigger("name")}
                  />
                </FormControl>
                <FormMessage />
                <FormDescription>
                  The name must be unique and descriptive
                </FormDescription>
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={hideModal}>
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? "Creating..." : "Create Team"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
