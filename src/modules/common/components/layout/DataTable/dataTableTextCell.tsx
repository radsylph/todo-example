import { cn } from '#lib/utils';

type IconComponent = React.ComponentType<{ className?: string }>;

interface Props {
  text?: string | null;
  icon?: IconComponent;
  className?: string;
  maxWidthClass?: string;
  titleAttr?: string;
  iconClassName?: string;
}

export default function DataTableTextCell({
  text,
  icon: Icon,
  className = '',
  iconClassName = '',
  maxWidthClass = 'max-w-[300px]',
  titleAttr,
}: Props) {
  return (
    <div className={cn('flex items-center gap-1', className)}>
      {Icon ? (
        <Icon
          className={cn('size-4 shrink-0 text-muted-foreground', iconClassName)}
        />
      ) : null}
      <p
        className={cn(
          maxWidthClass,
          'truncate',
          !text && 'text-muted-foreground'
        )}
        title={titleAttr ?? text ?? ''}
      >
        {text ?? '-'}
      </p>
    </div>
  );
}
