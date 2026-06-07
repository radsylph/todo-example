import { cn } from "#/lib/utils";
import { useCanGoBack, useRouter } from "@tanstack/react-router";
import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";

interface Props {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  goBack?: boolean;
  breadcrumbs?: React.ReactNode;
}

export function PageContainer({
  title,
  description,
  children,
  className,
  goBack,
  breadcrumbs,
}: Props) {
  const canGoBack = useCanGoBack();
  const router = useRouter();
  return (
    <div className={cn("container p-4", className)}>
      <div className="mb-4 flex flex-col gap-2">
        {breadcrumbs && <div className="mb-2">{breadcrumbs}</div>}
        <>
          {goBack && (
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                canGoBack ? router.history.back() : router.navigate({ to: "/" })
              }
              className="flex items-center gap-2 w-fit rounded-xl"
            >
              <ArrowLeft className="size-4" />
              Return
            </Button>
          )}
        </>
        {title && <h1 className="text-2xl font-bold">{title}</h1>}
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>
      {children}
    </div>
  );
}
