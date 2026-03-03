import { Database } from "lucide-react";
import { useMemo, useState } from "react";

import { Row, Stack } from "@/web/components/layout";
import {
  AvatarUpload,
  Badge,
  Button,
  Card,
  type ColumnDef,
  DataTable,
  FileUpload,
  Table,
  Text,
  useToast,
} from "@/web/components/ui";

import { Section, SubSection } from "./helpers";

/* ------------------------------------------------------------------ */
/*  Mock data                                                          */
/* ------------------------------------------------------------------ */

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: "Active" | "Inactive" | "Pending";
}

const USERS: User[] = [
  { id: 1, name: "Olivia Martinez", email: "olivia.martinez@acme.io", role: "Admin", status: "Active" },
  { id: 2, name: "James Chen", email: "james.chen@acme.io", role: "Developer", status: "Active" },
  { id: 3, name: "Sophia Patel", email: "sophia.patel@acme.io", role: "Designer", status: "Pending" },
  { id: 4, name: "Liam O'Brien", email: "liam.obrien@acme.io", role: "Developer", status: "Active" },
  { id: 5, name: "Emma Johansson", email: "emma.johansson@acme.io", role: "Product Manager", status: "Inactive" },
];

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: "In Stock" | "Low Stock" | "Out of Stock";
  sku: string;
  rating: number;
}

const PRODUCTS: Product[] = [
  { id: 1, name: "Wireless Noise-Cancelling Headphones", category: "Audio", price: 299.99, stock: 142, status: "In Stock", sku: "AUD-WH-001", rating: 4.7 },
  { id: 2, name: "Mechanical Keyboard (Cherry MX)", category: "Peripherals", price: 179.00, stock: 8, status: "Low Stock", sku: "PER-KB-042", rating: 4.5 },
  { id: 3, name: "Ultra-Wide 34\" Monitor", category: "Displays", price: 649.00, stock: 53, status: "In Stock", sku: "DIS-UW-017", rating: 4.8 },
  { id: 4, name: "Ergonomic Office Chair", category: "Furniture", price: 549.99, stock: 0, status: "Out of Stock", sku: "FUR-CH-009", rating: 4.3 },
  { id: 5, name: "USB-C Docking Station", category: "Peripherals", price: 189.99, stock: 67, status: "In Stock", sku: "PER-DS-023", rating: 4.1 },
  { id: 6, name: "Portable SSD 2TB", category: "Storage", price: 129.99, stock: 215, status: "In Stock", sku: "STR-SS-088", rating: 4.6 },
  { id: 7, name: "Webcam 4K with Ring Light", category: "Peripherals", price: 119.00, stock: 5, status: "Low Stock", sku: "PER-WC-031", rating: 4.2 },
  { id: 8, name: "Standing Desk Converter", category: "Furniture", price: 379.00, stock: 0, status: "Out of Stock", sku: "FUR-SD-004", rating: 3.9 },
  { id: 9, name: "Bluetooth Trackpad", category: "Peripherals", price: 89.99, stock: 94, status: "In Stock", sku: "PER-TP-056", rating: 4.4 },
  { id: 10, name: "Noise Machine (White/Brown)", category: "Audio", price: 49.99, stock: 321, status: "In Stock", sku: "AUD-NM-012", rating: 4.0 },
];

/* ------------------------------------------------------------------ */
/*  Status badge helper                                                */
/* ------------------------------------------------------------------ */

function StatusBadge({ status }: { status: string }) {
  const variant =
    status === "Active" || status === "In Stock"
      ? "success"
      : status === "Pending" || status === "Low Stock"
        ? "warning"
        : "error";
  return <Badge variant={variant}>{status}</Badge>;
}

/* ------------------------------------------------------------------ */
/*  Table Demo                                                         */
/* ------------------------------------------------------------------ */

function TableDemo() {
  const [density, setDensity] = useState<"dense" | "comfortable" | "spacious">("comfortable");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  function handleSort(key: string) {
    if (sortKey === key) {
      if (sortDir === "asc") {
        setSortDir("desc");
      } else {
        setSortKey(null);
      }
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  function getSortDirection(key: string): "asc" | "desc" | false {
    if (sortKey !== key) return false;
    return sortDir;
  }

  const sortedUsers = useMemo(() => {
    if (!sortKey) return USERS;
    return [...USERS].sort((a, b) => {
      const aVal = a[sortKey as keyof User];
      const bVal = b[sortKey as keyof User];
      const cmp = String(aVal).localeCompare(String(bVal));
      return sortDir === "desc" ? -cmp : cmp;
    });
  }, [sortKey, sortDir]);

  return (
    <Section title="Table">
      <Card>
        <Stack gap="r4">
          {/* Basic table */}
          <SubSection label="Basic Table">
            <Table>
              <Table.Head>
                <Table.Row>
                  <Table.HeaderCell>Name</Table.HeaderCell>
                  <Table.HeaderCell>Email</Table.HeaderCell>
                  <Table.HeaderCell>Role</Table.HeaderCell>
                  <Table.HeaderCell>Status</Table.HeaderCell>
                </Table.Row>
              </Table.Head>
              <Table.Body>
                {USERS.map((user) => (
                  <Table.Row key={user.id}>
                    <Table.Cell>{user.name}</Table.Cell>
                    <Table.Cell>{user.email}</Table.Cell>
                    <Table.Cell>{user.role}</Table.Cell>
                    <Table.Cell>
                      <StatusBadge status={user.status} />
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </SubSection>

          {/* Density variants */}
          <SubSection label="Density Variants">
            <Row gap="r5" wrap>
              <Button
                variant={density === "dense" ? "primary" : "secondary"}
                size="sm"
                onClick={() => setDensity("dense")}
              >
                Dense
              </Button>
              <Button
                variant={density === "comfortable" ? "primary" : "secondary"}
                size="sm"
                onClick={() => setDensity("comfortable")}
              >
                Comfortable
              </Button>
              <Button
                variant={density === "spacious" ? "primary" : "secondary"}
                size="sm"
                onClick={() => setDensity("spacious")}
              >
                Spacious
              </Button>
            </Row>
            <Table density={density}>
              <Table.Head>
                <Table.Row>
                  <Table.HeaderCell>Name</Table.HeaderCell>
                  <Table.HeaderCell>Email</Table.HeaderCell>
                  <Table.HeaderCell>Role</Table.HeaderCell>
                  <Table.HeaderCell>Status</Table.HeaderCell>
                </Table.Row>
              </Table.Head>
              <Table.Body>
                {USERS.map((user) => (
                  <Table.Row key={user.id}>
                    <Table.Cell>{user.name}</Table.Cell>
                    <Table.Cell>{user.email}</Table.Cell>
                    <Table.Cell>{user.role}</Table.Cell>
                    <Table.Cell>
                      <StatusBadge status={user.status} />
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </SubSection>

          {/* Striped variant */}
          <SubSection label="Striped">
            <Table striped>
              <Table.Head>
                <Table.Row>
                  <Table.HeaderCell>Name</Table.HeaderCell>
                  <Table.HeaderCell>Email</Table.HeaderCell>
                  <Table.HeaderCell>Role</Table.HeaderCell>
                  <Table.HeaderCell>Status</Table.HeaderCell>
                </Table.Row>
              </Table.Head>
              <Table.Body>
                {USERS.map((user) => (
                  <Table.Row key={user.id}>
                    <Table.Cell>{user.name}</Table.Cell>
                    <Table.Cell>{user.email}</Table.Cell>
                    <Table.Cell>{user.role}</Table.Cell>
                    <Table.Cell>
                      <StatusBadge status={user.status} />
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </SubSection>

          {/* Sortable headers */}
          <SubSection label="Sortable Headers">
            <Table>
              <Table.Head>
                <Table.Row>
                  <Table.HeaderCell
                    sortDirection={getSortDirection("name")}
                    onSort={() => handleSort("name")}
                  >
                    Name
                  </Table.HeaderCell>
                  <Table.HeaderCell
                    sortDirection={getSortDirection("email")}
                    onSort={() => handleSort("email")}
                  >
                    Email
                  </Table.HeaderCell>
                  <Table.HeaderCell
                    sortDirection={getSortDirection("role")}
                    onSort={() => handleSort("role")}
                  >
                    Role
                  </Table.HeaderCell>
                  <Table.HeaderCell>Status</Table.HeaderCell>
                </Table.Row>
              </Table.Head>
              <Table.Body>
                {sortedUsers.map((user) => (
                  <Table.Row key={user.id}>
                    <Table.Cell>{user.name}</Table.Cell>
                    <Table.Cell>{user.email}</Table.Cell>
                    <Table.Cell>{user.role}</Table.Cell>
                    <Table.Cell>
                      <StatusBadge status={user.status} />
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </SubSection>

          {/* Sticky header */}
          <SubSection label="Sticky Header (scroll the container)">
            <Table stickyHeader className="max-h-48 overflow-auto">
              <Table.Head>
                <Table.Row>
                  <Table.HeaderCell>Name</Table.HeaderCell>
                  <Table.HeaderCell>Email</Table.HeaderCell>
                  <Table.HeaderCell>Role</Table.HeaderCell>
                  <Table.HeaderCell>Status</Table.HeaderCell>
                </Table.Row>
              </Table.Head>
              <Table.Body>
                {[...USERS, ...USERS, ...USERS].map((user, i) => (
                  <Table.Row key={`${user.id}-${i}`}>
                    <Table.Cell>{user.name}</Table.Cell>
                    <Table.Cell>{user.email}</Table.Cell>
                    <Table.Cell>{user.role}</Table.Cell>
                    <Table.Cell>
                      <StatusBadge status={user.status} />
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </SubSection>
        </Stack>
      </Card>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/*  DataTable Demo                                                     */
/* ------------------------------------------------------------------ */

const PAGE_SIZE = 4;

function DataTableDemo() {
  const [selectedKeys, setSelectedKeys] = useState<Set<string | number>>(new Set());
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showEmpty, setShowEmpty] = useState(false);
  const [sort, setSort] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);

  const columns: ColumnDef<Product>[] = useMemo(
    () => [
      {
        key: "name",
        header: "Product",
        sortable: true,
        render: (row) => <Text weight="semibold">{row.name}</Text>,
      },
      {
        key: "sku",
        header: "SKU",
        width: 120,
        render: (row) => (
          <Text variant="body-3" color="muted">
            {row.sku}
          </Text>
        ),
      },
      {
        key: "category",
        header: "Category",
        sortable: true,
        width: 130,
      },
      {
        key: "price",
        header: "Price",
        sortable: true,
        width: 100,
        align: "right" as const,
        render: (row) => `$${row.price.toFixed(2)}`,
      },
      {
        key: "stock",
        header: "Stock",
        sortable: true,
        width: 80,
        align: "right" as const,
      },
      {
        key: "status",
        header: "Status",
        width: 130,
        render: (row) => <StatusBadge status={row.status} />,
      },
      {
        key: "rating",
        header: "Rating",
        sortable: true,
        width: 80,
        align: "right" as const,
        render: (row) => `${row.rating.toFixed(1)} / 5`,
      },
    ],
    [],
  );

  // Sort the full dataset before pagination so sorting applies across all pages
  const sortedData = useMemo(() => {
    const data = showEmpty ? [] : PRODUCTS;
    if (!sort) return data;
    return [...data].sort((a, b) => {
      const aVal = a[sort.key as keyof Product];
      const bVal = b[sort.key as keyof Product];
      let result: number;
      if (typeof aVal === "number" && typeof bVal === "number") {
        result = aVal - bVal;
      } else {
        result = String(aVal).localeCompare(String(bVal));
      }
      return sort.direction === "desc" ? -result : result;
    });
  }, [showEmpty, sort]);
  const totalPages = Math.max(1, Math.ceil(sortedData.length / PAGE_SIZE));
  const pagedData = sortedData.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <Section title="DataTable">
      <Card>
        <Stack gap="r4">
          {/* Full-featured DataTable */}
          <SubSection label="Full-Featured (sortable, selectable, paginated)">
            <Row gap="r5" wrap>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => {
                  setLoading(true);
                  setTimeout(() => setLoading(false), 2000);
                }}
              >
                Simulate Loading
              </Button>
              <Button
                size="sm"
                variant={showEmpty ? "primary" : "secondary"}
                onClick={() => {
                  setShowEmpty((v) => !v);
                  setPage(1);
                  setSelectedKeys(new Set());
                }}
              >
                {showEmpty ? "Show Data" : "Show Empty State"}
              </Button>
              {selectedKeys.size > 0 && (
                <Text variant="body-2" color="secondary">
                  {selectedKeys.size} row{selectedKeys.size > 1 ? "s" : ""} selected
                </Text>
              )}
            </Row>
            <DataTable
              data={pagedData}
              columns={columns}
              rowKey={(row) => row.id}
              sort={sort ?? undefined}
              onSortChange={(s) => {
                setSort(s);
                setPage(1);
              }}
              selectable
              selectedKeys={selectedKeys}
              onSelectionChange={setSelectedKeys}
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
              loading={loading}
              loadingRowCount={PAGE_SIZE}
              emptyContent={
                <Stack gap="r5" className="items-center py-r2">
                  <Database size={40} className="text-fg-muted" />
                  <Text variant="body-1" color="muted">
                    No products found
                  </Text>
                  <Button size="sm" variant="secondary" onClick={() => setShowEmpty(false)}>
                    Reset filters
                  </Button>
                </Stack>
              }
            />
          </SubSection>
        </Stack>
      </Card>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/*  FileUpload Demo                                                    */
/* ------------------------------------------------------------------ */

function FileUploadDemo() {
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  function handleFilesSelected(files: File[]) {
    const file = files[0];
    if (!file) return;
    setSelectedFile(file);

    // Create preview for images
    if (file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }

    toast("Upload demo — no server connection", {
      variant: "info",
      title: "Demo Mode",
    });
  }

  function handleClear() {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setSelectedFile(null);
    setPreviewUrl(null);
  }

  return (
    <Section title="FileUpload">
      <Card>
        <Stack gap="r4">
          {/* Basic dropzone */}
          <SubSection label="Basic Dropzone">
            <FileUpload
              onFilesSelected={(files) => {
                toast("Upload demo — no server connection", {
                  variant: "info",
                  title: "Demo Mode",
                });
                if (files[0]) {
                  toast(`Selected: ${files[0].name} (${(files[0].size / 1024).toFixed(1)} KB)`, {
                    variant: "success",
                    title: "File Selected",
                  });
                }
              }}
              hint="Drag & drop any file here, or click to browse"
            />
          </SubSection>

          {/* Image only */}
          <SubSection label="Images Only (with preview)">
            <FileUpload
              accept={["image/png", "image/jpeg", "image/gif", "image/webp"]}
              maxSize={5 * 1024 * 1024}
              onFilesSelected={handleFilesSelected}
              hint="PNG, JPG, GIF, or WebP up to 5 MB"
              success={selectedFile ? `Selected: ${selectedFile.name}` : undefined}
            />
            {previewUrl && (
              <Stack gap="r5" className="items-start">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="max-h-48 rounded-md border border-border-default object-contain"
                />
                <Button size="sm" variant="secondary" onClick={handleClear}>
                  Clear Selection
                </Button>
              </Stack>
            )}
          </SubSection>

          {/* Disabled / uploading states */}
          <SubSection label="Upload States">
            <Row gap="r4" wrap className="items-start">
              <Stack gap="r5" className="flex-1 min-w-64">
                <Text variant="body-3" color="muted">
                  Disabled
                </Text>
                <FileUpload disabled hint="This dropzone is disabled" />
              </Stack>
              <Stack gap="r5" className="flex-1 min-w-64">
                <Text variant="body-3" color="muted">
                  Uploading
                </Text>
                <FileUpload uploading />
              </Stack>
              <Stack gap="r5" className="flex-1 min-w-64">
                <Text variant="body-3" color="muted">
                  Error
                </Text>
                <FileUpload error="Upload failed. The file exceeds the maximum size." />
              </Stack>
            </Row>
          </SubSection>
        </Stack>
      </Card>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/*  AvatarUpload Demo                                                  */
/* ------------------------------------------------------------------ */

function AvatarUploadDemo() {
  const { toast } = useToast();

  function handleUploadComplete() {
    toast("Upload demo — no server connection", {
      variant: "info",
      title: "Demo Mode",
    });
  }

  return (
    <Section title="AvatarUpload">
      <Card>
        <Stack gap="r4">
          <SubSection label="Without Existing Avatar">
            <Text variant="body-2" color="muted">
              Hover over the avatar to see the camera overlay. Selecting a file shows a preview
              but the upload will not connect to a server.
            </Text>
            <Row gap="r4" wrap className="items-end">
              <Stack gap="r5" className="items-center">
                <AvatarUpload
                  name="New User"
                  size="xl"
                  onUploadComplete={handleUploadComplete}
                />
                <Text variant="body-3" color="muted">
                  xl
                </Text>
              </Stack>
              <Stack gap="r5" className="items-center">
                <AvatarUpload
                  name="New User"
                  size="lg"
                  onUploadComplete={handleUploadComplete}
                />
                <Text variant="body-3" color="muted">
                  lg
                </Text>
              </Stack>
              <Stack gap="r5" className="items-center">
                <AvatarUpload
                  name="New User"
                  size="md"
                  onUploadComplete={handleUploadComplete}
                />
                <Text variant="body-3" color="muted">
                  md
                </Text>
              </Stack>
            </Row>
          </SubSection>

          <SubSection label="With Existing Avatar">
            <Text variant="body-2" color="muted">
              An existing avatar is shown. Clicking replaces it with a new selection.
            </Text>
            <Row gap="r4" wrap className="items-end">
              <Stack gap="r5" className="items-center">
                <AvatarUpload
                  src="https://i.pravatar.cc/256?u=olivia"
                  name="Olivia Martinez"
                  size="xl"
                  onUploadComplete={handleUploadComplete}
                />
                <Text variant="body-3" color="muted">
                  Olivia Martinez
                </Text>
              </Stack>
              <Stack gap="r5" className="items-center">
                <AvatarUpload
                  src="https://i.pravatar.cc/256?u=james"
                  name="James Chen"
                  size="xl"
                  onUploadComplete={handleUploadComplete}
                />
                <Text variant="body-3" color="muted">
                  James Chen
                </Text>
              </Stack>
            </Row>
          </SubSection>
        </Stack>
      </Card>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/*  Root export                                                        */
/* ------------------------------------------------------------------ */

export function DataComponentDemos() {
  return (
    <>
      <TableDemo />
      <DataTableDemo />
      <FileUploadDemo />
      <AvatarUploadDemo />
    </>
  );
}
