import { PageHeader, PageBody } from "@/components/premadekit/page";
import { SettingsNavigation } from "@/features/team/components/settings/settings-navigation";

export default async function SettingsLayout({
  children,
  params,
}: React.PropsWithChildren<{
  params: Promise<{ team: string }>;
}>) {
  return (
    <>
      <PageHeader title="Settings" />
      <PageBody className="px-0">
        <div className="my-10 flex flex-col gap-y-4 lg:flex-row lg:gap-x-8 lg:gap-y-0">
          <SettingsNavigation team={(await params).team} />
          <div className="w-full">{children}</div>
        </div>
      </PageBody>
    </>
  );
}
