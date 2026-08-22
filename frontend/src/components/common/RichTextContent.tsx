/**
 * @file RichTextContent.tsx
 * @description Safe public renderer for CMS rich text (HTML) or legacy plain text.
 */

import { cn } from '@/lib/utils';
import { looksLikeHtml, sanitizeRichHtml } from '@/lib/sanitizeHtml';

export interface RichTextContentProps {
  content: string | null | undefined;
  className?: string;
  as?: 'div' | 'p' | 'span';
}

/**
 * Renders sanitized HTML when content contains tags; otherwise plain text
 * with newline preservation for backward compatibility.
 */
export function RichTextContent({
  content,
  className,
  as: Tag = 'div',
}: RichTextContentProps) {
  const raw = typeof content === 'string' ? content : '';
  if (!raw.trim()) return null;

  if (looksLikeHtml(raw)) {
    const html = sanitizeRichHtml(raw);
    if (!html) return null;

    return (
      <Tag
        className={cn(
          'rich-text prose prose-sm max-w-none dark:prose-invert font-sans',
          'prose-headings:font-display',
          'prose-body:font-sans prose-p:font-sans prose-p:leading-relaxed',
          'prose-a:text-emerald-700 prose-a:underline prose-a:underline-offset-2',
          'prose-ul:list-disc prose-ul:pl-5 prose-ol:list-decimal prose-ol:pl-5',
          'prose-li:my-0.5 prose-li:marker:text-slate-400',
          '[&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5',
          '[&_a]:text-emerald-700 [&_a]:underline [&_a]:underline-offset-2',
          '[&_p]:font-sans [&_span]:font-sans',
          className
        )}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  return (
    <Tag className={cn('whitespace-pre-line leading-relaxed font-sans', className)}>
      {raw}
    </Tag>
  );
}

export default RichTextContent;
