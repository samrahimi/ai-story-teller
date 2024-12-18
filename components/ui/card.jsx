import * as React from 'react';
import { cn } from '@/lib/utils';

const Card = React.forwardRef(({ className, ...props }, ref) => (
  <div style={{maxWidth: "800px"}}
    ref={ref}
    className={cn(
      'rounded-lg border-blue-100 bg-card text-card-foreground shadow-sm w-full',
      className
    )}
    {...props}
  />
));
Card.displayName = 'Card';

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
));
CardContent.displayName = 'CardContent';

export { Card, CardContent };
