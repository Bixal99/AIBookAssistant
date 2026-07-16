"use client";

import { useEffect, useState } from "react";

function toIso(value: string | Date) {
  return (value instanceof Date ? value : new Date(value)).toISOString();
}

/** Stable SSR label; swaps to locale format after mount to avoid hydration mismatch. */
export function LocalDate({
  value,
  className,
}: {
  value: string | Date;
  className?: string;
}) {
  const iso = toIso(value);
  const [label, setLabel] = useState(iso.slice(0, 10));

  useEffect(() => {
    setLabel(new Date(iso).toLocaleDateString());
  }, [iso]);

  return (
    <time dateTime={iso} className={className}>
      {label}
    </time>
  );
}

export function LocalDateTime({
  value,
  className,
}: {
  value: string | Date;
  className?: string;
}) {
  const iso = toIso(value);
  const [label, setLabel] = useState(iso.slice(0, 16).replace("T", " "));

  useEffect(() => {
    setLabel(new Date(iso).toLocaleString());
  }, [iso]);

  return (
    <time dateTime={iso} className={className}>
      {label}
    </time>
  );
}

export function LocalTime({
  value,
  className,
}: {
  value: string | Date;
  className?: string;
}) {
  const iso = toIso(value);
  const [label, setLabel] = useState(iso.slice(11, 16));

  useEffect(() => {
    setLabel(new Date(iso).toLocaleTimeString());
  }, [iso]);

  return (
    <time dateTime={iso} className={className}>
      {label}
    </time>
  );
}

export function TimeOfDayGreeting({ className }: { className?: string }) {
  const [text, setText] = useState("Hello");

  useEffect(() => {
    const h = new Date().getHours();
    if (h < 12) setText("Good Morning");
    else if (h < 18) setText("Good Afternoon");
    else setText("Good Evening");
  }, []);

  return <span className={className}>{text}</span>;
}
