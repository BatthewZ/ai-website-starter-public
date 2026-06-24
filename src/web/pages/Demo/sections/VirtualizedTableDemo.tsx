import {
  Badge,
  type ColumnDef,
  Text,
  VirtualizedDataTable,
} from "@batthewz/response-ui-react-components";
import { useMemo } from "react";

import { Section, SubSection } from "./helpers";

interface Member {
  id: number;
  name: string;
  email: string;
  team: string;
  score: number;
  status: "active" | "invited" | "suspended";
}

const FIRST = ["Ada", "Grace", "Linus", "Margaret", "Alan", "Katherine", "Dennis", "Barbara"];
const LAST = ["Lovelace", "Hopper", "Torvalds", "Hamilton", "Turing", "Johnson", "Ritchie", "Liskov"];
const TEAMS = ["Platform", "Growth", "Design", "Data", "Mobile", "Infra"];
const STATUSES: Member["status"][] = ["active", "invited", "suspended"];

const STATUS_VARIANT: Record<Member["status"], "success" | "info" | "error"> = {
  active: "success",
  invited: "info",
  suspended: "error",
};

function buildRows(count: number): Member[] {
  const rows: Member[] = [];
  for (let i = 0; i < count; i++) {
    const first = FIRST[i % FIRST.length];
    const last = LAST[(i * 3) % LAST.length];
    rows.push({
      id: i + 1,
      name: `${first} ${last}`,
      email: `${first.toLowerCase()}.${last.toLowerCase()}${i}@example.com`,
      team: TEAMS[i % TEAMS.length],
      score: (i * 37) % 1000,
      status: STATUSES[i % STATUSES.length],
    });
  }
  return rows;
}

function VirtualizedDataTableDemo() {
  const data = useMemo(() => buildRows(10_000), []);

  const columns: ColumnDef<Member>[] = useMemo(
    () => [
      { key: "id", header: "#", width: 72, align: "right", sortable: true },
      {
        key: "name",
        header: "Name",
        sortable: true,
        render: (row) => <Text weight="semibold">{row.name}</Text>,
      },
      {
        key: "email",
        header: "Email",
        render: (row) => (
          <Text variant="body-3" color="muted">
            {row.email}
          </Text>
        ),
      },
      { key: "team", header: "Team", width: 130, sortable: true },
      { key: "score", header: "Score", width: 100, align: "right", sortable: true },
      {
        key: "status",
        header: "Status",
        width: 130,
        render: (row) => <Badge variant={STATUS_VARIANT[row.status]}>{row.status}</Badge>,
      },
    ],
    [],
  );

  return (
    <Section title="Virtualized Data Table" id="virtualizeddatatable">
      <SubSection label="10,000 rows, windowed — only the visible slice mounts. Click headers to sort.">
        <VirtualizedDataTable<Member>
          data={data}
          columns={columns}
          rowKey={(row) => row.id}
          rowHeight={48}
          height={440}
          striped
          density="comfortable"
        />
      </SubSection>
    </Section>
  );
}

export function VirtualizedTableDemo() {
  return <VirtualizedDataTableDemo />;
}
