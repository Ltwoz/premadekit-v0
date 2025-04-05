interface SectionColumnsProps {
  title: string;
  description?: string;
}

export function SectionColumns({
  title,
  description,
  children,
}: React.PropsWithChildren<SectionColumnsProps>) {
  return (
    <div className="grid grid-cols-1 gap-x-10 gap-y-4 md:grid-cols-10">
      <div className="col-span-4 space-y-1.5">
        <h2 className="text-lg font-semibold leading-none">{title}</h2>
        <p className="text-balance text-sm text-muted-foreground">
          {description}
        </p>
      </div>
      <div className="col-span-6">{children}</div>
    </div>
  );
}
