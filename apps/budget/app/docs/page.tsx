import { MarkdownRenderer } from '@/components/docs/markdown-renderer';
import { getDocBySlug } from '@/lib/docs';
import { notFound } from 'next/navigation';

export default async function DocsPage() {
  const doc = getDocBySlug('index');

  if (!doc) {
    notFound();
  }

  return (
    <article className="prose prose-neutral dark:prose-invert max-w-none">
      <div className="space-y-2 pb-8 border-b">
        <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">
          {doc.title}
        </h1>
        {doc.description && (
          <p className="text-xl text-muted-foreground">{doc.description}</p>
        )}
      </div>
      <div className="pt-8">
        <MarkdownRenderer content={doc.content} />
      </div>
    </article>
  );
}
