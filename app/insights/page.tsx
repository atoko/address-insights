import {
  BreadcrumbGroup,
  Spinner,
  SpaceBetween,
  Box,
} from "@cloudscape-design/components";
import { forwardLocateByAddress } from "../api/forward-locate/route";
import { Suspense } from "react";
import { InsightsContainer } from "../../src/display/insights";

export default async function Insights({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const addressQuery = (await searchParams)["address"];
  const address = forwardLocateByAddress(addressQuery as string);

  return (
    <Box padding={"xxxl"}>
      <SpaceBetween size="m">
        <BreadcrumbGroup
          items={[
            { text: "Home", href: "/" },
            { text: "Insights", href: "#" },
          ]}
        />
        <Suspense fallback={<Spinner variant={"normal"} size={"large"} />}>
          <InsightsContainer address={address} />
        </Suspense>
      </SpaceBetween>
    </Box>
  );
}
