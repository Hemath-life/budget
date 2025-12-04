import fs from 'fs';
import matter from 'gray-matter';
import path from 'path';

const contentDirectory = path.join(process.cwd(), 'content/docs');

export interface DocMeta {
  slug: string;
  title: string;
  description: string;
  published?: boolean;
}

export interface Doc extends DocMeta {
  content: string;
}

export interface NavItem {
  title: string;
  href: string;
  type: 'page' | 'separator';
}

export interface DocsNavigation {
  title: string;
  items: NavItem[];
}

export function getDocBySlug(slug: string): Doc | null {
  try {
    // Handle nested slugs like "api/transactions"
    const slugPath = Array.isArray(slug) ? slug.join('/') : slug;

    // Try with .mdx extension
    let filePath = path.join(contentDirectory, `${slugPath}.mdx`);

    // If not found, try as directory with index.mdx
    if (!fs.existsSync(filePath)) {
      filePath = path.join(contentDirectory, slugPath, 'index.mdx');
    }

    // If still not found, try just index.mdx for root
    if (!fs.existsSync(filePath) && slugPath === '') {
      filePath = path.join(contentDirectory, 'index.mdx');
    }

    if (!fs.existsSync(filePath)) {
      return null;
    }

    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
      slug: slugPath || 'index',
      title: data.title || 'Untitled',
      description: data.description || '',
      published: data.published !== false,
      content,
    };
  } catch (error) {
    console.error(`Error reading doc: ${slug}`, error);
    return null;
  }
}

export function getDocsNavigation(): DocsNavigation {
  const metaPath = path.join(contentDirectory, 'meta.json');

  if (!fs.existsSync(metaPath)) {
    return { title: 'Documentation', items: [] };
  }

  try {
    const metaContent = fs.readFileSync(metaPath, 'utf8');
    const meta = JSON.parse(metaContent) as { title: string; pages: string[] };

    const items: NavItem[] = [];

    for (const page of meta.pages) {
      // Check if it's a separator (starts and ends with ---)
      if (page.startsWith('---') && page.endsWith('---')) {
        items.push({
          title: page.replace(/^---/, '').replace(/---$/, ''),
          href: '',
          type: 'separator',
        });
        continue;
      }

      // Get the doc to extract title
      const doc = getDocBySlug(page);
      if (doc) {
        items.push({
          title: doc.title,
          href: page === 'index' ? '/docs' : `/docs/${page}`,
          type: 'page',
        });
      }
    }

    return {
      title: meta.title,
      items,
    };
  } catch (error) {
    console.error('Error reading meta.json:', error);
    return { title: 'Documentation', items: [] };
  }
}

export function getAllDocs(): DocMeta[] {
  const docs: DocMeta[] = [];

  function readDirectory(dir: string, basePath: string = '') {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        readDirectory(fullPath, path.join(basePath, entry.name));
      } else if (entry.name.endsWith('.mdx')) {
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data } = matter(fileContents);

        const slug =
          entry.name === 'index.mdx'
            ? basePath
            : path.join(basePath, entry.name.replace('.mdx', ''));

        if (data.published !== false) {
          docs.push({
            slug: slug || 'index',
            title: data.title || 'Untitled',
            description: data.description || '',
            published: data.published !== false,
          });
        }
      }
    }
  }

  if (fs.existsSync(contentDirectory)) {
    readDirectory(contentDirectory);
  }

  return docs;
}

export function getDocSlugs(): string[][] {
  const docs = getAllDocs();
  return docs.map((doc) => {
    if (doc.slug === 'index') return [];
    return doc.slug.split('/');
  });
}
