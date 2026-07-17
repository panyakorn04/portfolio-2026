"use client";

import {
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  CodeToggle,
  CreateLink,
  headingsPlugin,
  InsertImage,
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
  thematicBreakPlugin,
  toolbarPlugin,
  UndoRedo,
} from "@mdxeditor/editor";

import { uploadArticleImage } from "./admin-image-upload";

import "@mdxeditor/editor/style.css";

const editorThemeClass = [
  "dark-theme rounded-md border border-[var(--color-line)] bg-[var(--bg-base)]",
  "[&.mdxeditor-popup-container]:z-50! [&.mdxeditor-popup-container]:overflow-visible!",
  "[--basePageBg:var(--bg-base)]! [--baseBase:var(--bg-base)]!",
  "[--baseBgSubtle:var(--surface)]! [--baseBg:var(--bg-elevated)]!",
  "[--baseBgHover:var(--surface-hover)]! [--baseBgActive:var(--accent-dim)]!",
  "[--baseLine:var(--color-line)]! [--baseBorder:var(--color-line)]!",
  "[--baseBorderHover:var(--color-line-strong)]!",
  "[--baseText:var(--fg-muted)]! [--baseTextContrast:var(--foreground)]!",
  "[--accentText:var(--primary)]! [--accentTextContrast:var(--primary)]!",
].join(" ");

const toolbarThemeClass = [
  "rounded-none! border-b! border-[var(--color-line)]!",
  "bg-[var(--bg-elevated)]! px-3! py-2! shadow-none!",
  "[scrollbar-color:var(--color-line-strong)_transparent]",
  "[&>button]:transition-colors [&>button]:duration-200",
  "[&>button:focus-visible]:outline-2 [&>button:focus-visible]:outline-offset-2",
  "[&>button:focus-visible]:outline-[var(--primary)]",
].join(" ");

const contentThemeClass = [
  "min-h-[24rem] px-5 py-4 focus:outline-none",
  "text-[0.9rem] leading-[1.9] text-[var(--foreground)]",
  "selection:bg-[var(--accent-glow)]",
  "[&_h1]:mt-8 [&_h1]:mb-3 [&_h1]:text-[1.65rem] [&_h1]:font-semibold [&_h1]:leading-[1.2] [&_h1]:tracking-[-0.025em] [&_h1]:text-[var(--color-text)]",
  "[&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:border-t [&_h2]:border-[var(--color-line)] [&_h2]:pt-6 [&_h2]:text-[1.32rem] [&_h2]:font-semibold [&_h2]:leading-[1.3] [&_h2]:text-[var(--color-text)]",
  "[&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:text-[1.12rem] [&_h3]:font-semibold [&_h3]:leading-[1.4] [&_h3]:text-[var(--color-text)]",
  "[&_h4]:mt-5 [&_h4]:mb-2 [&_h4]:text-[1rem] [&_h4]:font-semibold [&_h4]:text-[var(--color-text)]",
  "[&_h5]:mt-4 [&_h5]:mb-2 [&_h5]:text-[0.92rem] [&_h5]:font-semibold [&_h5]:text-[var(--color-text)]",
  "[&_h6]:mt-4 [&_h6]:mb-2 [&_h6]:font-mono [&_h6]:text-[0.78rem] [&_h6]:font-semibold [&_h6]:uppercase [&_h6]:tracking-[0.08em] [&_h6]:text-[var(--color-soft)]",
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
    <MDXEditor
      className={editorThemeClass}
      contentEditableClassName={contentThemeClass}
      markdown={value}
      onChange={onChange}
      placeholder={placeholder}
      plugins={[
        toolbarPlugin({
          toolbarClassName: toolbarThemeClass,
          toolbarContents: () => (
            <>
              <UndoRedo />
              <Separator />
              <BlockTypeSelect />
              <Separator />
              <BoldItalicUnderlineToggles />
              <CodeToggle />
              <Separator />
              <ListsToggle />
              <Separator />
              <CreateLink />
              <InsertImage />
              <InsertThematicBreak />
            </>
          ),
        }),
        headingsPlugin(),
        listsPlugin(),
        quotePlugin(),
        linkPlugin(),
        linkDialogPlugin(),
        imagePlugin({ imageUploadHandler: uploadArticleImage }),
        thematicBreakPlugin(),
        markdownShortcutPlugin(),
      ]}
    />
  );
}
