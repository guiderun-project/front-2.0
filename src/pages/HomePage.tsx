import { Text } from "@/components";
import styled from "@emotion/styled";

export const HomePage = () => {
  return (
    <Section>
      <Text font="display-l">안녕</Text>
      <Text font="heading-l-b">안녕</Text>
      <Text font="heading-m-b">안녕</Text>
      <Text font="heading-m-m">안녕</Text>
      <Text font="heading-m-r">안녕</Text>
      <Text font="heading-s-m">안녕</Text>
      <Text font="body-l-sb">안녕</Text>
      <Text font="body-m-sb">안녕</Text>
      <Text font="body-s-sb">안녕</Text>
      <Text font="body-s-r">안녕</Text>
      <Text font="detail-m-m">안녕</Text>
      <Text font="detail-m-r">안녕</Text>
      <Text font="detail-s-r">안녕</Text>
      <Heading>
        <Label>Foundation</Label>
        <Title>Router, API, MSW, and styling are ready to evolve.</Title>
        <Description>
          This workspace now boots with the v2 shell, shared API contracts,
          refresh-aware axios clients, and a minimal route layout that can
          absorb the new page architecture.
        </Description>
      </Heading>
      <Grid>
        <Card>
          <CardTitle>API contracts</CardTitle>
          <CardCopy>
            Auth, info, event, and admin request-response types are ported.
          </CardCopy>
        </Card>
        <Card>
          <CardTitle>Axios core</CardTitle>
          <CardCopy>
            Public and private clients share config and refresh expired tokens
            once.
          </CardCopy>
        </Card>
        <Card>
          <CardTitle>MSW hooks</CardTitle>
          <CardCopy>
            Mock handlers remain available behind `VITE_ENABLE_MSW=true` in
            development.
          </CardCopy>
        </Card>
        <Card>
          <CardTitle>Routing shell</CardTitle>
          <CardCopy>
            Only `/`, `/auth/*`, and `*` exist so the new IA can be designed
            cleanly.
          </CardCopy>
        </Card>
      </Grid>
    </Section>
  );
};

const Section = styled.section`
  display: grid;
  gap: 18px;
  padding: 28px;
  border-radius: 32px;
  background:
    linear-gradient(
      145deg,
      rgba(255, 255, 255, 0.95),
      rgba(246, 238, 224, 0.92)
    ),
    rgba(255, 255, 255, 0.88);
  border: 1px solid rgba(21, 32, 33, 0.08);
  box-shadow: 0 20px 60px rgba(18, 31, 28, 0.08);
`;

const Heading = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.md};
`;

const Label = styled.span`
  font-size: 0.78rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #6c705a;
`;

const Title = styled.h2`
  margin: 0;
  font-size: clamp(2rem, 4vw, 3.4rem);
  line-height: 0.95;
  max-width: 12ch;
`;

const Description = styled.p`
  margin: 0;
  max-width: 58ch;
  color: #39413a;
  font-size: 1rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 14px;
`;

const Card = styled.article`
  display: grid;
  gap: ${({ theme }) => theme.spacing.md};
  padding: 18px;
  border-radius: 22px;
  background: rgba(21, 32, 33, 0.04);
  border: 1px solid rgba(21, 32, 33, 0.08);
`;

const CardTitle = styled.h3`
  margin: 0;
  font-size: 1rem;
`;

const CardCopy = styled.p`
  margin: 0;
  color: #50584f;
`;
