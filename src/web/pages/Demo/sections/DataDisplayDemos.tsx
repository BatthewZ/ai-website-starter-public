import {
  ActivityFeed,
  Avatar,
  Card,
  DescriptionList,
  Meter,
  ProgressRing,
  Rating,
  Row,
  Sparkline,
  Stack,
  Text,
} from "@batthewz/response-ui-react-components";
import { GitCommit, MessageSquare, UserPlus } from "lucide-react";
import { useState } from "react";

import { Section, SubSection } from "./helpers";

/* ------------------------------------------------------------------ */
/*  Sparkline                                                         */
/* ------------------------------------------------------------------ */

const REVENUE = [12, 18, 15, 22, 19, 28, 24, 31, 27, 35, 32, 40];
const TRAFFIC = [40, 32, 35, 27, 31, 24, 28, 19, 22, 15, 18, 12];
const SESSIONS = [8, 14, 10, 16, 12, 18, 15, 11, 19, 14, 21, 17];

function SparklineDemo() {
  return (
    <Section title="Sparkline" id="sparkline">
      <SubSection label="Tiny inline charts — line, area & bar">
        <Row gap="r4" wrap align="stretch">
          <Card>
            <Stack gap="r5">
              <Text variant="body-3" color="muted">
                Revenue (line)
              </Text>
              <Sparkline values={REVENUE} variant="line" width={160} height={48} />
            </Stack>
          </Card>
          <Card>
            <Stack gap="r5">
              <Text variant="body-3" color="muted">
                Traffic (area)
              </Text>
              <Sparkline values={TRAFFIC} variant="area" width={160} height={48} />
            </Stack>
          </Card>
          <Card>
            <Stack gap="r5">
              <Text variant="body-3" color="muted">
                Sessions (bar)
              </Text>
              <Sparkline values={SESSIONS} variant="bar" width={160} height={48} />
            </Stack>
          </Card>
        </Row>
      </SubSection>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/*  ProgressRing                                                      */
/* ------------------------------------------------------------------ */

function ProgressRingDemo() {
  return (
    <Section title="Progress Ring" id="progressring">
      <SubSection label="Circular progress with semantic colors">
        <Row gap="r5" wrap align="center">
          <ProgressRing value={72} color="accent">
            <Text variant="body-2" weight="semibold">
              72%
            </Text>
          </ProgressRing>
          <ProgressRing value={90} color="success">
            <Text variant="body-2" weight="semibold">
              90%
            </Text>
          </ProgressRing>
          <ProgressRing value={45} color="warning" size={88}>
            <Text variant="body-2" weight="semibold">
              45%
            </Text>
          </ProgressRing>
          <ProgressRing value={18} color="error" size={64} thickness={6}>
            <Text variant="body-3" weight="semibold">
              18%
            </Text>
          </ProgressRing>
        </Row>
      </SubSection>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/*  Meter                                                             */
/* ------------------------------------------------------------------ */

function MeterDemo() {
  return (
    <Section title="Meter" id="meter">
      <SubSection label="Segmented capacity meters with warning / critical thresholds">
        <Card className="max-w-md">
          <Stack gap="r4">
            <Stack gap="r5">
              <Row className="justify-between">
                <Text variant="body-3" color="secondary">
                  Disk usage
                </Text>
                <Text variant="body-3" color="muted">
                  46 / 100 GB
                </Text>
              </Row>
              <Meter value={46} max={100} warningAt={70} criticalAt={90} aria-label="Disk usage" />
            </Stack>
            <Stack gap="r5">
              <Row className="justify-between">
                <Text variant="body-3" color="secondary">
                  Memory
                </Text>
                <Text variant="body-3" color="muted">
                  78 / 100 GB
                </Text>
              </Row>
              <Meter value={78} max={100} warningAt={70} criticalAt={90} aria-label="Memory" />
            </Stack>
            <Stack gap="r5">
              <Row className="justify-between">
                <Text variant="body-3" color="secondary">
                  Quota
                </Text>
                <Text variant="body-3" color="muted">
                  94 / 100 GB
                </Text>
              </Row>
              <Meter
                value={94}
                max={100}
                segments={10}
                warningAt={70}
                criticalAt={90}
                aria-label="Quota"
              />
            </Stack>
          </Stack>
        </Card>
      </SubSection>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/*  Rating                                                            */
/* ------------------------------------------------------------------ */

function RatingDemo() {
  const [rating, setRating] = useState(3.5);

  return (
    <Section title="Rating" id="rating">
      <Row gap="r5" wrap align="start">
        <SubSection label="Interactive (half-star, keyboard nav)">
          <Card>
            <Stack gap="r5">
              <Rating
                value={rating}
                onValueChange={setRating}
                allowHalf
                aria-label="Your rating"
              />
              <Text variant="body-3" color="muted">
                {rating} / 5
              </Text>
            </Stack>
          </Card>
        </SubSection>
        <SubSection label="Read-only">
          <Card>
            <Rating value={4} readOnly aria-label="Average rating" />
          </Card>
        </SubSection>
      </Row>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/*  DescriptionList                                                   */
/* ------------------------------------------------------------------ */

function DescriptionListDemo() {
  return (
    <Section title="Description List" id="descriptionlist">
      <SubSection label="Semantic <dl> — horizontal layout">
        <Card className="max-w-md">
          <DescriptionList layout="horizontal">
            <DescriptionList.Term>Plan</DescriptionList.Term>
            <DescriptionList.Detail>Team (annual)</DescriptionList.Detail>
            <DescriptionList.Term>Seats</DescriptionList.Term>
            <DescriptionList.Detail>12 of 20 used</DescriptionList.Detail>
            <DescriptionList.Term>Renews</DescriptionList.Term>
            <DescriptionList.Detail>March 1, 2027</DescriptionList.Detail>
            <DescriptionList.Term>Owner</DescriptionList.Term>
            <DescriptionList.Detail>ada@example.com</DescriptionList.Detail>
          </DescriptionList>
        </Card>
      </SubSection>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/*  ActivityFeed                                                      */
/* ------------------------------------------------------------------ */

function ActivityFeedDemo() {
  return (
    <Section title="Activity Feed" id="activityfeed">
      <SubSection label="Event / activity stream">
        <Card className="max-w-lg">
          <ActivityFeed>
            <ActivityFeed.Item
              avatar={<Avatar name="Ada Lovelace" size="sm" />}
              actor={<Text weight="semibold">Ada Lovelace</Text>}
              action="opened a pull request"
              target={<Text weight="semibold">#482 · Add Calendar</Text>}
              timestamp={
                <Text variant="body-3" color="muted">
                  2h ago
                </Text>
              }
            />
            <ActivityFeed.Item
              icon={<GitCommit size={16} />}
              actor={<Text weight="semibold">Grace Hopper</Text>}
              action="pushed 3 commits to"
              target={<Text weight="semibold">main</Text>}
              timestamp={
                <Text variant="body-3" color="muted">
                  4h ago
                </Text>
              }
            />
            <ActivityFeed.Item
              icon={<MessageSquare size={16} />}
              actor={<Text weight="semibold">Linus T.</Text>}
              action="commented on"
              target={<Text weight="semibold">#479</Text>}
              timestamp={
                <Text variant="body-3" color="muted">
                  Yesterday
                </Text>
              }
            />
            <ActivityFeed.Item
              icon={<UserPlus size={16} />}
              actor={<Text weight="semibold">Margaret H.</Text>}
              action="joined the team"
              timestamp={
                <Text variant="body-3" color="muted">
                  2 days ago
                </Text>
              }
            />
          </ActivityFeed>
        </Card>
      </SubSection>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/*  Root export                                                        */
/* ------------------------------------------------------------------ */

export function DataDisplayDemos() {
  return (
    <>
      <SparklineDemo />
      <ProgressRingDemo />
      <MeterDemo />
      <RatingDemo />
      <DescriptionListDemo />
      <ActivityFeedDemo />
    </>
  );
}
