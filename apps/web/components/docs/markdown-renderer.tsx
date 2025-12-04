'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { mdxComponents } from './mdx-components';

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ children }) => <mdxComponents.h1>{children}</mdxComponents.h1>,
        h2: ({ children }) => <mdxComponents.h2>{children}</mdxComponents.h2>,
        h3: ({ children }) => <mdxComponents.h3>{children}</mdxComponents.h3>,
        h4: ({ children }) => <mdxComponents.h4>{children}</mdxComponents.h4>,
        p: ({ children }) => <mdxComponents.p>{children}</mdxComponents.p>,
        ul: ({ children }) => <mdxComponents.ul>{children}</mdxComponents.ul>,
        ol: ({ children }) => <mdxComponents.ol>{children}</mdxComponents.ol>,
        li: ({ children }) => <mdxComponents.li>{children}</mdxComponents.li>,
        code: ({ className, children, ...props }) => {
          const isInline = !className;
          if (isInline) {
            return (
              <mdxComponents.code {...props}>{children}</mdxComponents.code>
            );
          }
          return (
            <code className={className} {...props}>
              {children}
            </code>
          );
        },
        pre: ({ children }) => (
          <mdxComponents.pre>{children}</mdxComponents.pre>
        ),
        table: ({ children }) => (
          <mdxComponents.table>{children}</mdxComponents.table>
        ),
        thead: ({ children }) => (
          <mdxComponents.thead>{children}</mdxComponents.thead>
        ),
        tbody: ({ children }) => (
          <mdxComponents.tbody>{children}</mdxComponents.tbody>
        ),
        tr: ({ children }) => <mdxComponents.tr>{children}</mdxComponents.tr>,
        th: ({ children }) => <mdxComponents.th>{children}</mdxComponents.th>,
        td: ({ children }) => <mdxComponents.td>{children}</mdxComponents.td>,
        blockquote: ({ children }) => (
          <mdxComponents.blockquote>{children}</mdxComponents.blockquote>
        ),
        hr: () => <mdxComponents.hr />,
        a: ({ href, children }) => (
          <mdxComponents.a href={href}>{children}</mdxComponents.a>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
