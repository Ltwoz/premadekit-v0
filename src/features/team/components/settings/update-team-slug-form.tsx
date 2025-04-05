"use client";

import { useTransition, useState, useEffect } from "react";
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
import { useDebounce } from "@/hooks/use-debounce";
import { pathsConfig } from "@/config/paths";
import { UpdateTeamSchema } from "../../schema/update-team-schema";
import { updateTeamAction } from "../../server/actions/update-team-action";
import { checkSlug } from "../../server/actions/check-slug";

interface UpdateTeamSlugFormProps {
  team: {
    id: string;
    name: string;
    slug: string;
  };
}

export function UpdateTeamSlugForm({ team }: UpdateTeamSlugFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);

  const form = useForm<z.infer<typeof UpdateTeamSchema>>({
    defaultValues: { slug: team.slug },
    resolver: zodResolver(UpdateTeamSchema),
  });

  const slug = form.watch("slug");
  const { debouncedValue: debouncedSlug, isDebouncing } = useDebounce(
    slug,
    500
  );

  useEffect(() => {
    if (!debouncedSlug || debouncedSlug === team.slug) {
      setSlugAvailable(null);
      return;
    }

    setCheckingAvailability(true);
    checkSlug(debouncedSlug)
      .then((available) => setSlugAvailable(available))
      .catch(() => setSlugAvailable(null))
      .finally(() => setCheckingAvailability(false));
  }, [debouncedSlug, team.slug]);

  const onSubmit = (data: z.infer<typeof UpdateTeamSchema>) => {
    if (slugAvailable === false) {
      toast.error("This slug is already taken.");
      return;
    }

    startTransition(async () => {
      const result = await updateTeamAction({
        id: team.id,
        slug: data.slug,
      });

      if (!result.success) {
        toast.error(result.error);
        return;
      }

      if (result.data?.slug) {
        router.replace(
          pathsConfig.app.teamSettings.replace("[team]", result.data.slug)
        );
      }
      toast.success("Team slug updated");
    });
  };

  const isButtonDisabled =
    pending ||
    isDebouncing ||
    checkingAvailability ||
    !slugAvailable ||
    !form.formState.isValid;

  return (
    <Card className="shadow-none">
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <SectionColumns
              title="Team Slug"
              description="This is your team’s URL namespace. Changing this will affect your team’s URL."
            >
              <div className="flex w-full items-center gap-2">
                <FormField
                  control={form.control}
                  name="slug"
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
                  disabled={isButtonDisabled}
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
                {form.formState.errors?.slug ? (
                  <p className="pb-0.5 text-[13px] text-red-600">
                    {form.formState.errors.slug.message}
                  </p>
                ) : slugAvailable === false ? (
                  <p className="pb-0.5 text-[13px] text-red-600">
                    This slug is already taken.
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
