"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { SectionColumns } from "@/components/premadekit/section-column";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UpdateTeamSchema } from "../../schema/update-team-schema";
import { updateTeamAction } from "../../server/actions/update-team-action";

interface UpdateTeamNameFormProps {
  team: {
    id: string;
    name: string;
    slug: string;
  };
}

export function UpdateTeamNameForm(props: UpdateTeamNameFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof UpdateTeamSchema>>({
    defaultValues: {
      name: props.team.name,
    },
    resolver: zodResolver(UpdateTeamSchema),
  });

  const onSubmit = (data: z.infer<typeof UpdateTeamSchema>) => {
    startTransition(async () => {
      const result = await updateTeamAction({
        id: props.team.id,
        name: data.name,
      });

      if (!result.success) {
        toast.error(result.error);
        return;
      }

      router.refresh();

      toast.success("Team name updated");
    });
  };

  return (
    <Card className="shadow-none">
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <SectionColumns
              title="Team Name"
              description="This is your team's visible name."
            >
              <div className="flex w-full items-center gap-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input {...field} disabled={pending} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  disabled={pending}
                  className="w-[67px] shrink-0 px-0 sm:w-[100px]"
                >
                  {pending ? (
                    <LoaderCircle className="mr-2 size-4 animate-spin" />
                  ) : (
                    "Save"
                  )}
                </Button>
              </div>
              <div className="flex flex-col justify-between p-1">
                {form.formState.errors?.name ? (
                  <p className="pb-0.5 text-[13px] text-red-600">
                    {form.formState.errors.name.message}
                  </p>
                ) : (
                  <p className="text-[13px] text-muted-foreground">
                    Max 32 characters
                  </p>
                )}
              </div>
            </SectionColumns>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
