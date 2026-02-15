import { AddressForm } from "../src/form/address";
import {
  SpaceBetween,
  Header,
  Container,
  Box,
} from "@cloudscape-design/components";

export default function Home() {
  return (
    <Box margin={"xxxl"} padding={{ top: "xl" }}>
      <SpaceBetween size="m">
        <Header variant="h1">Address Insights</Header>
        <Container>
          <AddressForm />
        </Container>
      </SpaceBetween>
    </Box>
  );
}
