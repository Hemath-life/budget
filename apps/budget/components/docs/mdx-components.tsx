'use client';

import { cn } from '@/lib/utils';
import * as React from 'react';

// Heading components
function H1({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h1
      className={cn(
        'scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl',
        className
      )}
      {...props}
    />
  );
}

function H2({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={cn(
        'scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 mt-10',
        className
      )}
      {...props}
    />
  );
}

function H3({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        'scroll-m-20 text-2xl font-semibold tracking-tight mt-8',
        className
      )}
      {...props}
    />
  );
}

function H4({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h4
      className={cn(
        'scroll-m-20 text-xl font-semibold tracking-tight mt-6',
        className
      )}
      {...props}
    />
  );
}

// Text components
function P({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn('leading-7 [&:not(:first-child)]:mt-6', className)}
      {...props}
    />
  );
}

function Lead({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn('text-xl text-muted-foreground', className)} {...props} />
  );
}

// List components
function Ul({ className, ...props }: React.HTMLAttributes<HTMLUListElement>) {
  return (
    <ul
      className={cn('my-6 ml-6 list-disc [&>li]:mt-2', className)}
      {...props}
    />
  );
}

function Ol({ className, ...props }: React.HTMLAttributes<HTMLOListElement>) {
  return (
    <ol
      className={cn('my-6 ml-6 list-decimal [&>li]:mt-2', className)}
      {...props}
    />
  );
}

function Li({ className, ...props }: React.HTMLAttributes<HTMLLIElement>) {
  return <li className={cn('', className)} {...props} />;
}

// Code components
function Code({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <code
      className={cn(
        'relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold',
        className
      )}
      {...props}
    />
  );
}

function Pre({ className, ...props }: React.HTMLAttributes<HTMLPreElement>) {
  return (
    <pre
      className={cn(
        'my-4 overflow-x-auto rounded-lg border bg-zinc-950 p-4 dark:bg-zinc-900',
        className
      )}
      {...props}
    />
  );
}

// Table components
function Table({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableElement>) {
  return (
    <div className="my-6 w-full overflow-y-auto">
      <table className={cn('w-full', className)} {...props} />
    </div>
  );
}

function Thead({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className={cn('', className)} {...props} />;
}

function Tbody({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={cn('', className)} {...props} />;
}

function Tr({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={cn('m-0 border-t p-0 even:bg-muted', className)}
      {...props}
    />
  );
}

function Th({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={cn(
        'border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right',
        className
      )}
      {...props}
    />
  );
}

function Td({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableCellElement>) {
  return (
    <td
      className={cn(
        'border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right',
        className
      )}
      {...props}
    />
  );
}

// Blockquote
function Blockquote({
  className,
  ...props
}: React.HTMLAttributes<HTMLQuoteElement>) {
  return (
    <blockquote
      className={cn('mt-6 border-l-2 pl-6 italic', className)}
      {...props}
    />
  );
}

// Horizontal rule
function Hr({ className, ...props }: React.HTMLAttributes<HTMLHRElement>) {
  return <hr className={cn('my-8', className)} {...props} />;
}

// Link
function A({
  className,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      className={cn(
        'font-medium text-primary underline underline-offset-4',
        className
      )}
      {...props}
    />
  );
}

// Callout component
interface CalloutProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: 'default' | 'warning' | 'danger' | 'info';
}

function Callout({
  type = 'default',
  className,
  children,
  ...props
}: CalloutProps) {
  const styles = {
    default: 'bg-muted border-border',
    warning:
      'bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800',
    danger: 'bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800',
    info: 'bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800',
  };

  return (
    <div
      className={cn('my-6 rounded-lg border p-4', styles[type], className)}
      {...props}
    >
      {children}
    </div>
  );
}

// Steps component
function Steps({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('ml-4 border-l pl-8 [counter-reset:step]', className)}
      {...props}
    >
      {children}
    </div>
  );
}

function Step({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'relative pb-8 [counter-increment:step] before:absolute before:-left-[41px] before:flex before:h-8 before:w-8 before:items-center before:justify-center before:rounded-full before:border before:bg-background before:text-sm before:font-medium before:content-[counter(step)]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export const mdxComponents = {
  h1: H1,
  h2: H2,
  h3: H3,
  h4: H4,
  p: P,
  ul: Ul,
  ol: Ol,
  li: Li,
  code: Code,
  pre: Pre,
  table: Table,
  thead: Thead,
  tbody: Tbody,
  tr: Tr,
  th: Th,
  td: Td,
  blockquote: Blockquote,
  hr: Hr,
  a: A,
  // Custom components
  Callout,
  Steps,
  Step,
  Lead,
};

export {
  A,
  Blockquote,
  Callout,
  Code,
  H1,
  H2,
  H3,
  H4,
  Hr,
  Lead,
  Li,
  Ol,
  P,
  Pre,
  Step,
  Steps,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Ul,
};
