import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";

const Logo = ({
  className,
  spanDesign,
  clickable = true,
}: {
  className?: string;
  spanDesign?: string;
  clickable?: boolean;
}) => {
  const content = (
    <h2
      className={cn(
        "text-2xl text-shop_dark_green font-black tracking-wider uppercase hover:text-shop_light_green hoverEffect group font-sans",
        className,
      )}
    >
      MyStore
      <span
        className={cn(
          "text-shop_light_green group-hover:text-shop_dark_green hoverEffect",
          spanDesign,
        )}
      >
        t
      </span>
    </h2>
  );

  if (!clickable) {
    return <div className="inline-flex cursor-default">{content}</div>;
  }

  return (
    <Link href={"/"} className="inline-flex">
      {content}
    </Link>
  );
};

export default Logo;
