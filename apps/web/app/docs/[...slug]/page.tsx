import { MarkdownRenderer } from '@/components/docs/markdown-renderer';
import { getDocBySlug, getDocSlugs } from '@/lib/docs';
import { notFound } from 'next/navigation';

interface DocPageProps {
  params: Promise<{
    slug: string[];
  }>;
}

export async function generateStaticParams() {
  const slugs = getDocSlugs();
  return slugs.map((slug) => ({
    slug: slug,
  }));
}

export default async function DocPage({ params }: DocPageProps) {
  const { slug } = await params;
  const slugPath = slug?.join('/') || 'index';
  const doc = getDocBySlug(slugPath);

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
