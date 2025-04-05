"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, TrashIcon, XIcon } from "lucide-react";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { SectionColumns } from "@/components/premadekit/section-column";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UpdateTeamSchema } from "../../schema/update-team-schema";
import { updateTeamAction } from "../../server/actions/update-team-action";
import { useModal } from "@/components/premadekit/modal";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteTeamAction } from "../../server/actions/delete-team-action";
import { pathsConfig } from "@/config/paths";

interface DeleteTeamSectionProps {
  team: {
    id: string;
    name: string;
    slug: string;
  };
}

export function DeleteTeamSection(props: DeleteTeamSectionProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const form = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: zodResolver(
      z.object({
        name: z.string().refine((value) => value === props.team.name, {
          message: "Name does not match",
        }),
      })
    ),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = () => {
    startTransition(async () => {
      const { success, error } = await deleteTeamAction({
        teamId: props.team.id,
      });

      if (!success) {
        toast.error(error);
        return;
      }

      router.refresh();
      router.replace("/dashboard");

      toast.success("Team deleted");
    });
  };

  return (
    <Card className="shadow-none">
      <CardContent className="p-6">
        <SectionColumns
          title="Delete Team"
          description="This is a danger zone - Be careful."
        >
          <div className="flex flex-col gap-4 items-end">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="text-[15px] font-medium">Are you sure ?</span>

                {/* {userPaidPlan ? (
                      <div className="flex items-center gap-1 rounded-md bg-red-600/10 p-1 pr-2 text-xs font-medium text-red-600 dark:bg-red-500/10 dark:text-red-500">
                        <div className="m-0.5 rounded-full bg-red-600 p-[3px]">
                          <XIcon size={10} className="text-background" />
                        </div>
                        Active Subscription
                      </div>
                    ) : null} */}
              </div>
              <div className="text-sm text-muted-foreground">
                Permanently delete your team. This action cannot be undone -
                please proceed with caution.
              </div>
            </div>
            <div className="flex items-center gap-2">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button type="submit" variant="destructive">
                    <TrashIcon className="mr-2 size-4" />
                    <span>Delete Account</span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent onEscapeKeyDown={(e) => e.preventDefault()}>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Team</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete your team. This action cannot
                      be undone - please proceed with caution.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="flex flex-col gap-4"
                    >
                      <div className="flex flex-col gap-2">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Team Name</FormLabel>

                              <FormControl>
                                <Input
                                  type="text"
                                  autoComplete="off"
                                  className="w-full"
                                  placeholder=""
                                  pattern={props.team.name}
                                  {...field}
                                />
                              </FormControl>

                              <FormDescription>
                                The name must match the team name to confirm
                              </FormDescription>

                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>

                        <Button disabled={pending} variant="destructive">
                          Confirm Deletion
                        </Button>
                      </AlertDialogFooter>
                    </form>
                  </Form>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </SectionColumns>
      </CardContent>
    </Card>
  );
}
