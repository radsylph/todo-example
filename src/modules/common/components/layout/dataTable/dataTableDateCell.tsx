import { Calendar } from 'lucide-react';
import { RelativeTimeCard } from '#components/ui/relative-time-card';
import { cn } from '#lib/utils';
import { m } from "#/paraglide/messages";

interface Props {
  date: Date | string | number | null;
  className?: string;
}

export default function DataTableDateCell({ date, className }: Props) {
  return (
    <div className={cn('flex items-center gap-1', className)}>
      <Calendar className="size-4 text-muted-foreground" />
      {date ? (
        <RelativeTimeCard date={date} />
      ) : (
        <p className="text-muted-foreground">{m.data_table_not_available()}</p>
      )}
    </div>
  );
}
