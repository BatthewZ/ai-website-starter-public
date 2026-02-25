import { Award, Briefcase, Code2, Film, Heart, Palette, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Parallax, ScrollReveal, Stagger } from "@/web/components/animation";
import { Container, Row, Stack } from "@/web/components/layout";
import {
  Accordion,
  Avatar,
  AvatarGroup,
  Badge,
  Button,
  Card,
  Carousel,
  Hero,
  MasonryGrid,
  MediaCard,
  ProgressBar,
  Spotlight,
  StatCard,
  Swimlane,
  Tabs,
  Text,
  ThemeSwitcher,
  Timeline,
} from "@/web/components/ui";
import { useDocumentTitle } from "@/web/hooks/use-document-title";

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const TRANSPARENT_PX =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

/** Theme-adaptive gradients using CSS custom properties. */
const G = {
  hero: "linear-gradient(135deg, var(--C-PRIMARY) 0%, var(--C-ACCENT) 100%)",
  cta: "linear-gradient(135deg, var(--C-ACCENT) 0%, var(--C-PRIMARY) 100%)",
  a: "linear-gradient(135deg, var(--C-PRIMARY) 0%, var(--C-ACCENT-HOVER) 100%)",
  b: "linear-gradient(160deg, var(--C-ACCENT) 0%, var(--C-PRIMARY-HOVER) 100%)",
  c: "linear-gradient(200deg, var(--C-PRIMARY-HOVER) 0%, var(--C-ACCENT) 100%)",
  d: "linear-gradient(to right, var(--C-ACCENT-HOVER) 0%, var(--C-PRIMARY) 100%)",
  e: "linear-gradient(180deg, var(--C-PRIMARY) 0%, var(--C-ACCENT-HOVER) 100%)",
  f: "linear-gradient(225deg, var(--C-ACCENT) 0%, var(--C-ACCENT-HOVER) 100%)",
  g: "linear-gradient(135deg, var(--C-ACCENT-HOVER) 0%, var(--C-PRIMARY-HOVER) 100%)",
  testimonial: "linear-gradient(180deg, var(--C-SURFACE-1) 0%, var(--C-SURFACE-2) 100%)",
};

/* ------------------------------------------------------------------ */
/*  Mock data                                                          */
/* ------------------------------------------------------------------ */

const METRICS = [
  {
    to: 200,
    label: "Projects Delivered",
    trend: 12,
    dir: "up" as const,
    icon: <Briefcase size={20} />,
  },
  { to: 50, label: "Team Members", trend: 8, dir: "up" as const, icon: <Users size={20} /> },
  {
    to: 98,
    label: "Client Satisfaction",
    trend: 3,
    dir: "up" as const,
    icon: <Heart size={20} />,
    fmt: (v: number) => `${v}%`,
  },
  { to: 15, label: "Industry Awards", trend: 25, dir: "up" as const, icon: <Award size={20} /> },
];

const SERVICES = {
  design: [
    {
      title: "Brand Identity",
      desc: "Memorable brand identities that capture your essence and resonate with your audience.",
      gradient: G.a,
    },
    {
      title: "UI/UX Design",
      desc: "User-centered design that balances aesthetics with intuitive functionality.",
      gradient: G.b,
    },
    {
      title: "Design Systems",
      desc: "Scalable component libraries and style guides that ensure consistency across products.",
      gradient: G.c,
    },
  ],
  engineering: [
    {
      title: "Web Applications",
      desc: "High-performance web apps built with modern frameworks and best practices.",
      gradient: G.d,
    },
    {
      title: "Cloud Infrastructure",
      desc: "Serverless architectures and edge computing for global-scale applications.",
      gradient: G.e,
    },
    {
      title: "API Development",
      desc: "RESTful and GraphQL APIs designed for reliability and developer experience.",
      gradient: G.f,
    },
  ],
  motion: [
    {
      title: "UI Animation",
      desc: "Purposeful motion design that guides users and enhances interactions.",
      gradient: G.g,
    },
    {
      title: "Video Production",
      desc: "Cinematic brand films and product demos that tell compelling stories.",
      gradient: G.a,
    },
    {
      title: "3D & WebGL",
      desc: "Immersive 3D experiences and interactive visualizations for the web.",
      gradient: G.b,
    },
  ],
};

const FEATURED_WORKS = [
  { title: "Nova Banking App", category: "Fintech", tag: "Featured", gradient: G.a },
  { title: "Pulse Health Platform", category: "Healthcare", tag: "Case Study", gradient: G.b },
  { title: "Vertex SaaS Dashboard", category: "Enterprise", tag: "New", gradient: G.c },
  { title: "Bloom E-commerce", category: "Retail", tag: "Award Winner", gradient: G.d },
  { title: "Echo Music App", category: "Entertainment", tag: "Featured", gradient: G.e },
  { title: "Atlas Travel Platform", category: "Travel", tag: "Case Study", gradient: G.f },
];

const GALLERY_ITEMS: {
  title: string;
  orientation: "portrait" | "landscape" | "square";
  gradient: string;
}[] = [
  { title: "Brand Redesign", orientation: "portrait", gradient: G.a },
  { title: "App Dashboard", orientation: "landscape", gradient: G.b },
  { title: "Icon System", orientation: "square", gradient: G.c },
  { title: "Marketing Site", orientation: "portrait", gradient: G.d },
  { title: "E-commerce Platform", orientation: "landscape", gradient: G.e },
  { title: "Mobile App", orientation: "portrait", gradient: G.f },
  { title: "Social Campaign", orientation: "square", gradient: G.g },
  { title: "Product Launch", orientation: "landscape", gradient: G.hero },
  { title: "Annual Report", orientation: "portrait", gradient: G.cta },
];

const PROCESS_STEPS = [
  {
    title: "Discovery",
    desc: "We immerse ourselves in your business, audience, and competitive landscape. Research-driven insights shape every decision that follows.",
    gradient: G.a,
  },
  {
    title: "Design & Prototype",
    desc: "From wireframes to high-fidelity prototypes, we iterate rapidly. You see and interact with designs before a single line of production code is written.",
    gradient: G.b,
  },
  {
    title: "Build & Launch",
    desc: "Clean, performant code meets rigorous QA. We ship with confidence and measure results from day one.",
    gradient: G.c,
  },
];

const TIMELINE_EVENTS = [
  {
    date: "2020",
    title: "Founded Horizon",
    body: "Started with 3 founders and a shared vision for better digital experiences.",
  },
  {
    date: "2021",
    title: "First Major Client",
    body: "Partnered with a Fortune 500 company for a complete digital transformation.",
  },
  {
    date: "2022",
    title: "Team Grew to 20",
    body: "Expanded our design and engineering teams to meet growing demand.",
  },
  {
    date: "2023",
    title: "International Expansion",
    body: "Opened offices in London and Tokyo, serving clients across 3 continents.",
  },
  {
    date: "2024",
    title: "100th Project",
    body: "Delivered our 100th project while maintaining a 98% client satisfaction rate.",
  },
  {
    date: "2025",
    title: "AI-First Approach",
    body: "Integrated AI-powered workflows across all service lines.",
  },
];

const TEAM = [
  { name: "Alex Chen", role: "CEO & Founder", status: "online" as const },
  { name: "Sarah Kim", role: "Design Director", status: "online" as const },
  { name: "Marcus Johnson", role: "CTO", status: "away" as const },
  { name: "Elena Rodriguez", role: "Creative Lead", status: "online" as const },
  { name: "David Park", role: "Engineering Lead", status: "online" as const },
  { name: "Mia Thompson", role: "Strategy Director", status: "offline" as const },
  { name: "James Wilson", role: "Motion Designer", status: "online" as const },
  { name: "Aisha Patel", role: "UX Researcher", status: "away" as const },
];

const EXPERTISE: Record<
  string,
  {
    label: string;
    value: number;
    variant: "default" | "gradient" | "striped";
    color: "accent" | "success" | "warning" | "error";
  }[]
> = {
  technical: [
    { label: "React & TypeScript", value: 95, variant: "gradient", color: "accent" },
    { label: "Node.js & Workers", value: 90, variant: "default", color: "accent" },
    { label: "Performance Optimization", value: 88, variant: "striped", color: "success" },
    { label: "DevOps & CI/CD", value: 82, variant: "default", color: "warning" },
  ],
  design: [
    { label: "UI Design", value: 96, variant: "gradient", color: "accent" },
    { label: "Motion Design", value: 85, variant: "default", color: "warning" },
    { label: "Typography & Layout", value: 92, variant: "striped", color: "accent" },
    { label: "Accessibility (WCAG)", value: 90, variant: "default", color: "success" },
  ],
  strategy: [
    { label: "Brand Strategy", value: 94, variant: "gradient", color: "accent" },
    { label: "Market Research", value: 87, variant: "default", color: "accent" },
    { label: "Growth Planning", value: 80, variant: "striped", color: "warning" },
    { label: "Analytics & Insights", value: 91, variant: "default", color: "success" },
  ],
};

const TESTIMONIALS = [
  {
    quote:
      "Horizon transformed our digital presence. Their attention to detail and strategic thinking exceeded all expectations.",
    name: "Rachel Foster",
    company: "Nova Financial",
  },
  {
    quote:
      "The team's ability to balance aesthetics with functionality is unmatched. They delivered a product our users love.",
    name: "Tom Bradley",
    company: "Pulse Health",
  },
  {
    quote:
      "Working with Horizon felt like having an extension of our own team. Their collaborative approach made all the difference.",
    name: "Lisa Chang",
    company: "Vertex Technologies",
  },
  {
    quote:
      "From concept to launch, Horizon delivered flawlessly. Our conversion rates increased 40% within the first month.",
    name: "Michael Torres",
    company: "Bloom Commerce",
  },
  {
    quote:
      "The design system Horizon built for us has saved our team hundreds of hours. It's elegant, scalable, and well-documented.",
    name: "Anna Kowalski",
    company: "Echo Media",
  },
];

const FAQ = [
  {
    q: "What industries do you specialize in?",
    a: "We work across fintech, healthcare, enterprise SaaS, e-commerce, and entertainment. Our process-driven approach adapts to any industry while our domain expertise ensures we understand your unique challenges.",
  },
  {
    q: "How long does a typical project take?",
    a: "Project timelines vary based on scope. A brand identity project typically takes 6\u20138 weeks, while a full web application can take 3\u20136 months. We provide detailed timelines during our discovery phase.",
  },
  {
    q: "Do you offer ongoing support after launch?",
    a: "Yes, we offer flexible retainer agreements for ongoing maintenance, optimization, and feature development. Many of our clients continue working with us long after the initial launch.",
  },
  {
    q: "What is your design process like?",
    a: "Our process follows four phases: Discovery, Design, Development, and Delivery. We keep you involved at every stage with regular check-ins, prototype reviews, and transparent progress tracking.",
  },
  {
    q: "How do you handle project communication?",
    a: "We use weekly sync meetings, async updates via Slack, and a shared project dashboard. You\u2019ll have a dedicated project manager as your single point of contact throughout the engagement.",
  },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const SERVICE_TABS: { value: string; label: string; icon: React.ReactNode }[] = [
  { value: "design", label: "Design", icon: <Palette size={16} /> },
  { value: "engineering", label: "Engineering", icon: <Code2 size={16} /> },
  { value: "motion", label: "Motion", icon: <Film size={16} /> },
];

const EXPERTISE_TABS = [
  { value: "technical", label: "Technical" },
  { value: "design", label: "Design" },
  { value: "strategy", label: "Strategy" },
];

/* ------------------------------------------------------------------ */
/*  Showcase page                                                      */
/* ------------------------------------------------------------------ */

export function Showcase() {
  useDocumentTitle("Showcase");
  const navigate = useNavigate();

  return (
    <>
      {/* ------------------------------------------------------------ */}
      {/*  1. Hero (full viewport)                                      */}
      {/* ------------------------------------------------------------ */}
      <Hero size="full" align="center">
        <Hero.Background parallax style={{ background: G.hero }} />
        <Hero.Content animate className="text-center">
          <Badge variant="info">Starter Kit</Badge>
          <Text variant="h1" color="on-primary" className="my-r2">
            AI Site Starter
          </Text>
          <Text variant="body-1" color="on-primary" className="max-w-2xl mx-auto opacity-90 my-r2">
            The launchpad for AI-driven websites. A themed component library, responsive layouts,
            and production-ready patterns — so you can go from prompt to product in record time.
          </Text>
          <Text variant="body-1" color="on-primary" className="max-w-2xl mx-auto opacity-90 my-r2">
            <span className="font-semibold">Note: This is just a demo page.</span>{" "}
            <a
              href="https://github.com/BatthewZ/ai-website-starter-public"
              target="_blank"
              className="link"
            >
              See GitHub for more.
            </a>
          </Text>
          <Row gap="r2" justify="center">
            <Button size="lg" onClick={() => void navigate("/demo")}>
              View Our Work
            </Button>
            <Button variant="secondary" size="lg">
              Get in Touch
            </Button>
          </Row>
        </Hero.Content>
      </Hero>

      {/* Wrapper so the sticky theme switcher has a tall parent */}
      <div>
        {/* ------------------------------------------------------------ */}
        {/*  2. Sticky Theme Switcher                                     */}
        {/* ------------------------------------------------------------ */}
        <div className="sticky top-0 z-50 py-r5">
          <Container size="xl">
            <Card padding="r4" className="bg-surface-0/80 backdrop-blur-md flex justify-center">
              <ThemeSwitcher />
            </Card>
          </Container>
        </div>

        {/* ------------------------------------------------------------ */}
        {/*  3. Metrics Bar (StatCards)                                    */}
        {/* ------------------------------------------------------------ */}
        <section className="py-r1">
          <Container size="xl">
            <ScrollReveal>
              <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-r4">
                {METRICS.map((m) => (
                  <StatCard key={m.label}>
                    <StatCard.Icon>{m.icon}</StatCard.Icon>
                    <StatCard.Value animateValue from={0} to={m.to} format={m.fmt} />
                    <StatCard.Label>{m.label}</StatCard.Label>
                    <StatCard.Trend value={m.trend} direction={m.dir} />
                  </StatCard>
                ))}
              </Stagger>
            </ScrollReveal>
          </Container>
        </section>

        {/* ------------------------------------------------------------ */}
        {/*  4. Services (Tabs — pill variant)                            */}
        {/* ------------------------------------------------------------ */}
        <section className="py-r1 bg-surface-1">
          <Container size="xl">
            <ScrollReveal>
              <Stack gap="r3">
                <Text variant="h2" className="text-center">
                  Our Services
                </Text>
                <Text variant="body-1" color="secondary" className="text-center max-w-xl mx-auto">
                  End-to-end capabilities that take your product from concept to launch and beyond.
                </Text>
                <Tabs variant="pill" defaultValue="design">
                  <Tabs.List className="justify-center">
                    {SERVICE_TABS.map((t) => (
                      <Tabs.Tab key={t.value} value={t.value}>
                        <Row gap="r6" as="span">
                          {t.icon}
                          {t.label}
                        </Row>
                      </Tabs.Tab>
                    ))}
                  </Tabs.List>
                  {SERVICE_TABS.map((tab) => (
                    <Tabs.Panel key={tab.value} value={tab.value}>
                      <Stagger className="grid grid-cols-1 md:grid-cols-3 gap-r4 mt-r4">
                        {SERVICES[tab.value as keyof typeof SERVICES].map((s) => (
                          <Card key={s.title} padding="r3" className="h-full">
                            <Stack gap="r5">
                              <div
                                className="h-2 w-12 rounded-full"
                                style={{ background: s.gradient }}
                              />
                              <Text variant="h5">{s.title}</Text>
                              <Text variant="body-2" color="secondary">
                                {s.desc}
                              </Text>
                            </Stack>
                          </Card>
                        ))}
                      </Stagger>
                    </Tabs.Panel>
                  ))}
                </Tabs>
              </Stack>
            </ScrollReveal>
          </Container>
        </section>

        {/* ------------------------------------------------------------ */}
        {/*  5. Featured Work (Swimlane + Carousel + MediaCards)          */}
        {/* ------------------------------------------------------------ */}
        <section className="py-r1">
          <Container size="xl">
            <Swimlane
              title="Featured Work"
              subtitle="A selection of projects we're proud of"
              viewAllHref="#"
            >
              <Carousel>
                <Carousel.Track className="py-2">
                  {FEATURED_WORKS.map((w) => (
                    <Carousel.Item key={w.title}>
                      <MediaCard orientation="landscape">
                        <MediaCard.Image
                          alt={w.title}
                          src={TRANSPARENT_PX}
                          style={{ background: w.gradient }}
                        />
                        <MediaCard.Overlay />
                        <MediaCard.Content>
                          <Text variant="h5" weight="semibold">
                            {w.title}
                          </Text>
                          <Text variant="body-3" className="opacity-80">
                            {w.category}
                          </Text>
                        </MediaCard.Content>
                        <MediaCard.Badge>
                          <Badge>{w.tag}</Badge>
                        </MediaCard.Badge>
                      </MediaCard>
                    </Carousel.Item>
                  ))}
                </Carousel.Track>
              </Carousel>
            </Swimlane>
          </Container>
        </section>

        {/* ------------------------------------------------------------ */}
        {/*  6. Work Gallery (MasonryGrid + MediaCards)                   */}
        {/* ------------------------------------------------------------ */}
        <section className="py-r1 bg-surface-1">
          <Container size="xl">
            <Stack gap="r3">
              <Text variant="h2" className="text-center">
                Work Gallery
              </Text>
              <Text variant="body-1" color="secondary" className="text-center max-w-xl mx-auto">
                Browse our portfolio spanning brand, product, and campaign work.
              </Text>
              <MasonryGrid columns={{ base: 1, sm: 2, md: 3 }} animate animation="scale">
                {GALLERY_ITEMS.map((item) => (
                  <MasonryGrid.Item key={item.title}>
                    <MediaCard orientation={item.orientation}>
                      <MediaCard.Image
                        alt={item.title}
                        src={TRANSPARENT_PX}
                        style={{ background: item.gradient }}
                      />
                      <MediaCard.Overlay />
                      <MediaCard.Content>
                        <Text variant="body-2" weight="semibold">
                          {item.title}
                        </Text>
                      </MediaCard.Content>
                    </MediaCard>
                  </MasonryGrid.Item>
                ))}
              </MasonryGrid>
            </Stack>
          </Container>
        </section>

        {/* ------------------------------------------------------------ */}
        {/*  7. Our Process (Spotlight)                                   */}
        {/* ------------------------------------------------------------ */}
        <section className="py-r1">
          <Container size="xl">
            <Stack gap="r3">
              <Text variant="h2" className="text-center">
                Our Process
              </Text>
              <Text variant="body-1" color="secondary" className="text-center max-w-xl mx-auto">
                A proven methodology refined over hundreds of projects.
              </Text>
              <Spotlight animate>
                {PROCESS_STEPS.map((step, i) => (
                  <Spotlight.Item key={step.title} reversed={i === 1}>
                    <Spotlight.Image
                      src={TRANSPARENT_PX}
                      parallax
                      className="aspect-4/3"
                      style={{ background: step.gradient }}
                    />
                    <Spotlight.Content>
                      <Stack gap="r4">
                        <Badge variant="info">Step {i + 1}</Badge>
                        <Text variant="h3">{step.title}</Text>
                        <Text variant="body-1" color="secondary">
                          {step.desc}
                        </Text>
                        {i === 1 && (
                          <Stack gap="r6">
                            <Row justify="between">
                              <ProgressBar.Label>Design completion</ProgressBar.Label>
                              <ProgressBar.Value>92%</ProgressBar.Value>
                            </Row>
                            <ProgressBar value={92} variant="gradient" color="accent" />
                          </Stack>
                        )}
                      </Stack>
                    </Spotlight.Content>
                  </Spotlight.Item>
                ))}
              </Spotlight>
            </Stack>
          </Container>
        </section>

        {/* ------------------------------------------------------------ */}
        {/*  8. Timeline (Our Journey)                                    */}
        {/* ------------------------------------------------------------ */}
        <section className="py-r1 bg-surface-1">
          <Container size="xl">
            <Stack gap="r3">
              <Text variant="h2" className="text-center">
                Our Journey
              </Text>
              <Text variant="body-1" color="secondary" className="text-center max-w-xl mx-auto">
                Key milestones that shaped who we are today.
              </Text>
              <Timeline animate>
                {TIMELINE_EVENTS.map((evt) => (
                  <Timeline.Item key={evt.date} date={evt.date} title={evt.title}>
                    <Text variant="body-2" color="secondary">
                      {evt.body}
                    </Text>
                  </Timeline.Item>
                ))}
              </Timeline>
            </Stack>
          </Container>
        </section>

        {/* ------------------------------------------------------------ */}
        {/*  9. Team Section (Avatars)                                    */}
        {/* ------------------------------------------------------------ */}
        <section className="py-r1">
          <Container size="xl">
            <Stack gap="r3">
              <Text variant="h2" className="text-center">
                Meet the Team
              </Text>
              <Text variant="body-1" color="secondary" className="text-center max-w-xl mx-auto">
                The talented people behind every project.
              </Text>
              <ScrollReveal>
                <Stagger className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-r4">
                  {TEAM.map((m) => (
                    <Card
                      key={m.name}
                      padding="r3"
                      className="flex flex-col items-center text-center gap-r5"
                    >
                      <Avatar size="xl" name={m.name} status={m.status} />
                      <Text variant="body-1" weight="semibold">
                        {m.name}
                      </Text>
                      <Badge>{m.role}</Badge>
                    </Card>
                  ))}
                </Stagger>
              </ScrollReveal>
              <Row justify="center">
                <AvatarGroup max={5} size="md">
                  {TEAM.map((m) => (
                    <Avatar key={m.name} name={m.name} size="md" />
                  ))}
                </AvatarGroup>
              </Row>
            </Stack>
          </Container>
        </section>

        {/* ------------------------------------------------------------ */}
        {/*  10. Expertise (Tabs — enclosed variant + ProgressBars)       */}
        {/* ------------------------------------------------------------ */}
        <section className="py-r1 bg-surface-1">
          <Container size="xl">
            <Stack gap="r3">
              <Text variant="h2" className="text-center">
                Our Expertise
              </Text>
              <Text variant="body-1" color="secondary" className="text-center max-w-xl mx-auto">
                Deep skills across the disciplines that matter most.
              </Text>
              <Tabs variant="enclosed" defaultValue="technical">
                <Tabs.List className="justify-center">
                  {EXPERTISE_TABS.map((t) => (
                    <Tabs.Tab key={t.value} value={t.value}>
                      {t.label}
                    </Tabs.Tab>
                  ))}
                </Tabs.List>
                {EXPERTISE_TABS.map((tab) => (
                  <Tabs.Panel key={tab.value} value={tab.value}>
                    <Stack gap="r4" className="mt-r4 max-w-2xl mx-auto">
                      {EXPERTISE[tab.value].map((skill) => (
                        <Stack key={skill.label} gap="r6">
                          <Row justify="between">
                            <ProgressBar.Label>{skill.label}</ProgressBar.Label>
                            <ProgressBar.Value>{skill.value}%</ProgressBar.Value>
                          </Row>
                          <ProgressBar
                            value={skill.value}
                            variant={skill.variant}
                            color={skill.color}
                          />
                        </Stack>
                      ))}
                    </Stack>
                  </Tabs.Panel>
                ))}
              </Tabs>
            </Stack>
          </Container>
        </section>

        {/* ------------------------------------------------------------ */}
        {/*  11. Testimonials (Parallax + Carousel)                      */}
        {/* ------------------------------------------------------------ */}
        <section className="py-r1 relative overflow-hidden">
          <Parallax rate={0.1} className="absolute inset-0 -z-10">
            <div className="size-full" style={{ background: G.testimonial }} />
          </Parallax>
          <Container size="xl">
            <Stack gap="r3">
              <Text variant="h2" className="text-center">
                What Clients Say
              </Text>
              <Text variant="body-1" color="secondary" className="text-center max-w-xl mx-auto">
                Don't just take our word for it.
              </Text>
              <Carousel>
                <Carousel.Track
                  className="py-2"
                  style={
                    {
                      "--carousel-item-width": "min(calc(100vw - 6rem), 28rem)",
                    } as React.CSSProperties
                  }
                >
                  {TESTIMONIALS.map((t) => (
                    <Carousel.Item key={t.name}>
                      <Card padding="r3">
                        <Stack gap="r4">
                          <Text variant="body-1" color="secondary" className="italic">
                            &ldquo;{t.quote}&rdquo;
                          </Text>
                          <Row gap="r4">
                            <Avatar size="md" name={t.name} />
                            <Stack gap="r6">
                              <Text variant="body-2" weight="semibold">
                                {t.name}
                              </Text>
                              <Text variant="body-3" color="muted">
                                {t.company}
                              </Text>
                            </Stack>
                          </Row>
                        </Stack>
                      </Card>
                    </Carousel.Item>
                  ))}
                </Carousel.Track>
              </Carousel>
            </Stack>
          </Container>
        </section>

        {/* ------------------------------------------------------------ */}
        {/*  12. FAQ (Accordion)                                          */}
        {/* ------------------------------------------------------------ */}
        <section className="py-r1">
          <Container size="xl">
            <Stack gap="r3">
              <Text variant="h2" className="text-center">
                Frequently Asked Questions
              </Text>
              <Text variant="body-1" color="secondary" className="text-center max-w-xl mx-auto">
                Everything you need to know about working with us.
              </Text>
              <ScrollReveal>
                <div className="max-w-2xl mx-auto">
                  <Accordion mode="single">
                    {FAQ.map((item) => (
                      <Accordion.Item key={item.q} value={item.q}>
                        <Accordion.Trigger>{item.q}</Accordion.Trigger>
                        <Accordion.Content>
                          <Text variant="body-2" color="secondary">
                            {item.a}
                          </Text>
                        </Accordion.Content>
                      </Accordion.Item>
                    ))}
                  </Accordion>
                </div>
              </ScrollReveal>
            </Stack>
          </Container>
        </section>
      </div>

      {/* ------------------------------------------------------------ */}
      {/*  13. CTA Footer (Hero reprise)                               */}
      {/* ------------------------------------------------------------ */}
      <Hero size="sm" align="center">
        <Hero.Background parallax style={{ background: G.cta }} />
        <Hero.Content animate animation="scale" className="text-center">
          <Text variant="h2" color="on-primary">
            Ready to Build Something Great?
          </Text>
          <Text variant="body-1" color="on-primary" className="max-w-xl mx-auto opacity-90">
            Let&apos;s turn your vision into reality. Start a conversation today.
          </Text>
          <Row gap="r4" justify="center">
            <Button size="lg">Start a Project</Button>
            <Button variant="secondary" size="lg">
              Get in Touch
            </Button>
          </Row>
        </Hero.Content>
      </Hero>
    </>
  );
}

export default Showcase;
