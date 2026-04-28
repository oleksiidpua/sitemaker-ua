type Props = {
  children: React.ReactNode;
};

export default function SectionTag({ children }: Props) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-muted">
      <span className="h-1.5 w-1.5 rounded-full bg-lavender-strong" />
      {children}
    </span>
  );
}
