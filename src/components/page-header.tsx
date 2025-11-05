import { cn } from "@/lib/utils";

export function PageHeader({ 
  title, 
  description, 
  action,
  className 
}: { 
  title: string; 
  description?: string; 
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center justify-between space-y-2 mb-8", className)}>
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">{title}</h1>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
