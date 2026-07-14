import { body } from "./typography";

export default function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="grid gap-3">
      {items.map((item) => (
        <li key={item} className={`${body} flex gap-4 text-pretty`}>
          <span
            aria-hidden
            className="mt-[.75em] h-px w-5 shrink-0 bg-[var(--color-accent)]"
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
