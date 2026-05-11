import type { VariantProps } from 'class-variance-authority';
import { Badge, badgeVariants } from '../../ui/badge';
import { cn } from '../../../../../lib/utils';

type IconComponent = React.ComponentType<{ className?: string }>;

type BadgeItem = {
  text: string;
  icon?: IconComponent;
  className?: string;
  maxWidthClass?: string;
  titleAttr?: string;
  variant?: VariantProps<typeof badgeVariants>['variant'];
};

interface SingleBadgeProps {
  multiple?: false;
  text: string;
  icon?: IconComponent;
  className?: string;
  maxWidthClass?: string;
  titleAttr?: string;
  variant?: VariantProps<typeof badgeVariants>['variant'];
}

interface MultipleBadgeProps {
  multiple: true;
  badges: BadgeItem[];
  className?: string;
}

type Props = SingleBadgeProps | MultipleBadgeProps;

export default function DataTableBadgeCell(props: Props) {
  if (props.multiple) {
    const { badges, className = '' } = props;
    return (
      <div className={cn('flex flex-wrap gap-1', className)}>
        {badges.map((badge, index) => {
          const {
            text,
            icon: Icon,
            className: badgeClassName = '',
            maxWidthClass = 'max-w-[300px]',
            titleAttr,
            variant = 'default',
          } = badge;

          return (
            <Badge key={index} variant={variant} className={badgeClassName}>
              <span className="flex items-center gap-1">
                {Icon ? <Icon className="size-3 shrink-0" /> : null}
                <span
                  className={cn(maxWidthClass, 'truncate')}
                  title={titleAttr ?? text}
                >
                  {text}
                </span>
              </span>
            </Badge>
          );
        })}
      </div>
    );
  }

  const {
    text,
    icon: Icon,
    className = '',
    maxWidthClass = 'max-w-[300px]',
    titleAttr,
    variant = 'default',
  } = props;

  return (
    <div className={cn('flex items-center', className)}>
      <Badge variant={variant}>
        <span className="flex items-center gap-1">
          {Icon ? <Icon className="size-3 shrink-0" /> : null}
          <span
            className={cn(maxWidthClass, 'truncate')}
            title={titleAttr ?? text}
          >
            {text}
          </span>
        </span>
      </Badge>
    </div>
  );
}
