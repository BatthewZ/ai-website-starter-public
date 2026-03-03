import { ChevronRight, FileX, Inbox, Search } from "lucide-react";
import { useState } from "react";

import { Row, Stack } from "@/web/components/layout";
import {
  Breadcrumbs,
  Button,
  Card,
  EmptyState,
  EmptyStateActions,
  EmptyStateDescription,
  EmptyStateIcon,
  EmptyStateTitle,
  Pagination,
  Skeleton,
  Text,
} from "@/web/components/ui";

import { Section, SubSection } from "./helpers";

/* ------------------------------------------------------------------ */
/*  EmptyState Demo                                                    */
/* ------------------------------------------------------------------ */

function EmptyStateDemo() {
  return (
    <Section title="EmptyState">
      <SubSection label="Small">
        <Card>
          <EmptyState size="sm">
            <EmptyStateIcon>
              <Inbox size={24} />
            </EmptyStateIcon>
            <EmptyStateTitle>No messages</EmptyStateTitle>
            <EmptyStateDescription>
              Your inbox is empty. New messages will appear here.
            </EmptyStateDescription>
          </EmptyState>
        </Card>
      </SubSection>

      <SubSection label="Medium (default)">
        <Card>
          <EmptyState size="md">
            <EmptyStateIcon>
              <Search size={32} />
            </EmptyStateIcon>
            <EmptyStateTitle>No results found</EmptyStateTitle>
            <EmptyStateDescription>
              Try adjusting your search or filters to find what you are looking for.
            </EmptyStateDescription>
            <EmptyStateActions>
              <Button variant="secondary" size="sm">
                Clear filters
              </Button>
            </EmptyStateActions>
          </EmptyState>
        </Card>
      </SubSection>

      <SubSection label="Large">
        <Card>
          <EmptyState size="lg">
            <EmptyStateIcon>
              <FileX size={40} />
            </EmptyStateIcon>
            <EmptyStateTitle>No documents</EmptyStateTitle>
            <EmptyStateDescription>
              You have not uploaded any documents yet. Get started by uploading your first file.
            </EmptyStateDescription>
            <EmptyStateActions>
              <Button size="md">Upload document</Button>
            </EmptyStateActions>
          </EmptyState>
        </Card>
      </SubSection>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/*  Breadcrumbs Demo                                                   */
/* ------------------------------------------------------------------ */

function BreadcrumbsDemo() {
  return (
    <Section title="Breadcrumbs">
      <SubSection label="Basic">
        <Card>
          <Breadcrumbs>
            <Breadcrumbs.Item href="/">Home</Breadcrumbs.Item>
            <Breadcrumbs.Item href="/products">Products</Breadcrumbs.Item>
            <Breadcrumbs.Item href="/products/category">Category</Breadcrumbs.Item>
            <Breadcrumbs.Item current>Item</Breadcrumbs.Item>
          </Breadcrumbs>
        </Card>
      </SubSection>

      <SubSection label="Truncated (maxItems=3)">
        <Card>
          <Breadcrumbs
            maxItems={3}
            itemsBeforeCollapse={1}
            itemsAfterCollapse={1}
          >
            <Breadcrumbs.Item href="/">Home</Breadcrumbs.Item>
            <Breadcrumbs.Item href="/products">Products</Breadcrumbs.Item>
            <Breadcrumbs.Item href="/products/electronics">Electronics</Breadcrumbs.Item>
            <Breadcrumbs.Item href="/products/electronics/phones">Phones</Breadcrumbs.Item>
            <Breadcrumbs.Item href="/products/electronics/phones/smartphones">
              Smartphones
            </Breadcrumbs.Item>
            <Breadcrumbs.Item current>iPhone 15 Pro</Breadcrumbs.Item>
          </Breadcrumbs>
        </Card>
      </SubSection>

      <SubSection label="Custom separator">
        <Card>
          <Breadcrumbs separator={<ChevronRight size={14} />}>
            <Breadcrumbs.Item href="/">Home</Breadcrumbs.Item>
            <Breadcrumbs.Item href="/settings">Settings</Breadcrumbs.Item>
            <Breadcrumbs.Item current>Profile</Breadcrumbs.Item>
          </Breadcrumbs>
        </Card>
      </SubSection>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/*  Pagination Demo                                                    */
/* ------------------------------------------------------------------ */

function PaginationDemo() {
  const [fullPage, setFullPage] = useState(1);
  const [compactPage, setCompactPage] = useState(1);
  const [sizedPage, setSizedPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const totalItems = 200;
  const totalPagesForSize = Math.ceil(totalItems / pageSize);

  return (
    <Section title="Pagination">
      <SubSection label="Full variant">
        <Card>
          <Stack gap="r5">
            <Pagination
              page={fullPage}
              totalPages={20}
              onPageChange={setFullPage}
              siblingCount={1}
            />
            <Text variant="body-3" color="secondary">
              Current page: {fullPage}
            </Text>
          </Stack>
        </Card>
      </SubSection>

      <SubSection label="Compact variant">
        <Card>
          <Stack gap="r5">
            <Pagination
              page={compactPage}
              totalPages={20}
              onPageChange={setCompactPage}
              variant="compact"
            />
            <Text variant="body-3" color="secondary">
              Current page: {compactPage}
            </Text>
          </Stack>
        </Card>
      </SubSection>

      <SubSection label="With page size selector">
        <Card>
          <Stack gap="r5">
            <Pagination
              page={sizedPage}
              totalPages={totalPagesForSize}
              onPageChange={setSizedPage}
              siblingCount={1}
            />
            <Row gap="r5" align="center">
              <Text variant="body-3" color="secondary">
                Rows per page:
              </Text>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setSizedPage(1);
                }}
                className="rounded border border-border bg-surface-2 px-2 py-1 text-sm text-fg-primary"
              >
                {[10, 25, 50].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
              <Text variant="body-3" color="secondary">
                ({totalItems} total items)
              </Text>
            </Row>
          </Stack>
        </Card>
      </SubSection>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/*  Skeleton Demo                                                      */
/* ------------------------------------------------------------------ */

function SkeletonDemo() {
  return (
    <Section title="Skeleton">
      <SubSection label="Text placeholders">
        <Card>
          <Stack gap="r5">
            <Skeleton variant="text" width="100%" height={16} />
            <Skeleton variant="text" width="80%" height={16} />
            <Skeleton variant="text" width="60%" height={16} />
          </Stack>
        </Card>
      </SubSection>

      <SubSection label="Avatar placeholder">
        <Card>
          <Row gap="r4" align="center">
            <Skeleton variant="circular" width={48} height={48} />
            <Stack gap="r6">
              <Skeleton variant="text" width={120} height={14} />
              <Skeleton variant="text" width={180} height={12} />
            </Stack>
          </Row>
        </Card>
      </SubSection>

      <SubSection label="Card composition">
        <Card>
          <Stack gap="r4">
            <Skeleton variant="rounded" width="100%" height={180} />
            <Skeleton variant="text" width="70%" height={20} />
            <Stack gap="r6">
              <Skeleton variant="text" width="100%" height={14} />
              <Skeleton variant="text" width="100%" height={14} />
              <Skeleton variant="text" width="40%" height={14} />
            </Stack>
          </Stack>
        </Card>
      </SubSection>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/*  Composed export                                                    */
/* ------------------------------------------------------------------ */

export function SimpleComponentDemos() {
  return (
    <>
      <EmptyStateDemo />
      <BreadcrumbsDemo />
      <PaginationDemo />
      <SkeletonDemo />
    </>
  );
}
