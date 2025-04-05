import { cn } from "@/lib/utils";
import { If } from "./if";

export function PageHeader({
  children,
  className,
  title,
  description,
}: React.PropsWithChildren<{
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
}>) {
  return (
    <div className="border-b">
      <div
        className={cn(
          "flex items-center justify-between py-10 px-6 w-full max-w-screen-xl mx-auto",
          className
        )}
      >
        <div className="flex flex-col gap-4">
          <If condition={title}>
            <PageTitle>{title}</PageTitle>
          </If>
          <If condition={description}>
            <PageDescription>{description}</PageDescription>
          </If>
        </div>

        {children}
      </div>
    </div>
  );
}

export function PageBody(
  props: React.PropsWithChildren<{
    className?: string;
  }>
) {
  return (
    <div className={cn("flex flex-1 flex-col px-6 w-full max-w-screen-xl mx-auto", props.className)}>
      {props.children}
    </div>
  );
}

export function PageTitle(props: React.PropsWithChildren) {
  return (
    <h1 className={"text-3xl font-bold dark:text-white"}>{props.children}</h1>
  );
}

export function PageDescription(props: React.PropsWithChildren) {
  return (
    <div className={"text-sm font-normal text-muted-foreground"}>
      {props.children}
    </div>
  );
}
