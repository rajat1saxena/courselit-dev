import BaseLayout from "../components/public/base-layout";
import { Section } from "components-library";
import { Typography } from "@mui/material";
import { PAGE_TITLE_404 } from "../ui-config/strings";

export default function Custom404() {
  return (
    <BaseLayout title={PAGE_TITLE_404}>
      <Section>
        <Typography variant="h1">{PAGE_TITLE_404}</Typography>
      </Section>
    </BaseLayout>
  );
}
