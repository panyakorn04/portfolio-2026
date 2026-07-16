"use client";

import {
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  codeBlockPlugin,
  diffSourcePlugin,
  headingsPlugin,
  InsertCodeBlock,
  InsertImage,
  InsertTable,
  InsertThematicBreak,
  imagePlugin,
  ListsToggle,
  linkDialogPlugin,
  linkPlugin,
  listsPlugin,
  MDXEditor,
  markdownShortcutPlugin,
  quotePlugin,
  Separator,
  tablePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
  UndoRedo,
} from "@mdxeditor/editor";

const editorClass = [
  /* ── base ── */
  "[&_.mdxeditor-toolbar]:flex [&_.mdxeditor-toolbar]:items-center [&_.mdxeditor-toolbar]:gap-1",
  "[&_.mdxeditor-toolbar]:border-b [&_.mdxeditor-toolbar]:border-[var(--color-line)]",
  "[&_.mdxeditor-toolbar]:bg-[var(--bg-elevated)]",
  "[&_.mdxeditor-toolbar]:px-3 [&_.mdxeditor-toolbar]:py-2",
  "[&_.mdxeditor-toolbar]:sticky [&_.mdxeditor-toolbar]:top-0 [&_.mdxeditor-toolbar]:z-10",
  "[&_.mdxeditor-toolbar]:overflow-x-auto",
  /* ── toolbar buttons ── */
  "[&_.mdxeditor-toolbar>button]:flex [&_.mdxeditor-toolbar>button]:items-center [&_.mdxeditor-toolbar>button]:justify-center",
  "[&_.mdxeditor-toolbar>button]:size-7",
  "[&_.mdxeditor-toolbar>button]:shrink-0",
  "[&_.mdxeditor-toolbar>button]:rounded-[0.2rem]",
  "[&_.mdxeditor-toolbar>button]:text-[var(--fg-muted)]",
  "[&_.mdxeditor-toolbar>button]:transition-colors",
  "[&_.mdxeditor-toolbar>button]:hover:text-[var(--foreground)]",
  "[&_.mdxeditor-toolbar>button]:hover:bg-[var(--surface-hover)]",
  "[&_.mdxeditor-toolbar>button[aria-pressed=true]]:text-[var(--primary)]",
  "[&_.mdxeditor-toolbar>button[aria-pressed=true]]:bg-[var(--accent-dim)]",
  /* ── toolbar select ── */
  "[&_.mdxeditor-toolbar_select]:h-7 [&_.mdxeditor-toolbar_select]:rounded-[0.2rem]",
  "[&_.mdxeditor-toolbar_select]:border [&_.mdxeditor-toolbar_select]:border-[var(--color-line)]",
  "[&_.mdxeditor-toolbar_select]:bg-[var(--bg-base)]",
  "[&_.mdxeditor-toolbar_select]:px-2 [&_.mdxeditor-toolbar_select]:text-[0.75rem]",
  "[&_.mdxeditor-toolbar_select]:text-[var(--fg-muted)]",
  "[&_.mdxeditor-toolbar_select]:outline-none",
  "[&_.mdxeditor-toolbar_select]:focus:border-[var(--primary)]",
  /* ── toolbar icons ── */
  "[&_.mdxeditor-toolbar_svg]:size-3.5",
  /* ── code mirror ── */
  "[&_.cm-editor]:bg-[var(--bg-base)]",
  "[&_.cm-editor]:text-[0.82rem]",
  "[&_.cm-editor_.cm-scroller]:font-mono",
  "[&_.cm-editor_.cm-activeLine]:bg-[var(--surface)]",
  "[&_.cm-editor_.cm-cursor]:border-[var(--primary)]",
  "[&_.cm-editor_.cm-selectionBackground]:bg-[var(--accent-dim)]",
  /* ── content ── */
  "focus:outline-none",
].join(" ");

const contentClass = [
  "min-h-[24rem] px-5 py-4",
  "text-[0.9rem] leading-[1.9] text-[var(--foreground)]",
  "focus:outline-none",
  /* ── headings ── */
  "[&_h1]:text-[1.6rem] [&_h1]:font-semibold [&_h1]:tracking-[-0.03em] [&_h1]:mt-6 [&_h1]:mb-3",
  "[&_h2]:text-[1.3rem] [&_h2]:font-semibold [&_h2]:tracking-[-0.02em] [&_h2]:mt-5 [&_h2]:mb-2",
  "[&_h3]:text-[1.1rem] [&_h3]:font-semibold [&_h3]:mt-4 [&_h3]:mb-2",
  /* ── body ── */
  "[&_p]:my-2",
  "[&_ul]:list-disc [&_ul]:ml-5 [&_ol]:list-decimal [&_ol]:ml-5",
  "[&_li]:my-1",
  /* ── code ── */
  "[&_code]:rounded [&_code]:bg-[var(--surface)] [&_code]:px-1.5 [&_code]:py-0.5",
  "[&_code]:font-mono [&_code]:text-[0.84em] [&_code]:text-[var(--primary)]",
  "[&_pre]:rounded [&_pre]:border [&_pre]:border-[var(--color-line)]",
  "[&_pre]:bg-[#090b0a] [&_pre]:p-4 [&_pre]:my-3",
  "[&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-[var(--foreground)]",
  /* ── blockquote ── */
  "[&_blockquote]:border-l-2 [&_blockquote]:border-[var(--primary)]",
  "[&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-[var(--fg-muted)]",
  /* ── link ── */
  "[&_a]:text-[var(--primary)] [&_a]:underline [&_a]:underline-offset-2",
  /* ── media ── */
  "[&_img]:rounded [&_img]:border [&_img]:border-[var(--color-line)]",
  "[&_img]:max-w-full [&_img]:h-auto [&_img]:my-4",
  "[&_hr]:border-[var(--color-line)] [&_hr]:my-6",
].join(" ");

export default function MdxEditorField({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div className={editorClass}>
      <MDXEditor
        markdown={value}
        onChange={onChange}
        placeholder={placeholder}
        contentEditableClassName={contentClass}
        plugins={[
          toolbarPlugin({
            toolbarContents: () => (
              <>
                <UndoRedo />
                <Separator />
                <BlockTypeSelect />
                <Separator />
                <BoldItalicUnderlineToggles />
                <Separator />
                <ListsToggle />
                <InsertCodeBlock />
                <InsertImage />
                <InsertTable />
                <InsertThematicBreak />
              </>
            ),
          }),
          headingsPlugin(),
          listsPlugin(),
          quotePlugin(),
          codeBlockPlugin(),
          linkPlugin(),
          linkDialogPlugin(),
          imagePlugin(),
          tablePlugin(),
          thematicBreakPlugin(),
          markdownShortcutPlugin(),
          diffSourcePlugin(),
        ]}
      />
    </div>
  );
}
