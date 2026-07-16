"use client";

import dynamic from "next/dynamic";
import "@mdxeditor/editor/style.css";

const MdxEditorInner = dynamic(
  () =>
    import("@mdxeditor/editor").then((mod) => {
      const {
        MDXEditor,
        headingsPlugin,
        listsPlugin,
        quotePlugin,
        codeBlockPlugin,
        linkPlugin,
        imagePlugin,
        tablePlugin,
        thematicBreakPlugin,
        markdownShortcutPlugin,
        linkDialogPlugin,
        toolbarPlugin,
        UndoRedo,
        BoldItalicUnderlineToggles,
        BlockTypeSelect,
        CreateLink,
        InsertCodeBlock,
        InsertImage,
        InsertTable,
        InsertThematicBreak,
        ListsToggle,
      } = mod;

      return function Inner({
        markdown,
        onChange,
        placeholder,
      }: {
        markdown: string;
        onChange: (md: string) => void;
        placeholder?: string;
      }) {
        return (
          <MDXEditor
            markdown={markdown}
            onChange={onChange}
            placeholder={placeholder}
            contentEditableClassName="min-h-[24rem] prose prose-invert max-w-none p-4 text-[0.9rem] leading-relaxed focus:outline-none"
            plugins={[
              toolbarPlugin({
                toolbarContents: () => (
                  <>
                    <UndoRedo />
                    <BlockTypeSelect />
                    <BoldItalicUnderlineToggles />
                    <CreateLink />
                    <InsertCodeBlock />
                    <InsertImage />
                    <InsertTable />
                    <InsertThematicBreak />
                    <ListsToggle />
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
            ]}
          />
        );
      };
    }),
  { ssr: false },
);

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
    <MdxEditorInner markdown={value} onChange={onChange} placeholder={placeholder} />
  );
}
