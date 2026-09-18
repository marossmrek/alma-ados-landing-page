import type { ComponentPropsWithoutRef } from "react";
import { cx } from "@/lib/cx";
import { Icon, type IconName } from "@/components/ui/Icon";

export function FeatureCard({
  icon,
  title,
  description,
  planned = false,
  as: Tag = "article",
  className,
  ...rest
}: {
  icon: IconName;
  title: string;
  description: string;
  planned?: boolean;
  /* "div" for an interactive (role="button") card; article does not allow the button role */
  as?: "article" | "div";
  className?: string;
} & ComponentPropsWithoutRef<"div">) {
  return (
    <Tag
      className={cx(
        "flex flex-col gap-5 rounded-16 border border-border-default bg-bg-surface p-6 transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_14px_32px_-14px_rgba(20,23,31,0.18)]",
        className,
      )}
      {...rest}
    >
      <div className="flex w-full items-center justify-between">
        <span className="flex size-10 items-center justify-center rounded-[10px] bg-accent-soft text-accent-text">
          <Icon name={icon} className="size-5" />
        </span>
        {planned && (
          <span className="inline-flex items-center rounded-full bg-accent-soft py-1.5 pl-3 pr-3.5 text-label-s text-accent-text">
            Plánované
          </span>
        )}
      </div>
      <h3 className="text-h4 text-text-primary">{title}</h3>
      <p className="text-body-m text-text-secondary">{description}</p>
    </Tag>
  );
}
