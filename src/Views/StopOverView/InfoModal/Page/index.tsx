import React from 'react';

export interface PageProps {
  className?: string;
  title: string;
  children?: React.ReactNode;
}

export default function Page({ className, children }: PageProps): JSX.Element {
  return (
    <div className={className}>
      {children}
    </div>
  );
}
