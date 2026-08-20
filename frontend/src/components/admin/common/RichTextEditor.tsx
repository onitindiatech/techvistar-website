/**
 * @file RichTextEditor.tsx
 * @description Reusable TipTap rich text editor for Veenero CMS admin forms.
 */

import { useEffect, useMemo, useCallback, useState } from 'react';
import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  List,
  ListOrdered,
  ListTodo,
  Quote,
  Code,
  Code2,
  Minus,
  Link2,
  Undo2,
  Redo2,
  RemoveFormatting,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  normalizeRichContent,
  plainTextToHtml,
  looksLikeHtml,
  stripHtmlToText,
} from '@/lib/sanitizeHtml';

export interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  label?: string;
  helperText?: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  minHeightClassName?: string;
  className?: string;
  showCharCount?: boolean;
}

type ToolbarBtnProps = {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
};

function ToolbarBtn({ onClick, active, disabled, title, children }: ToolbarBtnProps) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      disabled={disabled}
      onMouseDown={(e) => {
        e.preventDefault();
        onClick();
      }}
      className={cn(
        'inline-flex h-8 w-8 items-center justify-center rounded-lg border border-transparent text-slate-600 transition-colors',
        'hover:bg-slate-100 hover:text-slate-900',
        'dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40 focus-visible:ring-offset-1',
        'disabled:pointer-events-none disabled:opacity-40',
        active &&
          'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900'
      )}
    >
      {children}
    </button>
  );
}

function ToolbarDivider() {
  return <span className="mx-0.5 hidden h-5 w-px bg-slate-200 dark:bg-slate-700 sm:block" aria-hidden />;
}

function normalizeHref(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return '';
  if (/^(https?:|mailto:|tel:)/i.test(trimmed)) return trimmed;
  if (trimmed.startsWith('/') || trimmed.startsWith('#')) return trimmed;
  return `https://${trimmed}`;
}

function setLink(editor: Editor) {
  const previous = editor.getAttributes('link').href as string | undefined;
  const url = window.prompt('Enter URL', previous || 'https://');
  if (url === null) return;

  const trimmed = url.trim();
  if (!trimmed) {
    editor.chain().focus().extendMarkRange('link').unsetLink().run();
    return;
  }

  const href = normalizeHref(trimmed);
  const { empty, from, to } = editor.state.selection;

  // TipTap needs a non-empty range to apply a mark; expand to word if caret-only.
  if (empty) {
    editor
      .chain()
      .focus()
      .extendMarkRange('link')
      .setLink({
        href,
        target: '_blank',
        rel: 'noopener noreferrer',
      })
      .run();

    // If still no selection/word to mark, insert linked text
    if (!editor.isActive('link')) {
      editor
        .chain()
        .focus()
        .insertContent(`<a href="${href}" target="_blank" rel="noopener noreferrer">${href}</a>`)
        .run();
    }
    return;
  }

  editor
    .chain()
    .focus()
    .setTextSelection({ from, to })
    .setLink({
      href,
      target: '_blank',
      rel: 'noopener noreferrer',
    })
    .run();
}

function clearFormatting(editor: Editor) {
  const { empty, from } = editor.state.selection;

  const chain = editor.chain().focus();
  if (empty) {
    // Apply to the current block / mark range when caret has no selection
    chain.selectParentNode().unsetAllMarks().clearNodes().setTextSelection(from).run();
    return;
  }

  chain.unsetAllMarks().clearNodes().run();
}

function EditorToolbar({ editor, disabled }: { editor: Editor | null; disabled?: boolean }) {
  if (!editor) return null;

  const icon = 'h-3.5 w-3.5';

  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-0.5 border-b border-slate-200/80 bg-slate-50/80 px-2 py-1.5',
        'dark:border-slate-700 dark:bg-slate-900/60'
      )}
    >
      <ToolbarBtn title="Undo (Ctrl+Z)" disabled={disabled || !editor.can().undo()} onClick={() => editor.chain().focus().undo().run()}>
        <Undo2 className={icon} />
      </ToolbarBtn>
      <ToolbarBtn title="Redo (Ctrl+Y)" disabled={disabled || !editor.can().redo()} onClick={() => editor.chain().focus().redo().run()}>
        <Redo2 className={icon} />
      </ToolbarBtn>

      <ToolbarDivider />

      <ToolbarBtn title="Heading 1" active={editor.isActive('heading', { level: 1 })} disabled={disabled} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
        <Heading1 className={icon} />
      </ToolbarBtn>
      <ToolbarBtn title="Heading 2" active={editor.isActive('heading', { level: 2 })} disabled={disabled} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
        <Heading2 className={icon} />
      </ToolbarBtn>
      <ToolbarBtn title="Heading 3" active={editor.isActive('heading', { level: 3 })} disabled={disabled} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
        <Heading3 className={icon} />
      </ToolbarBtn>
      <ToolbarBtn title="Heading 4" active={editor.isActive('heading', { level: 4 })} disabled={disabled} onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}>
        <Heading4 className={icon} />
      </ToolbarBtn>

      <ToolbarDivider />

      <ToolbarBtn title="Bold (Ctrl+B)" active={editor.isActive('bold')} disabled={disabled} onClick={() => editor.chain().focus().toggleBold().run()}>
        <Bold className={icon} />
      </ToolbarBtn>
      <ToolbarBtn title="Italic (Ctrl+I)" active={editor.isActive('italic')} disabled={disabled} onClick={() => editor.chain().focus().toggleItalic().run()}>
        <Italic className={icon} />
      </ToolbarBtn>
      <ToolbarBtn title="Underline (Ctrl+U)" active={editor.isActive('underline')} disabled={disabled} onClick={() => editor.chain().focus().toggleUnderline().run()}>
        <UnderlineIcon className={icon} />
      </ToolbarBtn>
      <ToolbarBtn title="Strike" active={editor.isActive('strike')} disabled={disabled} onClick={() => editor.chain().focus().toggleStrike().run()}>
        <Strikethrough className={icon} />
      </ToolbarBtn>
      <ToolbarBtn title="Inline code" active={editor.isActive('code')} disabled={disabled} onClick={() => editor.chain().focus().toggleCode().run()}>
        <Code className={icon} />
      </ToolbarBtn>

      <ToolbarDivider />

      <ToolbarBtn title="Bullet list" active={editor.isActive('bulletList')} disabled={disabled} onClick={() => editor.chain().focus().toggleBulletList().run()}>
        <List className={icon} />
      </ToolbarBtn>
      <ToolbarBtn title="Ordered list" active={editor.isActive('orderedList')} disabled={disabled} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
        <ListOrdered className={icon} />
      </ToolbarBtn>
      <ToolbarBtn title="Task list" active={editor.isActive('taskList')} disabled={disabled} onClick={() => editor.chain().focus().toggleTaskList().run()}>
        <ListTodo className={icon} />
      </ToolbarBtn>
      <ToolbarBtn title="Blockquote" active={editor.isActive('blockquote')} disabled={disabled} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
        <Quote className={icon} />
      </ToolbarBtn>
      <ToolbarBtn title="Code block" active={editor.isActive('codeBlock')} disabled={disabled} onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
        <Code2 className={icon} />
      </ToolbarBtn>
      <ToolbarBtn title="Horizontal rule" disabled={disabled} onClick={() => editor.chain().focus().setHorizontalRule().run()}>
        <Minus className={icon} />
      </ToolbarBtn>

      <ToolbarDivider />

      <ToolbarBtn title="Hyperlink" active={editor.isActive('link')} disabled={disabled} onClick={() => setLink(editor)}>
        <Link2 className={icon} />
      </ToolbarBtn>
      <ToolbarBtn
        title="Clear formatting"
        disabled={disabled}
        onClick={() => clearFormatting(editor)}
      >
        <RemoveFormatting className={icon} />
      </ToolbarBtn>
    </div>
  );
}

function toEditorHtml(value: string): string {
  if (!value?.trim()) return '';
  return looksLikeHtml(value) ? value : plainTextToHtml(value);
}

export function RichTextEditor({
  value,
  onChange,
  label,
  helperText,
  placeholder = 'Start writing…',
  error,
  disabled = false,
  required = false,
  minHeightClassName = 'min-h-[160px]',
  className,
  showCharCount = true,
}: RichTextEditorProps) {
  const [ready, setReady] = useState(false);

  const extensions = useMemo(
    () => [
      // TipTap v3 StarterKit already includes Link + Underline — do NOT re-register them.
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4] },
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
          HTMLAttributes: { class: 'list-disc pl-5 my-2 space-y-1' },
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
          HTMLAttributes: { class: 'list-decimal pl-5 my-2 space-y-1' },
        },
        listItem: {
          HTMLAttributes: { class: 'leading-relaxed' },
        },
        codeBlock: {
          HTMLAttributes: {
            class: 'rounded-lg bg-slate-900 text-slate-100 p-3 text-xs font-mono',
          },
        },
        link: {
          openOnClick: false,
          autolink: true,
          linkOnPaste: true,
          defaultProtocol: 'https',
          HTMLAttributes: {
            class: 'text-emerald-700 underline underline-offset-2 dark:text-emerald-400',
            rel: 'noopener noreferrer',
            target: '_blank',
          },
        },
      }),
      Placeholder.configure({ placeholder }),
      TaskList.configure({
        HTMLAttributes: { class: 'rich-task-list list-none pl-0 space-y-1' },
      }),
      TaskItem.configure({
        nested: true,
        HTMLAttributes: { class: 'flex items-start gap-2' },
      }),
    ],
    [placeholder]
  );

  const emitChange = useCallback(
    (editor: Editor) => {
      onChange(normalizeRichContent(editor.getHTML()));
    },
    [onChange]
  );

  const editor = useEditor({
    extensions,
    content: toEditorHtml(value),
    editable: !disabled,
    editorProps: {
      attributes: {
        class: cn(
          'rich-text prose prose-sm max-w-none dark:prose-invert focus:outline-none px-3 py-2.5 text-slate-800 dark:text-slate-100',
          'prose-headings:font-display prose-a:text-emerald-700',
          '[&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:my-0.5',
          '[&_a]:text-emerald-700 [&_a]:underline',
          minHeightClassName
        ),
      },
    },
    onUpdate: ({ editor: ed }) => emitChange(ed),
    onCreate: () => setReady(true),
  });

  // Sync external value (edit modal open / reset) without fighting typing
  useEffect(() => {
    if (!editor) return;
    const incoming = toEditorHtml(value);
    const current = normalizeRichContent(editor.getHTML());
    const next = normalizeRichContent(incoming);
    if (current !== next) {
      editor.commands.setContent(incoming || '', false);
    }
  }, [value, editor]);

  useEffect(() => {
    if (!editor) return;
    editor.setEditable(!disabled);
  }, [disabled, editor]);

  const charCount = stripHtmlToText(value).length;

  return (
    <div className={cn('space-y-2', className)}>
      {(label || showCharCount) && (
        <div className="flex items-center justify-between gap-3">
          {label ? (
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {label}
              {required ? ' *' : ''}
            </label>
          ) : (
            <span />
          )}
          {showCharCount && (
            <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
              {charCount} chars
            </span>
          )}
        </div>
      )}

      <div
        className={cn(
          'overflow-hidden rounded-xl border bg-white shadow-sm transition-shadow',
          'dark:bg-slate-950',
          error
            ? 'border-red-500 focus-within:ring-2 focus-within:ring-red-400/30'
            : 'border-slate-200 focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-500/20 dark:border-slate-700'
        )}
      >
        {!ready && (
          <div className={cn('flex items-center justify-center gap-2 bg-slate-50 text-slate-400 dark:bg-slate-900', minHeightClassName)}>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-xs font-medium">Loading editor…</span>
          </div>
        )}

        <div className={cn(!ready && 'hidden')}>
          <EditorToolbar editor={editor} disabled={disabled} />
          <EditorContent editor={editor} />
        </div>
      </div>

      {helperText && !error && (
        <p className="text-[10px] font-medium text-slate-400">{helperText}</p>
      )}
      {error && (
        <p className="text-[10px] font-bold uppercase tracking-wider text-red-500">{error}</p>
      )}
    </div>
  );
}

export default RichTextEditor;
