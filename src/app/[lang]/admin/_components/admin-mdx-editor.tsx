"use client";

import {
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  CodeToggle,
  CreateLink,
  headingsPlugin,
  InsertThematicBreak,
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
              <InsertThematicBreak />
            </>
          ),
        }),
        headingsPlugin(),
        listsPlugin(),
        quotePlugin(),
        linkPlugin(),
        linkDialogPlugin(),
        thematicBreakPlugin(),
        markdownShortcutPlugin(),
      ]}
    />
  );
}
