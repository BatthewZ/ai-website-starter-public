import {
  Calendar,
  Card,
  DatePicker,
  type DateRange,
  DateRangePicker,
  Field,
  Label,
  RangeCalendar,
  Row,
  Stack,
  Text,
} from "@batthewz/response-ui-react-components";
import { useState } from "react";

import { Section, SubSection } from "./helpers";

function fmt(d: Date | null | undefined): string {
  return d ? d.toLocaleDateString(undefined, { dateStyle: "medium" }) : "—";
}

/* ------------------------------------------------------------------ */
/*  Calendar                                                          */
/* ------------------------------------------------------------------ */

function CalendarDemo() {
  const [date, setDate] = useState<Date | null>(null);

  return (
    <Section title="Calendar" id="calendar">
      <SubSection label="Single-date picker with month navigation">
        <Row gap="r5" wrap align="start">
          <Card className="w-fit">
            <Calendar value={date} onValueChange={setDate} showToday />
          </Card>
          <Stack gap="r6">
            <Text variant="body-2" weight="semibold">
              {fmt(date)}
            </Text>
            <Text variant="body-3" color="muted">
              Selected date
            </Text>
          </Stack>
        </Row>
      </SubSection>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/*  RangeCalendar                                                     */
/* ------------------------------------------------------------------ */

function RangeCalendarDemo() {
  const [range, setRange] = useState<DateRange>({ start: null, end: null });

  return (
    <Section title="Range Calendar" id="rangecalendar">
      <SubSection label="Date-range picker with hover preview (2 months)">
        <Stack gap="r4">
          <Card className="w-fit">
            <RangeCalendar value={range} onValueChange={setRange} numberOfMonths={2} />
          </Card>
          <Text variant="body-3" color="muted">
            {fmt(range.start)} → {fmt(range.end)}
          </Text>
        </Stack>
      </SubSection>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/*  DatePicker                                                        */
/* ------------------------------------------------------------------ */

function DatePickerDemo() {
  const [date, setDate] = useState<Date | null>(null);

  return (
    <Section title="Date Picker" id="datepicker">
      <SubSection label="Text input backed by a Calendar popover (clearable)">
        <Card className="max-w-xs">
          <Field>
            <Label>Due date</Label>
            <DatePicker
              value={date}
              onValueChange={setDate}
              clearable
              placeholder="Select a date…"
            />
          </Field>
        </Card>
      </SubSection>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/*  DateRangePicker                                                   */
/* ------------------------------------------------------------------ */

function DateRangePickerDemo() {
  const [range, setRange] = useState<DateRange>({ start: null, end: null });

  return (
    <Section title="Date Range Picker" id="daterangepicker">
      <SubSection label="Start/end inputs backed by a RangeCalendar popover">
        <Card className="max-w-md">
          <Field>
            <Label>Reporting period</Label>
            <DateRangePicker
              value={range}
              onValueChange={setRange}
              startPlaceholder="Start"
              endPlaceholder="End"
            />
          </Field>
        </Card>
      </SubSection>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/*  Root export                                                        */
/* ------------------------------------------------------------------ */

export function DateComponentDemos() {
  return (
    <>
      <CalendarDemo />
      <RangeCalendarDemo />
      <DatePickerDemo />
      <DateRangePickerDemo />
    </>
  );
}
