import * as React from 'react';
import { useIsMobile } from '#modules/common/hooks/useMobile.ts';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Drawer, DrawerContent, DrawerTrigger } from './drawer';
import { cn } from '../../../../lib/utils';

export interface MobileResponsivePanelProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  popoverProps?: {
    align?: 'start' | 'center' | 'end';
    sideOffset?: number;
    side?: 'top' | 'right' | 'bottom' | 'left';
    className?: string;
  };
  drawerProps?: {
    className?: string;
  };
}

/**
 * Mobile-responsive panel that uses Drawer on mobile and Popover on desktop
 */
export function MobileResponsivePanel({
  trigger,
  children,
  open,
  onOpenChange,
  popoverProps = {},
  drawerProps = {},
}: MobileResponsivePanelProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerTrigger asChild>{trigger}</DrawerTrigger>
        <DrawerContent className={cn('p-0', drawerProps.className)}>
          {children}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent
        align={popoverProps.align || 'start'}
        sideOffset={popoverProps.sideOffset || 4}
        side={popoverProps.side || 'bottom'}
        className={cn('p-0', popoverProps.className)}
      >
        {children}
      </PopoverContent>
    </Popover>
  );
}
