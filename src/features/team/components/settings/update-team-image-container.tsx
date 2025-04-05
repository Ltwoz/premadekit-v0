"use client";

import { ImageUploader } from "@/components/premadekit/image-uploader";
import { SectionColumns } from "@/components/premadekit/section-column";
import { Card, CardContent } from "@/components/ui/card";
import { deleteFile, getSignedUrlForUpload } from "@/lib/r2";
import { useCallback, useTransition } from "react";
import { toast } from "sonner";
import { updateTeamImageAction } from "../../server/actions/update-team-image-action";
import { useRouter } from "next/navigation";

interface UpdateTeamNameFormProps {
  team: {
    id: string;
    pictureUrl: string | null;
  };
}

export function UpdateTeamImageContainer(props: UpdateTeamNameFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const onValueChange = useCallback(
    async (file: File | null) => {
      if (!file) return;

      try {
        if (props.team.pictureUrl) {
          await deleteFile(props.team.pictureUrl);
        }

        const signedUrl = await getSignedUrlForUpload(file.name, file.type);
        if (!signedUrl) toast.error("Failed to get a signed URL for upload.");

        const uploadRes = await fetch(signedUrl, {
          method: "PUT",
          body: file,
        });
        if (!uploadRes.ok) toast.error("File upload failed.");

        const fileUrl = `${process.env.NEXT_PUBLIC_R2_URL}/${file.name}`;

        startTransition(async () => {
          const result = await updateTeamImageAction({
            id: props.team.id,
            fileUrl,
          });

          if (!result.success) throw new Error(result.error);

          router.refresh();
          toast.success("Team image updated.");
        });
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Something went wrong."
        );
      }
    },
    [props.team.id, props.team.pictureUrl, router]
  );

  return (
    <Card className="shadow-none">
      <CardContent className="p-6">
        <SectionColumns
          title="Team Logo"
          description="Update your team's logo to make it easier to identify."
        >
          <div className="flex w-full justify-end">
            <ImageUploader
              value={props.team.pictureUrl}
              onValueChange={onValueChange}
              disable={pending}
            />
          </div>
        </SectionColumns>
      </CardContent>
    </Card>
  );
}
