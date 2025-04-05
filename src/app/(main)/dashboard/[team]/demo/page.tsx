import React from "react";
import Link from "next/link";

import { PageHeader } from "@/components/premadekit/page";
import { Button } from "@/components/ui/button";

const TeamDemoPage = () => {
  return (
    <section>
      <PageHeader title="Demo" description="This is a demo page">
        <Link href="/dashboard">
          <Button
            variant="outline"
            size="lg"
            className="hidden md:inline-flex font-medium transition-colors text-gray-600 hover:bg-gray-100"
          >
            Go back
          </Button>
        </Link>
      </PageHeader>
    </section>
  );
};

export default TeamDemoPage;
