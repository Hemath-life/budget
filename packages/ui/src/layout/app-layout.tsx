interface Props {
  children: React.ReactNode;
  className?: string;
  containerSize?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}

export function AppLayout({
  children,
  className = '',
  containerSize = 'xl',
}: Props) {
  const containerClasses = {
    sm: 'max-w-screen-sm',
    md: 'max-w-screen-md',
    lg: 'max-w-screen-lg',
    xl: 'max-w-screen-xl',
    '2xl': 'max-w-screen-2xl',
    full: 'max-w-none',
  };

  return (
    <div className={`min-h-screen bg-background ${className}`}>
      <div
        className={`container mx-auto px-4 py-8 ${containerClasses[containerSize]}`}
      >
        {children}
      </div>
    </div>
  );
}
