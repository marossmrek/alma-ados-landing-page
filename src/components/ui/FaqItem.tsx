"use client";

import { useId, useState } from "react";
import { cx } from "@/lib/cx";
import { Icon } from "@/components/ui/Icon";

export function FaqItem({
  question,
  answer,
  defaultOpen = false,
}: {
  question: string;
  answer: string;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();
  return (
    <li className="border-b border-border-default">
      <h3 className="m-0">
        <button
          id={`${id}-button`}
          type="button"
          aria-expanded={open}
          aria-controls={`${id}-panel`}
          onClick={() => setOpen((v) => !v)}
          className="focus-ring group flex w-full items-start gap-4 rounded-8 py-5 text-left"
        >
          <span className="flex-1 text-body-l font-medium text-text-primary transition-colors group-hover:text-accent-text">
            {question}
          </span>
          <span
            className={cx(
              "mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full transition-colors",
              open ? "bg-accent-soft text-accent-text" : "bg-bg-muted text-text-secondary group-hover:bg-accent-soft",
            )}
          >
            <Icon
              name="arrow-down"
              className={cx("size-3.5 transition-transform duration-300", open && "rotate-180")}
            />
          </span>
        </button>
      </h3>
      {/* Smooth expand via grid-template-rows (0fr → 1fr) */}
      <div
        id={`${id}-panel`}
        role="region"
        aria-labelledby={`${id}-button`}
        aria-hidden={!open}
        className={cx(
          "grid transition-[grid-template-rows] duration-300 ease-out",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden">
          <p
            className={cx(
              "pb-5 text-body-m text-text-secondary transition-opacity duration-300",
              open ? "opacity-100" : "opacity-0",
            )}
          >
            {answer}
          </p>
        </div>
      </div>
    </li>
  );
}
