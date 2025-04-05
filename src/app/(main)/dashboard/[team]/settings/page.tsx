import { notFound } from "next/navigation";

import { getTeam } from "@/features/team/server/api";
import { UpdateTeamNameForm } from "@/features/team/components/settings/update-team-name-form";
import { UpdateTeamSlugForm } from "@/features/team/components/settings/update-team-slug-form";
import { DeleteTeamSection } from "@/features/team/components/settings/delete-team-section";
import { UpdateTeamImageContainer } from "@/features/team/components/settings/update-team-image-container";

interface TeamSettingsPageProps {
  params: Promise<{ team: string }>;
}

export default async function TeamSettingsPage(props: TeamSettingsPageProps) {
  const slug = (await props.params).team;
  const data = await getTeam(slug);

  if (!data) {
    return notFound();
  }

  return (
    <div className="w-full space-y-8">
      <UpdateTeamImageContainer team={data} />
      <UpdateTeamNameForm team={data} />
      <UpdateTeamSlugForm team={data} />
      <DeleteTeamSection team={data} />
    </div>
  );
};
