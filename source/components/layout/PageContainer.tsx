import React from 'react';
import { cn } from '../../lib/utils';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const PageContainer: React.FC<PageContainerProps> = ({
  children,
  className,
}) => {
  return (
    <div
      className={cn(
        'max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6',
        className
      )}
    >
      {children}
    </div>
  );
};