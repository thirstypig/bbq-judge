"use client";

import * as React from "react";
import { cn } from "@/shared/lib/utils";

// --- Context ---

const SectionCardContext = React.createContext<{ bordered: boolean }>({
  bordered: true,
});

// --- Root ---

interface RootProps extends React.HTMLAttributes<HTMLDivElement> {
  bordered?: boolean;
}

function Root({ bordered = true, className, children, ...props }: RootProps) {
  return (
    <SectionCardContext.Provider value={{ bordered }}>
      <div
        className={cn(
          "rounded-lg bg-card text-card-foreground",
          bordered && "border shadow-sm",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </SectionCardContext.Provider>
  );
}

// --- Header ---

interface HeaderProps {
  title: string;
  actions?: React.ReactNode;
  className?: string;
}

function Header({ title, actions, className }: HeaderProps) {
  const { bordered } = React.useContext(SectionCardContext);

  return (
    <div
      className={cn(
        "flex items-center justify-between px-6 py-4",
        bordered && "border-b",
        className
      )}
    >
      <h3 className="text-lg font-semibold leading-none tracking-tight">
        {title}
      </h3>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

// --- Body ---

function Body({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("px-6 py-4", className)} {...props}>
      {children}
    </div>
  );
}

// --- Footer ---

function Footer({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("border-t bg-muted/30 px-6 py-3", className)}
      {...props}
    >
      {children}
    </div>
  );
}

// --- Named exports for RSC compatibility ---

export const SectionCardRoot = Root;
export const SectionCardHeader = Header;
export const SectionCardBody = Body;
export const SectionCardFooter = Footer;

// --- Compound export (for client components only) ---

export const SectionCard = {
  Root,
  Header,
  Body,
  Footer,
};
